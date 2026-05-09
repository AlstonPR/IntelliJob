from app.graph.state import AgentState
import httpx
import asyncio

import os


def fetch_jobs_from_arbeitnow():
    """Fetches real jobs from Arbeitnow public API."""
    url = "https://www.arbeitnow.com/api/job-board-api"
    try:
        response = httpx.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        jobs = data.get("data", [])
        
        formatted_jobs = []
        for job in jobs[:5]: # Fetch top 5 recent jobs
            formatted_jobs.append({
                "title": job.get("title", "Unknown"),
                "company": job.get("company_name", "Unknown"),
                "location": job.get("location", "Remote" if job.get("remote") else "On-site"),
                "description": str(job.get("description", ""))[:500].replace("<li>", "- ").replace("<ul>", "").replace("<h2>", "").replace("</h2>", "\n") + "...",
                "apply_url": job.get("url", ""),
                "source": "Arbeitnow API"
            })
        return formatted_jobs
    except Exception as e:
        print(f"Error fetching jobs from Arbeitnow: {e}")
        return []

from dotenv import load_dotenv

def fetch_jobs_from_adzuna():
    """Fetches jobs from Adzuna API if keys are present."""
    load_dotenv() # Ensure env vars are loaded
    app_id = os.environ.get("ADZUNA_APP_ID")
    api_key = os.environ.get("ADZUNA_API_KEY")
    
    if not app_id or not api_key or app_id == "your_adzuna_app_id_here":
        print("Adzuna API credentials not found, skipping Adzuna jobs.")
        return []
        
    url = f"https://api.adzuna.com/v1/api/jobs/us/search/1"
    params = {
        "app_id": app_id,
        "app_key": api_key,
        "results_per_page": 5,
        "what": "developer" # default search
    }
    try:
        response = httpx.get(url, params=params, timeout=10.0)
        
        if not response.is_success:
            print(f"Adzuna API Error HTTP {response.status_code}: {response.text}")
            response.raise_for_status()
            
        data = response.json()
        print(f"Adzuna API Response keys: {data.keys()}, total results: {len(data.get('results', []))}")
        
        jobs = data.get("results", [])
        
        formatted_jobs = []
        for job in jobs:
            print(job)
            company = job.get("company", {}).get("display_name", "Unknown")
            location = job.get("location", {}).get("display_name", "Unknown")
            formatted_jobs.append({
                "title": job.get("title", "Unknown"),
                "company": company,
                "location": location,
                "description": str(job.get("description", ""))[:500] + "...",
                "apply_url": job.get("redirect_url", ""),
                "source": "Adzuna API"
            })
        return formatted_jobs
    except Exception as e:
        print(f"Error fetching jobs from Adzuna: {e}")
        return []

async def discovery_agent(state: AgentState) -> AgentState:
    print("--- Discovery Agent running ---")
    
    discovered_jobs = []
    
    # Fetching real jobs from external APIs
    arbeitnow_jobs = fetch_jobs_from_arbeitnow()
    adzuna_jobs = fetch_jobs_from_adzuna()
    
    discovered_jobs.extend(arbeitnow_jobs)
    discovered_jobs.extend(adzuna_jobs)
    
    if not discovered_jobs:
        print("No real jobs fetched from either API.")
        
    state["jobs"] = discovered_jobs
    
    return state
