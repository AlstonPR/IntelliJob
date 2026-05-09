from app.graph.state import AgentState
from app.database.connection import SessionLocal
from app.models.schema import User, UserPreference, Skill, Project

def preference_agent(state: AgentState) -> AgentState:
    print(f"--- Preference Agent running for user {state['user_id']} ---")
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == state["user_id"]).first()
        if not user:
            return state

        state["user"] = {
            "name": user.name,
            "email": user.email
        }
        
        prefs = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
        if prefs:
            state["preferences"] = {
                "preferred_roles": prefs.preferred_roles,
                "preferred_domains": prefs.preferred_domains,
                "preferred_locations": prefs.preferred_locations,
                "company_preference": prefs.company_preference,
                "work_mode": prefs.work_mode,
                "experience_level": prefs.experience_level
            }

        skills = db.query(Skill).filter(Skill.user_id == user.id).all()
        state["skills"] = [{"skill_name": s.skill_name, "confidence_level": s.confidence_level} for s in skills]

        projects = db.query(Project).filter(Project.user_id == user.id).all()
        state["projects"] = [{"project_name": p.project_name, "description": p.description, "technologies": p.technologies} for p in projects]

    finally:
        db.close()
    
    return state
