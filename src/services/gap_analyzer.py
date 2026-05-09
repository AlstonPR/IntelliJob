import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class GapAnalysisResult(BaseModel):
    missing_skills: List[str] = Field(description="Skills that the user demands or asks for in their preferences, but which are missing from their extracted resume skills.")
    suggestions: List[str] = Field(description="Actionable suggestions on how the user can bridge these gaps (e.g., 'Consider adding Java to your resume if you have experience with it').")

def analyze_skill_gaps(preferences: str, resume_skills: List[str]) -> dict:
    if not preferences or not resume_skills:
        return {"missing_skills": [], "suggestions": []}

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    parser = JsonOutputParser(pydantic_object=GapAnalysisResult)
    
    prompt = PromptTemplate(
        template="You are an expert technical recruiter performing a gap analysis.\n"
                 "Compare what the user is demanding in their 'PREFERENCES' to what they actually have in their 'RESUME SKILLS'.\n"
                 "Identify any specific skills, tools, or domain requirements the user is asking for that are NOT present in their resume skills.\n\n"
                 "{format_instructions}\n\n"
                 "PREFERENCES:\n{preferences}\n\n"
                 "RESUME SKILLS:\n{resume_skills}\n",
        input_variables=["preferences", "resume_skills"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({
            "preferences": preferences,
            "resume_skills": ", ".join(resume_skills)
        })
        return result
    except Exception as e:
        print(f"Error in gap analysis: {e}")
        return {"missing_skills": [], "suggestions": []}
