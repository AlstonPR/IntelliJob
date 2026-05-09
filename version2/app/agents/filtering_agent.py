from app.graph.state import AgentState

def filtering_agent(state: AgentState) -> AgentState:
    print("--- Filtering Agent running ---")
    jobs = state.get("jobs", [])
    preferences = state.get("preferences", {})
    
    filtered = []
    for job in jobs:
        # Simple filtering logic based on preferences
        
        # Example 1: Filter out senior roles if experience level is junior
        if preferences.get("experience_level", "").lower() in ["junior", "entry-level"]:
            if "senior" in job["title"].lower() or "10 years" in job["description"].lower():
                continue
                
        # Example 2: Filter by remote preference
        if preferences.get("work_mode", "").lower() == "remote":
            if "remote" not in job["location"].lower() and "remote" not in job["description"].lower():
                continue
                
        filtered.append(job)
        
    if not filtered:
        print("Filtering removed all jobs! Falling back to unfiltered list.")
        filtered = jobs
        
    state["filtered_jobs"] = filtered
    return state
