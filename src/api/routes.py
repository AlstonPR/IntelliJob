from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import Job, Application, Notification
from src.agents.graph import career_agent_workflow
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class RunWorkflowRequest(BaseModel):
    user_id: int = 1

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.post("/workflow/trigger")
def trigger_agent_workflow(request: RunWorkflowRequest, background_tasks: BackgroundTasks):
    """
    Triggers the LangGraph workflow in the background.
    """
    initial_state = {
        "user_id": request.user_id,
        "discovered_jobs": [],
        "filtered_jobs": [],
        "ranked_jobs": [],
        "current_job": None,
        "tailored_resume_content": None,
        "interview_questions": [],
        "application_status": None,
        "messages": []
    }
    
    def run_graph():
        result = career_agent_workflow.invoke(initial_state)
        # Note: In a real app, you would save the final result to the DB here.
        print("Workflow finished:")
        print(result["messages"])
        
    background_tasks.add_task(run_graph)
    return {"status": "Workflow triggered asynchronously"}

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return {"jobs": jobs}

@router.get("/applications")
def get_applications(db: Session = Depends(get_db)):
    apps = db.query(Application).all()
    return {"applications": apps}

@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db)):
    nots = db.query(Notification).order_by(Notification.sent_at.desc()).all()
    return {"notifications": nots}

@router.post("/apply")
def apply_for_job(job_id: int):
    return {"status": "success", "message": f"Application workflow started for job {job_id}."}

@router.post("/resume/optimize")
def optimize_resume(user_id: int):
    return {"status": "success", "message": "Optimization started."}


from fastapi import UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, RedirectResponse
import os
import shutil
import json
from src.auth.dependencies import get_current_user
from src.database.models import User, ResumeAnalysis
from src.services.resume_parser import analyze_resume_with_ai

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/resume/upload")
async def upload_resume(background_tasks: BackgroundTasks, file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_resume.pdf")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    def process_and_save():
        analysis_data = analyze_resume_with_ai(file_path)
        # Check if analysis exists
        analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).first()
        if not analysis:
            analysis = ResumeAnalysis(user_id=current_user.id)
            db.add(analysis)
            
        analysis.ats_score = analysis_data.get("ats_score", 0)
        analysis.skills_match = analysis_data.get("skills_match", 0)
        analysis.experience_level = analysis_data.get("experience_level", 0)
        analysis.suggested_roles = json.dumps(analysis_data.get("suggested_roles", []))
        analysis.extracted_skills = json.dumps(analysis_data.get("extracted_skills", []))
        analysis.weak_areas = json.dumps(analysis_data.get("weak_areas", []))
        db.commit()
        
    background_tasks.add_task(process_and_save)
        
    return {"status": "success", "filename": file.filename, "size": os.path.getsize(file_path)}

@router.get("/resume/analysis")
def get_resume_analysis(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).first()
    if not analysis:
        return {"status": "pending"}
        
    return {
        "status": "completed",
        "ats_score": analysis.ats_score,
        "skills_match": analysis.skills_match,
        "experience_level": analysis.experience_level,
        "suggested_roles": json.loads(analysis.suggested_roles) if analysis.suggested_roles else [],
        "extracted_skills": json.loads(analysis.extracted_skills) if analysis.extracted_skills else [],
        "weak_areas": json.loads(analysis.weak_areas) if analysis.weak_areas else []
    }

@router.get("/resume/status")
def get_resume_status(current_user: User = Depends(get_current_user)):
    file_path = os.path.join(UPLOAD_DIR, f"{current_user.id}_resume.pdf")
    if os.path.exists(file_path):
        # We don't store original filename, so we return a generic one
        return {"uploaded": True, "filename": "Uploaded_Resume.pdf"}
    return {"uploaded": False}

from src.database.models import Preference
from src.services.gap_analyzer import analyze_skill_gaps

@router.get("/resume/gap-analysis")
def get_gap_analysis(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == current_user.id).first()
    pref = db.query(Preference).filter(Preference.user_id == current_user.id).first()
    
    if not analysis or not pref or not pref.preferred_roles:
        return {"missing_skills": [], "suggestions": []}
        
    resume_skills = json.loads(analysis.extracted_skills) if analysis.extracted_skills else []
    
    result = analyze_skill_gaps(pref.preferred_roles, resume_skills)
    return result

@router.get("/jobs/{job_id}")
def get_job(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

from src.services.latex_service import generate_tailored_resume

@router.post("/jobs/{job_id}/approve")
def approve_job_post(job_id: int, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    app = db.query(Application).filter(Application.job_id == job.id, Application.user_id == current_user.id).first()
    if not app:
        app = Application(job_id=job.id, user_id=current_user.id, status="Approved")
        db.add(app)
        db.commit()
    
    background_tasks.add_task(generate_tailored_resume, current_user.id, job.id)
    return {"message": "Job approved successfully", "application_id": app.id}

from src.services.scheduler import run_agent_for_user

@router.post("/agent/trigger")
def trigger_agent(background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)):
    if not current_user.email:
        raise HTTPException(status_code=400, detail="User email is required to send matches")
        
    background_tasks.add_task(run_agent_for_user, current_user.id, current_user.email)
    return {"message": "Agent triggered. You will receive an email with matches shortly."}

@router.get("/jobs/approved")
def get_approved_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.user_id == current_user.id, Application.status == "Approved").all()
    jobs = [app.job for app in apps]
    return {"jobs": jobs}

@router.get("/resumes/tailored")
def get_tailored_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id, Resume.is_base == False).all()
    result = []
    for r in resumes:
        job = db.query(Job).filter(Job.id == r.target_job_id).first()
        result.append({
            "id": r.id,
            "job_title": job.title if job else "Unknown",
            "company": job.company if job else "Unknown",
            "created_at": "Just now" # UI will display this
        })
    return {"resumes": result}

from fastapi.responses import FileResponse, Response
from src.services.latex_service import tailor_resume_content, compile_latex_to_pdf

@router.get("/resumes/{resume_id}/pdf")
def get_resume_pdf(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume or not resume.content:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    try:
        pdf_path = compile_latex_to_pdf(resume.content, filename=f"resume_{resume_id}")
        return FileResponse(pdf_path, media_type='application/pdf', filename=f"tailored_resume_{resume_id}.pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from src.database.models import Preference

@router.post("/resume/tailor")
async def tailor_resume(user_id: int = Form(...), job_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Job not found"}
        
    pref = db.query(Preference).filter(Preference.user_id == user_id).first()
    pref_text = pref.preferred_roles if pref else "No specific preferences"
    
    content = await file.read()
    latex_content = content.decode("utf-8")
    
    tailored_latex = tailor_resume_content(latex_content, job.description or job.title, pref_text)
    
    try:
        pdf_path = compile_latex_to_pdf(tailored_latex)
        return FileResponse(pdf_path, media_type='application/pdf', filename=f"tailored_resume_{job_id}.pdf")
    except Exception as e:
        return {"error": str(e)}

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

from pydantic import BaseModel
from typing import List
from langchain_core.output_parsers import JsonOutputParser

class InterviewPrep(BaseModel):
    technical: List[str]
    hr: List[str]
    behavioral: List[str]
    tips: List[str]
    skills: List[str]

@router.post("/interview/questions")
def generate_interview_questions(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    parser = JsonOutputParser(pydantic_object=InterviewPrep)
    
    prompt = PromptTemplate(
        template="Generate comprehensive interview preparation for the following job.\n"
                 "Provide 3-5 items for each category: technical questions, HR questions, behavioral scenarios, company tips, and key skills to revise.\n\n"
                 "Job Title: {title}\nCompany: {company}\nDescription: {description}\n\n"
                 "{format_instructions}\n",
        input_variables=["title", "company", "description"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    chain = prompt | llm | parser
    
    try:
        res = chain.invoke({"title": job.title, "company": job.company, "description": job.description or ""})
        return res
    except Exception as e:
        print(f"Error generating interview questions: {e}")
        return {"technical": [], "hr": [], "behavioral": [], "tips": [], "skills": []}

