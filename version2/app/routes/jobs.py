from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.schema import User, Job, RankedJob, ApprovedJob
from app.routes.auth import get_current_user
from app.graph.workflow import app_workflow

router = APIRouter()

@router.get("/discover")
async def discover_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    initial_state = {
        "user_id": current_user.id,
        "user": {},
        "preferences": {},
        "skills": [],
        "projects": [],
        "jobs": [],
        "filtered_jobs": [],
        "ranked_jobs": [],
        "selected_job_id": None,
        "approved_job": None,
        "tailored_resume_path": None,
        "interview_questions": [],
        "notifications": []
    }
    
    # Run graph until notification (which halts because no approved_job)
    # Using `.ainvoke()` runs the graph asynchronously
    result_state = await app_workflow.ainvoke(initial_state)
    
    # Clear previous ranked jobs for this user so they don't see old/dummy jobs
    db.query(RankedJob).filter(RankedJob.user_id == current_user.id).delete()
    db.commit()

    # Save jobs to db
    # Create a mapping to quickly find the description from filtered_jobs
    filtered_jobs = result_state.get("filtered_jobs", [])
    desc_map = {f"{j['title']}-{j['company']}": j.get("description", "") for j in filtered_jobs}

    for rj in result_state.get("ranked_jobs", []):
        job = db.query(Job).filter(Job.title == rj["title"], Job.company == rj["company"]).first()
        desc = desc_map.get(f"{rj['title']}-{rj['company']}", "No description provided.")
        
        if not job:
            job = Job(title=rj["title"], company=rj["company"], apply_url=rj.get("apply_url"), description=desc)
            db.add(job)
            db.commit()
            db.refresh(job)
        elif not job.description:
            job.description = desc
            db.commit()
            
        ranked = RankedJob(user_id=current_user.id, job_id=job.id, score=rj.get("score"), reason=rj.get("reason"))
        db.add(ranked)
        db.commit()
        
    return {"message": "Discovery completed", "ranked_jobs": result_state.get("ranked_jobs")}

@router.get("/ranked")
async def get_ranked_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Simple join to get ranked jobs
    jobs = db.query(RankedJob, Job).join(Job).filter(RankedJob.user_id == current_user.id).order_by(RankedJob.score.desc()).all()
    return [{"job": j, "score": r.score, "reason": r.reason, "ranked_job_id": r.id} for r, j in jobs]

@router.post("/{job_id}/approve")
async def approve_job(job_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    approval = ApprovedJob(user_id=current_user.id, job_id=job.id)
    db.add(approval)
    db.commit()
    
    # Re-run the graph with the approved job to trigger the rest of the pipeline
    initial_state = {
        "user_id": current_user.id,
        "user": {},
        "preferences": {},
        "skills": [],
        "projects": [],
        "jobs": [],
        "filtered_jobs": [],
        "ranked_jobs": [],
        "selected_job_id": job.id,
        "approved_job": {"title": job.title, "company": job.company, "description": job.description},
        "tailored_resume_path": None,
        "interview_questions": [],
        "notifications": []
    }
    
    # This run will go through preference_agent -> ... -> notification_agent -> resume_agent -> interview_agent -> ...
    result_state = await app_workflow.ainvoke(initial_state)
    
    return {
        "message": "Job approved, generation pipeline executed",
        "resume_path": result_state.get("tailored_resume_path"),
        "interview_questions": result_state.get("interview_questions"),
        "resume_feedback": result_state.get("resume_feedback")
    }
