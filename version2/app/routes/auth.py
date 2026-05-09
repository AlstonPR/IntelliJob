from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schema import User, Resume, UserPreference
from app.auth.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import aiofiles
import os
import shutil

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import JWTError, jwt
    from app.auth.security import SECRET_KEY, ALGORITHM
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    preferred_roles: str = Form(...),
    preferred_domains: str = Form(...),
    preferred_locations: str = Form(...),
    company_preference: str = Form(...),
    work_mode: str = Form(...),
    experience_level: str = Form(...),
    github_username: str = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if user exists
    db_user = db.query(User).filter(User.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create User
    hashed_password = get_password_hash(password)
    new_user = User(name=name, email=email, password_hash=hashed_password, github_username=github_username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Save Resume PDF
    resume_path = f"app/uploads/resumes/{new_user.id}_{resume.filename}"
    async with aiofiles.open(resume_path, 'wb') as out_file:
        content = await resume.read()
        await out_file.write(content)

    new_resume = Resume(user_id=new_user.id, filename=resume_path)
    db.add(new_resume)

    # Save Preferences
    prefs = UserPreference(
        user_id=new_user.id,
        preferred_roles=preferred_roles,
        preferred_domains=preferred_domains,
        preferred_locations=preferred_locations,
        company_preference=company_preference,
        work_mode=work_mode,
        experience_level=experience_level
    )
    db.add(prefs)
    db.commit()

    # Trigger Resume Parsing (Background or inline)
    # We will do this inline for simplicity or call a service function
    # TODO: Call resume_parser_service(new_user.id, resume_path)
    
    from app.services.github_service import fetch_and_save_github_projects
    if github_username:
        await fetch_and_save_github_projects(db, new_user.id, github_username)

    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
