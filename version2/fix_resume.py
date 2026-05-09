import re
import httpx
import asyncio
import urllib.parse
import os

async def test():
    txt_path = r"c:\Users\amith\OneDrive\Desktop\intelliJobs\app\uploads\generated_resumes\tailored_1_Junior_Business_Automation_Manager_(m_w_d)_–_Schwerpunkt_KI_&_Prozessoptimierung.txt"
    with open(txt_path, 'r', encoding='utf-8') as f:
        latex_template = f.read()

    # Apply cleanup regex
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
    
    # Fix empty centerline
    latex_template = re.sub(r'\\centerline\{\s*\}', '', latex_template)

    url = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(latex_template)
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            pdf_path = txt_path.replace('.txt', '.pdf')
            with open(pdf_path, 'wb') as f:
                f.write(response.content)
            print("Successfully saved PDF.")
            os.remove(txt_path)
        else:
            print(f"Response: {response.text[:200]}")

asyncio.run(test())
