from apscheduler.schedulers.background import BackgroundScheduler
from src.database.core import SessionLocal
from src.database.models import User, Job
from src.agents.graph import career_agent_workflow
from src.services.email_service import send_job_proposals_email

scheduler = BackgroundScheduler()

def run_agent_for_user(user_id: int, to_email: str):
    """
    Executes the LangGraph workflow for a specific user and sends the results via email.
    """
    initial_state = {
        "user_id": user_id,
        "discovered_jobs": [],
        "filtered_jobs": [],
        "ranked_jobs": [],
        "current_job": None,
        "tailored_resume_content": None,
        "interview_questions": [],
        "application_status": None,
        "messages": []
    }
    
    try:
        # Run graph
        result = career_agent_workflow.invoke(initial_state)
        ranked_jobs = result.get("ranked_jobs", [])
        
        # If we found jobs, persist them and send the email
        if ranked_jobs:
            with SessionLocal() as db:
                for job in ranked_jobs:
                    # Check if job exists by adzuna_id
                    db_job = db.query(Job).filter(Job.adzuna_id == job.get("adzuna_id")).first()
                    if not db_job:
                        db_job = Job(
                            adzuna_id=job.get("adzuna_id"),
                            title=job.get("title", "Unknown"),
                            company=job.get("company", "Unknown"),
                            location=job.get("location", "Remote"),
                            description=job.get("description", ""),
                            salary_range=job.get("salary_range", ""),
                            apply_url=job.get("apply_url", ""),
                            source="Adzuna"
                        )
                        db.add(db_job)
                        db.commit()
                        db.refresh(db_job)
                    job["db_id"] = db_job.id
                    
            send_job_proposals_email(to_email=to_email, jobs=ranked_jobs, user_id=user_id)
        else:
            print(f"No relevant jobs found for user {user_id}")
            
    except Exception as e:
        print(f"Error running workflow for user {user_id}: {e}")

def schedule_jobs_for_all_users():
    """
    Reads users from the database and schedules their workflows based on their preferences.
    In a real system, you'd dynamically add/remove jobs when users update preferences.
    For this prototype, we just schedule a daily run at their specified time.
    """
    with SessionLocal() as db:
        users = db.query(User).all()
        for user in users:
            # Parse email_time (e.g., "09:00")
            try:
                time_parts = user.email_time.split(":")
                hour = int(time_parts[0])
                minute = int(time_parts[1])
            except:
                hour = 9
                minute = 0
                
            # Schedule based on frequency (assuming daily for now)
            # In a production app, use apscheduler's CronTrigger
            job_id = f"user_workflow_{user.id}"
            
            # Remove existing if any
            if scheduler.get_job(job_id):
                scheduler.remove_job(job_id)
                
            scheduler.add_job(
                run_agent_for_user,
                'cron',
                hour=hour,
                minute=minute,
                args=[user.id, user.email],
                id=job_id
            )
            print(f"Scheduled workflow for {user.email} at {hour:02d}:{minute:02d} daily")

def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        # Initial schedule setup
        schedule_jobs_for_all_users()
