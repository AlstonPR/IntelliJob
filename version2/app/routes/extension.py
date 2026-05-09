from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.routes.auth import get_current_user
from app.models.schema import User
from app.agents.autofill_agent import generate_autofill_plan
import json

router = APIRouter()

@router.post("/autofill")
async def autofill_form(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for the Chrome Extension to send form fields and get an autofill plan back.
    """
    form_fields = payload.get("fields", [])
    job_description = payload.get("job_description", "")
    
    if not form_fields:
        raise HTTPException(status_code=400, detail="No form fields provided")
        
    plan = generate_autofill_plan(db, current_user.id, form_fields, job_description)
    
    return {"status": "success", "plan": plan}

@router.post("/track_application")
async def track_application(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tracks a successful application submission from the extension.
    """
    from app.models.schema import Application, Job
    
    url = payload.get("url", "")
    company = payload.get("company", "Unknown")
    title = payload.get("title", "Application")
    
    # Simple tracking for the demo
    job = Job(title=title, company=company, apply_url=url, source="extension")
    db.add(job)
    db.commit()
    db.refresh(job)
    
    app = Application(user_id=current_user.id, job_id=job.id, status="applied")
    db.add(app)
    db.commit()
    
    return {"status": "tracked"}
