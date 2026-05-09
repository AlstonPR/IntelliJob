import os
import subprocess
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from jinja2 import Template

def tailor_resume_content(base_latex_content: str, job_description: str, user_preferences: str) -> str:
    """
    Uses OpenAI to modify the base LaTeX resume content to better fit the job description.
    """
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    
    prompt = PromptTemplate.from_template(
        "You are an expert technical recruiter and resume writer. "
        "I will provide you with a base LaTeX resume template, a target job description, and my career preferences.\n"
        "Your task is to modify the content of the LaTeX resume to highlight my relevant skills and experiences that match the job description. "
        "DO NOT break the LaTeX syntax. Only modify the text content within the sections (like Summary, Experience bullet points, Skills).\n"
        "Return ONLY the raw modified LaTeX code, nothing else. No markdown formatting.\n\n"
        "Job Description:\n{job_description}\n\n"
        "My Preferences:\n{user_preferences}\n\n"
        "Base LaTeX Resume:\n{base_latex_content}"
    )
    
    chain = prompt | llm
    
    try:
        result = chain.invoke({
            "job_description": job_description,
            "user_preferences": user_preferences,
            "base_latex_content": base_latex_content
        })
        content = result.content
        # Clean up if the model returned markdown
        if content.startswith("```latex"):
            content = content[8:]
        if content.endswith("```"):
            content = content[:-3]
        return content.strip()
    except Exception as e:
        print(f"Error tailoring resume: {e}")
        return base_latex_content

import httpx
import urllib.parse

def compile_latex_to_pdf(latex_content: str, output_dir: str = "/tmp", filename: str = "tailored_resume") -> str:
    """
    Compiles the LaTeX string into a PDF file using the latexonline.cc API
    and returns the path to the downloaded PDF.
    """
    pdf_path = os.path.join(output_dir, f"{filename}.pdf")
    os.makedirs(output_dir, exist_ok=True)
    
    encoded_text = urllib.parse.quote(latex_content)
    url = f"https://latexonline.cc/compile?text={encoded_text}&command=pdflatex"
    
    try:
        # Use sync httpx request or urllib
        import httpx
        with httpx.Client(timeout=30.0) as client:
            response = client.get(url)
            response.raise_for_status()
            
            with open(pdf_path, "wb") as f:
                f.write(response.content)
                
        return pdf_path
    except Exception as e:
        print(f"API compilation failed: {e}")
        raise Exception("Failed to compile LaTeX to PDF via API.")

from src.database.models import Resume, Job, Preference
from src.database.core import SessionLocal

def generate_tailored_resume(user_id: int, job_id: int):
    """
    Background task to tailor a user's base resume for a specific job and save it to the database.
    """
    with SessionLocal() as db:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            print(f"generate_tailored_resume: Job {job_id} not found.")
            return

        base_resume = db.query(Resume).filter(Resume.user_id == user_id, Resume.is_base == True).first()
        if not base_resume or not base_resume.content:
            print(f"generate_tailored_resume: Base resume for user {user_id} not found.")
            return

        pref = db.query(Preference).filter(Preference.user_id == user_id).first()
        pref_text = pref.preferred_roles if pref else "No specific preferences"

        tailored_latex = tailor_resume_content(base_resume.content, job.description or job.title, pref_text)
        
        new_resume = Resume(
            user_id=user_id,
            is_base=False,
            content=tailored_latex,
            target_job_id=job_id
        )
        db.add(new_resume)
        db.commit()
        print(f"Tailored resume generated for user {user_id} and job {job_id}")
