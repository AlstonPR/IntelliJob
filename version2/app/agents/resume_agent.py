from app.graph.state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import httpx
import os
import aiofiles
import json
import urllib.parse
import re

def escape_latex(text: str) -> str:
    """Escapes special LaTeX characters to prevent compilation errors."""
    if not text:
        return ""
    special_chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}'
    }
    text = text.replace('\\', special_chars['\\'])
    for char, escaped in special_chars.items():
        if char != '\\':
            text = text.replace(char, escaped)
    return text

async def async_compile_latex(latex_content: str, output_filename: str):
    try:
        url = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(latex_content)
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                os.makedirs(os.path.dirname(output_filename), exist_ok=True)
                async with aiofiles.open(output_filename, 'wb') as f:
                    await f.write(response.content)
                return True
            else:
                print(f"LaTeX API Error (Code {response.status_code}): {response.text[:200]}")
                return False
    except Exception as e:
        print(f"Failed to call LaTeX API: {e}")
        return False

async def resume_agent(state: AgentState) -> AgentState:
    print("--- Resume Agent running ---")
    approved_job = state.get("approved_job")
    if not approved_job:
        return state

    # 1. Read custom template
    template_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "assets", "resumeTemplate.tex")
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            latex_template = f.read()
    except Exception as e:
        print(f"Could not read template file: {e}")
        return state

    # 2. Use LLM to generate tailored content
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    prompt = PromptTemplate.from_template(
        """You are an expert resume writer. Tailor the candidate's profile to perfectly match the target job description.
        Fill out all the placeholders for their custom LaTeX resume template.
        
        IMPORTANT RULES:
        1. You MUST select the 2 best projects from the candidate's list (which includes GitHub repos). Even if the description says 'No description provided', invent 3-4 highly professional, technical bullet points based on the project's name and technology (e.g. if it's a 'To-Do-List' in JS, write bullets about state management, UI/UX, and component architecture). DO NOT LEAVE PROJECTS EMPTY.
        2. For the Education and Certification sections, if the candidate profile is missing this data, invent a realistic Bachelor's degree in Computer Science and some generic tech certifications to fill the template completely.
        3. For Skills (Languages, Web, etc.), if missing, deduce them from the target job description and the technologies in the user's projects.
        4. Make sure the feedback section provides actionable suggestions on what skills or experiences they actually lack based on the job description.
        
        Candidate Profile:
        Name: {name}
        Skills: {skills}
        Preferences: {preferences}
        Projects: {projects}
        
        Target Job:
        Title: {job_title}
        Company: {company}
        Description: {job_desc}
        
        Return ONLY valid JSON with exactly these keys:
        "NAME", "EMAIL", "GITHUB_URL", "GITHUB_DISPLAY", "LINKEDIN_URL", "LINKEDIN_DISPLAY",
        "COLLEGE_NAME", "COLLEGE_DURATION", "DEGREE", "COLLEGE_LOCATION", "CGPA",
        "PRE_UNIVERSITY_COLLEGE", "PU_DURATION", "PU_COURSE", "PU_LOCATION", "PU_PERCENTAGE",
        "LANGUAGES", "WEB_TECHNOLOGIES", "FRAMEWORKS", "TOOLS", "DATABASES", "COURSEWORK",
        "PROJECT_1_NAME", "PROJECT_1_TECH_STACK", "PROJECT_1_GITHUB_URL", "PROJECT_1_SHORT_DESCRIPTION",
        "PROJECT_1_POINT_1", "PROJECT_1_POINT_2", "PROJECT_1_POINT_3", "PROJECT_1_POINT_4",
        "PROJECT_2_NAME", "PROJECT_2_TECH_STACK", "PROJECT_2_GITHUB_URL", "PROJECT_2_SHORT_DESCRIPTION",
        "PROJECT_2_POINT_1", "PROJECT_2_POINT_2", "PROJECT_2_POINT_3", "PROJECT_2_POINT_4",
        "CERTIFICATION_1", "CERTIFICATION_2", "CERTIFICATION_3", "CERTIFICATION_4",
        "LEADERSHIP_POINT_1", "LEADERSHIP_POINT_2",
        "resume_feedback" (This should be a 2-3 sentence analysis of what they are missing and how to improve).
        """
    )
    
    chain = prompt | llm
    
    skills = ", ".join([s.get('skill_name', '') for s in state.get('skills', [])])
    projects = json.dumps(state.get('projects', []))
    
    try:
        result = chain.invoke({
            "name": state.get('user', {}).get('name', 'Candidate'),
            "skills": skills,
            "preferences": json.dumps(state.get('preferences', {})),
            "projects": projects,
            "job_title": approved_job.get('title', ''),
            "company": approved_job.get('company', ''),
            "job_desc": approved_job.get('description', '')
        })
        
        content = result.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        tailored_data = json.loads(content)
    except Exception as e:
        print(f"Failed to tailor resume via LLM: {e}")
        tailored_data = {"NAME": state.get('user', {}).get('name', 'Candidate'), "resume_feedback": "Failed to generate AI feedback."}

    # Save feedback to state
    state["resume_feedback"] = tailored_data.get("resume_feedback", "No feedback available.")

    # 3. Replace placeholders in the LaTeX template
    for key, value in tailored_data.items():
        if key == "resume_feedback":
            continue
        placeholder = f"<<{key}>>"
        safe_value = escape_latex(str(value)) if value else ""
        latex_template = latex_template.replace(placeholder, safe_value)
        
    # Cleanup empty \item rows
    latex_template = re.sub(r'\\item\s*(?=\\item|\\end\{itemize\})', '', latex_template)
    latex_template = re.sub(r'\\item\s*$', '', latex_template, flags=re.MULTILINE)
    latex_template = re.sub(r'\\begin\{itemize\}\[leftmargin=\*\]\s*\\end\{itemize\}', '', latex_template)
    
    latex_template = latex_template.replace(r'\textbf{ | }', '')
    latex_template = latex_template.replace(r'\uline{\href{}{GitHub}} \\', '')
    latex_template = latex_template.replace(r'\textbf{} \hfill \textbf{} \\', '')
    latex_template = latex_template.replace(r'\textit{} \hfill \textit{} \\', '')
    latex_template = re.sub(r'\\textbf\{CGPA:\}\s*\n', '', latex_template)
    latex_template = re.sub(r'\\textbf\{Percentage:\}\s*\n', '', latex_template)
    latex_template = latex_template.replace(r'\href{mailto:}{} ~|~', '')
    latex_template = latex_template.replace(r'\href{}{} ~|~', '')
    latex_template = latex_template.replace(r'\href{}{}', '')
    
    latex_template = re.sub(r'\\centerline\{\s*\}', '', latex_template)

    safe_title = approved_job.get('title', 'job').replace(' ', '_').replace('/', '_')
    output_dir = "app/uploads/generated_resumes"
    output_path = f"{output_dir}/tailored_{state['user_id']}_{safe_title}.pdf"
    
    os.makedirs(output_dir, exist_ok=True)
    success = await async_compile_latex(latex_template, output_path)

    if success:
        state["tailored_resume_path"] = output_path
    else:
        fallback_path = output_path.replace('.pdf', '.txt')
        with open(fallback_path, 'w', encoding='utf-8') as f:
            f.write(latex_template)
        state["tailored_resume_path"] = fallback_path

    return state
