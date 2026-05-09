from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from src.database.core import get_db
from src.database.models import User, Preference
from src.auth.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default preference
    pref = Preference(user_id=new_user.id)
    db.add(pref)
    db.commit()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from src.auth.dependencies import get_current_user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = db.query(Preference).filter(Preference.user_id == current_user.id).first()
    keywords = []
    if pref and pref.extracted_keywords:
        try:
            keywords = json.loads(pref.extracted_keywords)
        except:
            pass
            
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "preferences": pref.preferred_roles if pref else "",
        "preferences_keywords": keywords
    }

class PreferenceUpdate(BaseModel):
    preferences: str

from src.services.preference_analyzer import extract_preference_keywords
import json

@router.post("/preferences")
def update_preferences(data: PreferenceUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    keywords = extract_preference_keywords(data.preferences)
    
    pref = db.query(Preference).filter(Preference.user_id == current_user.id).first()
    if pref:
        pref.preferred_roles = data.preferences
        pref.extracted_keywords = json.dumps(keywords)
    else:
        pref = Preference(user_id=current_user.id, preferred_roles=data.preferences, extracted_keywords=json.dumps(keywords))
        db.add(pref)
    db.commit()
    return {"status": "success", "keywords": keywords}
