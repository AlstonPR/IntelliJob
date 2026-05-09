import httpx
from sqlalchemy.orm import Session
from app.models.schema import Project

async def fetch_and_save_github_projects(db: Session, user_id: int, github_username: str):
    """
    Fetches public repositories from GitHub and saves them as Projects in the DB.
    """
    if not github_username:
        return
        
    url = f"https://api.github.com/users/{github_username}/repos?sort=updated&per_page=10"
    
    try:
        async with httpx.AsyncClient() as client:
            # We add a User-Agent as required by GitHub API
            headers = {"User-Agent": "intelliJobs-Career-Agent"}
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                repos = response.json()
                for repo in repos:
                    # Filter out forks or empty repos if needed
                    if repo.get("fork"):
                        continue
                        
                    name = repo.get("name", "")
                    description = repo.get("description") or "No description provided."
                    language = repo.get("language") or ""
                    html_url = repo.get("html_url", "")
                    
                    # Store GitHub URL in description or technology field so AI can use it
                    # We can prepend the description with the URL
                    full_desc = f"{description} [GitHub URL: {html_url}]"
                    
                    db.add(Project(
                        user_id=user_id,
                        project_name=name,
                        description=full_desc,
                        technologies=language
                    ))
                db.commit()
            else:
                print(f"Failed to fetch GitHub repos for {github_username}: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Error fetching GitHub projects: {e}")
        db.rollback()
