import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

async def fetch_adzuna_jobs(country: str = "us", query: str = "", location: str = "", limit: int = 10) -> List[Dict[str, Any]]:
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        print("Adzuna credentials missing, using mock data")
        return []

    url = f"{ADZUNA_BASE_URL}/{country}/search/1"
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": limit,
        "what": query,
        "where": location,
        "content-type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            jobs = []
            for item in data.get("results", []):
                jobs.append({
                    "adzuna_id": str(item.get("id", "")),
                    "title": item.get("title", "Unknown Title"),
                    "company": item.get("company", {}).get("display_name", "Unknown Company"),
                    "location": item.get("location", {}).get("display_name", "Unknown Location"),
                    "description": item.get("description", ""),
                    "apply_url": item.get("redirect_url", ""),
                    "salary_range": f"{item.get('salary_min', '')} - {item.get('salary_max', '')}",
                    "source": "Adzuna"
                })
            return jobs
        except Exception as e:
            print(f"Error fetching from Adzuna API: {e}")
            return []
