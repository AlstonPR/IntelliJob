from typing import Dict, Any
from src.agents.state import AgentState
from src.database.core import SessionLocal
from src.database.models import User, Preference, Job

def preference_agent(state: AgentState) -> Dict[str, Any]:
    """
    Analyze user preferences. For now, it mocks extraction or just returns state.
    """
    state["messages"].append("Preference agent analyzed user profile.")
    return state

def discovery_agent(state: AgentState) -> Dict[str, Any]:
    """
    Mocks fetching jobs continuously from APIs.
    """
    mock_jobs = [
        {
            "title": "Backend Software Engineer",
            "company": "Tech Startup AI",
            "location": "Remote",
            "description": "Looking for a FastAPI and Python expert to build AI pipelines.",
            "apply_url": "https://example.com/apply/1",
            "source": "Mock API"
        },
        {
            "title": "Data Scientist",
            "company": "Big Corp",
            "location": "New York",
            "description": "Analyzing large datasets. Pandas and SQL required.",
            "apply_url": "https://example.com/apply/2",
            "source": "Mock API"
        }
    ]
    state["discovered_jobs"] = mock_jobs
    state["messages"].append(f"Discovery agent found {len(mock_jobs)} jobs.")
    return state

def filtering_agent(state: AgentState) -> Dict[str, Any]:
    """
    Filters out irrelevant jobs based on hardcoded/mocked user preferences.
    """
    jobs = state.get("discovered_jobs", [])
    # Mock filtering: Keep only 'Backend Software Engineer'
    filtered = [j for j in jobs if "Backend" in j["title"]]
    
    state["filtered_jobs"] = filtered
    state["messages"].append(f"Filtering agent retained {len(filtered)} jobs.")
    return state

import os
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

def ranking_agent(state: AgentState) -> Dict[str, Any]:
    """
    Scores jobs intelligently using OpenAI (gpt-4o-mini).
    """
    jobs = state.get("filtered_jobs", [])
    if not jobs:
        state["ranked_jobs"] = []
        return state
        
    class JobRanking(BaseModel):
        score: float = Field(description="Score from 0 to 100 representing the match")
        reason: str = Field(description="One sentence reason for the score")
    
    # Initialize the LLM using gpt-4o-mini
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    structured_llm = llm.with_structured_output(JobRanking)
    
    prompt = PromptTemplate.from_template(
        "You are an expert AI Career Agent. Evaluate this job description against the user's profile.\n"
        "Job Title: {title}\n"
        "Company: {company}\n"
        "Description: {description}\n\n"
        "User Profile: Experienced backend developer looking for a startup role using Python and FastAPI.\n\n"
        "Score the match out of 100."
    )
    
    ranked = []
    for job in jobs:
        try:
            chain = prompt | structured_llm
            result = chain.invoke({
                "title": job["title"],
                "company": job["company"],
                "description": job["description"]
            })
            ranked.append({
                **job,
                "score": result.score,
                "reason": result.reason
            })
        except Exception as e:
            print(f"Error ranking job {job['title']}: {e}")
            ranked.append({
                **job,
                "score": 0,
                "reason": "Failed to rank."
            })
    
    # Sort by score descending
    ranked = sorted(ranked, key=lambda x: x["score"], reverse=True)
    state["ranked_jobs"] = ranked
    state["messages"].append(f"Ranking agent scored {len(ranked)} jobs using OpenAI (gpt-4o-mini).")
    
    # Set the top job as current job for next steps
    if ranked:
        state["current_job"] = ranked[0]
        
    return state

def resume_agent(state: AgentState) -> Dict[str, Any]:
    """
    Tailors resumes per job. Mocks LaTeX generation.
    """
    if state.get("current_job"):
        state["tailored_resume_content"] = "\\documentclass{article}\\begin{document}Tailored Resume for AI Startup\\end{document}"
        state["messages"].append("Resume agent generated tailored LaTeX resume.")
    return state

def interview_agent(state: AgentState) -> Dict[str, Any]:
    """
    Generates company-specific questions.
    """
    if state.get("current_job"):
        state["interview_questions"] = [
            "How do you handle async requests in FastAPI?",
            "Explain the architecture of a multi-agent system."
        ]
        state["messages"].append("Interview agent generated questions.")
    return state

def application_agent(state: AgentState) -> Dict[str, Any]:
    """
    Mocks Playwright application workflow.
    """
    if state.get("current_job"):
        state["application_status"] = "Suggestion Only: Ready to apply manually."
        state["messages"].append("Application agent prepared application suggestion.")
    return state

def notification_agent(state: AgentState) -> Dict[str, Any]:
    """
    Mocks sending Telegram/Email notifications.
    """
    state["messages"].append("Notification agent sent updates via Telegram mock.")
    return state
