from app.graph.state import AgentState

def application_agent(state: AgentState) -> AgentState:
    print("--- Application Agent running ---")
    # Playwright stub
    state["notifications"] = state.get("notifications", [])
    state["notifications"].append("Application agent prepared the application draft using Playwright (stub).")
    return state

def email_monitor_agent(state: AgentState) -> AgentState:
    print("--- Email Monitor Agent running ---")
    # Gmail API stub
    return state

def notification_agent(state: AgentState) -> AgentState:
    print("--- Notification Agent running ---")
    # Telegram API stub
    return state
