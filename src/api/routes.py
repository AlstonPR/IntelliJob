from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import Job, Application, Notification, User
from src.agents.graph import career_agent_workflow
from src.auth.security import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class RunWorkflowRequest(BaseModel):
    # Optional now, since we get user from token
    pass

@router.get("/health")
def health_check():
    return {"status": "healthy"}

@router.post("/workflow/trigger")
def trigger_agent_workflow(
    request: RunWorkflowRequest, 
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Triggers the LangGraph workflow in the background.
    """
    initial_state = {
        "user_id": current_user.id,
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

@router.post("/resume/optimize")
def optimize_resume(user_id: int):
    return {"status": "success", "message": "Resume tailored successfully (mock)."}

@router.post("/apply")
def apply_for_job(job_id: int):
    return {"status": "success", "message": f"Application workflow started for job {job_id} (mock)."}

@router.post("/interview/questions")
def generate_interview_questions(job_id: int):
    return {"questions": [
        "What are your core strengths?",
        "How do you build APIs?"
    ]}
