import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD") # Gmail App Password

def send_job_proposals_email(to_email: str, jobs: list, user_id: int):
    """
    Sends an email to the user with the ranked jobs and an approval link for each.
    """
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("Email credentials not configured. Skipping email send.")
        return

    msg = EmailMessage()
    msg['Subject'] = "Your AI Career Agent Found New Jobs!"
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email

    # Build HTML content
    html_content = "<h2>Here are the latest job matches tailored for you:</h2><br>"
    for job in jobs:
        approve_link = f"http://localhost:5173/dashboard?job_id={job.get('db_id', '')}&action=approve"
        
        html_content += f"""
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
            <h3>{job.get('title')} at {job.get('company')}</h3>
            <p><strong>Location:</strong> {job.get('location')}</p>
            <p><strong>Salary Range:</strong> {job.get('salary_range', 'N/A')}</p>
            <p><strong>Match Score:</strong> {job.get('score', 'N/A')}</p>
            <p><strong>Why:</strong> {job.get('reason', '')}</p>
            <a href="{job.get('apply_url')}" target="_blank">View Original Job</a> | 
            <a href="{approve_link}" style="color: green; font-weight: bold;">Approve This Match</a>
        </div>
        """
    
    html_content += "<br><p>Best,<br>IntelliJob AI Agent</p>"
    msg.set_content("Please enable HTML to view this email.")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        print(f"Sent job proposals to {to_email}")
    except Exception as e:
        print(f"Error sending email to {to_email}: {e}")

def send_notification_email(to_email: str, subject: str, content: str):
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("Email credentials not configured.")
        return
        
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg.set_content(content)
    
    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Error sending notification email: {e}")
