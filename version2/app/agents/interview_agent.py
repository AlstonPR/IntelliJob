from app.graph.state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import json

def interview_agent(state: AgentState) -> AgentState:
    print("--- Interview Agent running ---")
    approved_job = state.get("approved_job")
    if not approved_job:
        return state

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    
    prompt = PromptTemplate.from_template(
        """Generate 5 interview questions for the following job description tailored to the candidate's skills.
        
        Job: {job}
        Candidate Skills: {skills}
        
        Return the questions as a JSON list of strings.
        """
    )
    
    chain = prompt | llm
    result = chain.invoke({
        "job": json.dumps(approved_job),
        "skills": json.dumps(state.get("skills", []))
    })
    
    try:
        content = result.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        questions = json.loads(content)
        state["interview_questions"] = questions
    except:
        state["interview_questions"] = ["Could not generate questions."]

    return state
