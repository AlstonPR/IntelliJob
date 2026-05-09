import asyncio
from app.agents.resume_agent import resume_agent
from app.database.connection import SessionLocal
from app.models.schema import User, Project
import json

async def test():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "amith@example.com").first() # Assuming the email from the name
    if not user:
        user = db.query(User).first()
        
    projects = db.query(Project).filter(Project.user_id == user.id).all()
    project_list = [{"project_name": p.project_name, "description": p.description, "technologies": p.technologies} for p in projects]
    
    state = {
        "user_id": user.id,
        "user": {"name": user.name},
        "skills": [],
        "projects": project_list,
        "preferences": {},
        "approved_job": {
            "title": "Software Engineer",
            "company": "Tech Corp",
            "description": "Looking for a JS dev to build fast APIs and nice UIs."
        }
    }
    
    new_state = await resume_agent(state)
    print("New State tailored resume path:", new_state.get("tailored_resume_path"))
    print("Resume feedback:", new_state.get("resume_feedback"))
    
    db.close()

asyncio.run(test())
