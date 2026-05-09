from typing import TypedDict, List, Dict, Any

class AgentState(TypedDict):
    user_id: int
    user: Dict[str, Any]
    preferences: Dict[str, Any]
    skills: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    
    # Discovery -> Filtering -> Ranking
    jobs: List[Dict[str, Any]]
    filtered_jobs: List[Dict[str, Any]]
    ranked_jobs: List[Dict[str, Any]]
    
    # Approval
    selected_job_id: int | None
    approved_job: Dict[str, Any] | None
    
    # Resume & Interview
    tailored_resume_path: str | None
    interview_questions: List[str]
    resume_feedback: str | None
    
    # Notification
    notifications: List[str]
