import httpx
import asyncio
import urllib.parse
import os

async def compile_and_save():
    base_dir = r"c:\Users\amith\OneDrive\Desktop\intelliJobs\app\uploads\generated_resumes"
    files = [f for f in os.listdir(base_dir) if f.endswith('.txt')]
    
    for txt_file in files:
        txt_path = os.path.join(base_dir, txt_file)
        pdf_path = os.path.join(base_dir, txt_file.replace('.txt', '.pdf'))
        
        with open(txt_path, 'r', encoding='utf-8') as f:
            latex_content = f.read()
            
        url = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(latex_content)
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    with open(pdf_path, 'wb') as f:
                        f.write(response.content)
                    print(f"Successfully compiled and saved {pdf_path}")
                    # Remove the txt file so it doesn't fallback
                    os.remove(txt_path)
                else:
                    print(f"Failed to compile {txt_file}: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"Error compiling {txt_file}: {e}")

asyncio.run(compile_and_save())
