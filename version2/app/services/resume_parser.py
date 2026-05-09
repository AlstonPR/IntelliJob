import os
from pypdf import PdfReader
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from sqlalchemy.orm import Session
from app.models.schema import Resume, Skill, Project
import json

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def parse_resume_to_db(db: Session, user_id: int, resume_path: str):
    # 1. Extract text
    text = extract_text_from_pdf(resume_path)

    # 2. Update resume raw_text
    resume = db.query(Resume).filter(Resume.user_id == user_id, Resume.filename == resume_path).first()
    if resume:
        resume.raw_text = text
        db.commit()

    # 3. Call LLM
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    prompt = PromptTemplate.from_template(
        """You are an expert ATS and resume parser. 
        Extract the following information from the resume text below and format it as a JSON object.
        
        Requirements:
        1. "skills": A list of objects, each with "skill_name" (string) and "confidence_level" (string: Beginner, Intermediate, Advanced, Expert).
        2. "projects": A list of objects, each with "project_name" (string), "description" (string), and "technologies" (string of comma-separated tech).
        
        Return ONLY valid JSON. No markdown formatting.
        
        Resume Text:
        {text}
        """
    )
    
    chain = prompt | llm
    result = chain.invoke({"text": text})
    
    # 4. Parse JSON
    try:
        content = result.content
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
        
        parsed_data = json.loads(content)
        
        # 5. Insert into DB
        for s in parsed_data.get("skills", []):
            db.add(Skill(
                user_id=user_id,
                skill_name=s.get("skill_name"),
                confidence_level=s.get("confidence_level", "Intermediate")
            ))
            
        for p in parsed_data.get("projects", []):
            db.add(Project(
                user_id=user_id,
                project_name=p.get("project_name"),
                description=p.get("description"),
                technologies=p.get("technologies")
            ))
            
        db.commit()
    except Exception as e:
        print(f"Error parsing resume JSON: {e}")
        db.rollback()
