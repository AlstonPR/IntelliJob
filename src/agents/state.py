from typing import TypedDict, List, Dict, Any, Optional

class AgentState(TypedDict):
    """
    State dictionary that is passed through the LangGraph workflow.
    """
    user_id: int
    
    # Discovery Phase
    discovered_jobs: List[Dict[str, Any]]
    
    # Filtering & Ranking Phase
    filtered_jobs: List[Dict[str, Any]]
    ranked_jobs: List[Dict[str, Any]]
    
    # Current job being processed for application/resume
    current_job: Optional[Dict[str, Any]]
    
    # Resume Phase
    tailored_resume_content: Optional[str]
    
    # Interview Prep Phase
    interview_questions: List[str]
    
    # Application Phase
    application_status: Optional[str]
    
    # General logging/notifications
    messages: List[str]
