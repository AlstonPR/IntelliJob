from app.graph.state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import json

def ranking_agent(state: AgentState) -> AgentState:
    print("--- Ranking Agent running ---")
    filtered_jobs = state.get("filtered_jobs", [])
    skills = state.get("skills", [])
    preferences = state.get("preferences", {})
    
    if not filtered_jobs:
        state["ranked_jobs"] = []
        return state

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    prompt = PromptTemplate.from_template(
        """You are an expert career advisor. Rank the following jobs based on the candidate's skills and preferences.
        
        Candidate Skills: {skills}
        Candidate Preferences: {preferences}
        
        Jobs to evaluate:
        {jobs}
        
        For each job, provide a score from 0 to 100 based on the match, and a brief reason.
        Return ONLY valid JSON in the following format:
        [
            {{
                "title": "Job Title",
                "company": "Company Name",
                "score": 95,
                "reason": "Strong match with candidate's Python skills",
                "apply_url": "..."
            }}
        ]
        """
    )
    
    chain = prompt | llm
    
    # We pass the jobs as JSON string to the prompt
    result = chain.invoke({
        "skills": json.dumps(skills),
        "preferences": json.dumps(preferences),
        "jobs": json.dumps(filtered_jobs)
    })
    
    try:
        content = result.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        ranked = json.loads(content)
        # Sort by score descending
        ranked.sort(key=lambda x: x.get("score", 0), reverse=True)
        state["ranked_jobs"] = ranked
    except Exception as e:
        print(f"Ranking error: {e}")
        state["ranked_jobs"] = filtered_jobs  # Fallback to filtered jobs
        
    return state
