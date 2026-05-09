import httpx
import asyncio
import urllib.parse

async def test():
    try:
        with open(r'c:\Users\amith\OneDrive\Desktop\intelliJobs\assets\resumeTemplate.tex', 'r') as f:
            text = f.read()
            
        url = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(text)
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=30.0)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Success! PDF bytes: {len(response.content)}")
            else:
                print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
