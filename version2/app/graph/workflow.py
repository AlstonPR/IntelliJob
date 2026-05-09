from langgraph.graph import StateGraph, END
from app.graph.state import AgentState
from app.agents.preference_agent import preference_agent
from app.agents.discovery_agent import discovery_agent
from app.agents.filtering_agent import filtering_agent
from app.agents.ranking_agent import ranking_agent
from app.agents.resume_agent import resume_agent
from app.agents.interview_agent import interview_agent
from app.agents.other_agents import application_agent, email_monitor_agent, notification_agent

def should_continue(state: AgentState):
    # Route based on whether there's an approved job
    if state.get("approved_job"):
        return "resume_agent"
    return "end"

def build_workflow():
    workflow = StateGraph(AgentState)

    workflow.add_node("preference_agent", preference_agent)
    workflow.add_node("discovery_agent", discovery_agent)
    workflow.add_node("filtering_agent", filtering_agent)
    workflow.add_node("ranking_agent", ranking_agent)
    
    workflow.add_node("resume_agent", resume_agent)
    workflow.add_node("interview_agent", interview_agent)
    workflow.add_node("application_agent", application_agent)
    workflow.add_node("email_monitor_agent", email_monitor_agent)
    workflow.add_node("notification_agent", notification_agent)

    # Pre-approval pipeline
    workflow.set_entry_point("preference_agent")
    workflow.add_edge("preference_agent", "discovery_agent")
    workflow.add_edge("discovery_agent", "filtering_agent")
    workflow.add_edge("filtering_agent", "ranking_agent")
    workflow.add_edge("ranking_agent", "notification_agent")
    
    # Conditional routing after notification (wait for approval)
    workflow.add_conditional_edges(
        "notification_agent",
        should_continue,
        {
            "resume_agent": "resume_agent",
            "end": END
        }
    )
    
    # Post-approval pipeline
    workflow.add_edge("resume_agent", "interview_agent")
    workflow.add_edge("interview_agent", "application_agent")
    workflow.add_edge("application_agent", "email_monitor_agent")
    workflow.add_edge("email_monitor_agent", END)

    return workflow.compile()

app_workflow = build_workflow()
