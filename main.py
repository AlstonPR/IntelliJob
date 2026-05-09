from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.core import engine, Base
from src.api.routes import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IntelliJob API",
    description="Autonomous AI Career Agent",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
