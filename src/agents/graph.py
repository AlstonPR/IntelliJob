from langgraph.graph import StateGraph, END
from src.agents.state import AgentState
from src.agents.nodes import (
    preference_agent,
    discovery_agent,
    filtering_agent,
    ranking_agent,
    resume_agent,
    interview_agent,
    application_agent,
    notification_agent
)

def should_apply(state: AgentState) -> str:
    """
    Conditional edge: If a job has a high score, proceed to resume agent and application,
    otherwise just notify.
    """
    current_job = state.get("current_job")
    if current_job and current_job.get("score", 0) > 90:
        return "resume_agent"
    return "notification_agent"

def build_graph() -> StateGraph:
    # Initialize StateGraph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("preference_agent", preference_agent)
    workflow.add_node("discovery_agent", discovery_agent)
    workflow.add_node("filtering_agent", filtering_agent)
    workflow.add_node("ranking_agent", ranking_agent)
    workflow.add_node("resume_agent", resume_agent)
    workflow.add_node("interview_agent", interview_agent)
    workflow.add_node("application_agent", application_agent)
    workflow.add_node("notification_agent", notification_agent)
    
    # Define edges (linear path first)
    workflow.set_entry_point("preference_agent")
    workflow.add_edge("preference_agent", "discovery_agent")
    workflow.add_edge("discovery_agent", "filtering_agent")
    workflow.add_edge("filtering_agent", "ranking_agent")
    
    # Conditional logic
    workflow.add_conditional_edges(
        "ranking_agent",
        should_apply,
        {
            "resume_agent": "resume_agent",
            "notification_agent": "notification_agent"
        }
    )
    
    # Rest of the path
    workflow.add_edge("resume_agent", "interview_agent")
    workflow.add_edge("interview_agent", "application_agent")
    workflow.add_edge("application_agent", "notification_agent")
    workflow.add_edge("notification_agent", END)
    
    # Compile the graph
    app = workflow.compile()
    return app

# Compile for easy importing
career_agent_workflow = build_graph()
