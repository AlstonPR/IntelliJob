from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schema import User, Resume, Job
from app.routes.auth import get_current_user
from app.services.resume_parser import parse_resume_to_db
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/list")
async def list_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes

@router.post("/process/{resume_id}")
async def process_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    # Process it synchronously for now
    parse_resume_to_db(db, current_user.id, resume.filename)
    return {"message": "Resume processed successfully"}

@router.get("/download/{job_id}")
async def download_resume(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    safe_title = job.title.replace(' ', '_').replace('/', '_')
    file_path = f"app/uploads/generated_resumes/tailored_{current_user.id}_{safe_title}.pdf"
    
    if not os.path.exists(file_path):
        # Fallback to .txt if pdf compilation failed
        file_path = file_path.replace('.pdf', '.txt')
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Resume file not found")
            
    return FileResponse(path=file_path, filename=f"Tailored_Resume_{safe_title}.pdf")
