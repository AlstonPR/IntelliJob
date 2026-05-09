from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from src.database.core import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email_frequency = Column(String, default="daily") # daily, weekly
    email_time = Column(String, default="09:00")

    
    preferences = relationship("Preference", back_populates="user", uselist=False)
    resume_analysis = relationship("ResumeAnalysis", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")
    applications = relationship("Application", back_populates="user")

class Preference(Base):
    __tablename__ = "preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    preferred_roles = Column(String) # Comma separated
    startup_preference = Column(Boolean, default=True) # True for startup, False for MNC
    domain_interest = Column(String)
    remote_preference = Column(Boolean, default=True)
    extracted_keywords = Column(Text, nullable=True) # JSON array of tags
    
    user = relationship("User", back_populates="preferences")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    is_base = Column(Boolean, default=True)
    content = Column(Text) # LaTeX content
    target_job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    
    user = relationship("User", back_populates="resumes")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    adzuna_id = Column(String, unique=True, index=True, nullable=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    location = Column(String)
    salary_range = Column(String, nullable=True)
    description = Column(Text)
    apply_url = Column(String)
    source = Column(String) # e.g., "Greenhouse", "Mock"
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RankedJob(Base):
    __tablename__ = "ranked_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    score = Column(Float)
    reason = Column(Text)
    
    job = relationship("Job")
    user = relationship("User")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    
    status = Column(String, default="Pending") # Pending, Applied, Interview, Rejected
    applied_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="applications")
    job = relationship("Job")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    message = Column(Text)
    type = Column(String) # e.g., "Job Alert", "Interview Reminder"
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    ats_score = Column(Integer, default=0)
    skills_match = Column(Integer, default=0)
    experience_level = Column(Integer, default=0)
    
    suggested_roles = Column(Text) # JSON serialized list of strings
    extracted_skills = Column(Text) # JSON serialized list of strings
    weak_areas = Column(Text) # JSON serialized list of strings
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="resume_analysis")
