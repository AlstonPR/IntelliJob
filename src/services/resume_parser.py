import json
from pypdf import PdfReader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class ResumeAnalysisOutput(BaseModel):
    ats_score: int = Field(description="Score from 0 to 100 on how well the resume is written and formatted for ATS systems.")
    skills_match: int = Field(description="Score from 0 to 100 on the overall tech skills quality.")
    experience_level: int = Field(description="Score from 0 to 100 representing the experience level (e.g. 100 for very senior, 20 for junior).")
    suggested_roles: List[str] = Field(description="List of 3-4 role titles that best match this resume.")
    extracted_skills: List[str] = Field(description="List of up to 10 top skills extracted from the resume.")
    weak_areas: List[str] = Field(description="List of 2-3 weak areas or missing skills.")

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def analyze_resume_with_ai(pdf_path: str) -> dict:
    """
    Parses the PDF and uses LLM to generate analysis metrics.
    Returns a dictionary matching the ResumeAnalysisOutput schema.
    """
    text = extract_text_from_pdf(pdf_path)
    
    # Simple truncate to avoid context limit if extremely long
    text = text[:15000]
    
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    parser = JsonOutputParser(pydantic_object=ResumeAnalysisOutput)
    
    prompt = PromptTemplate(
        template="You are an expert technical recruiter and AI resume analyzer.\n"
                 "Analyze the following resume text and provide the extracted metrics according to the format instructions.\n\n"
                 "{format_instructions}\n\n"
                 "RESUME TEXT:\n{text}\n",
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"text": text})
        return result
    except Exception as e:
        print(f"Error analyzing resume: {e}")
        # Return fallback data
        return {
            "ats_score": 50,
            "skills_match": 50,
            "experience_level": 50,
            "suggested_roles": ["Analyst"],
            "extracted_skills": ["Parsing Failed"],
            "weak_areas": ["Unknown"]
        }
