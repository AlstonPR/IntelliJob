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

import time
from fastapi import Request
from src.api.auth import router as auth_router

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Completed request: {request.method} {request.url} - Status: {response.status_code} - Time: {process_time:.4f}s")
    return response

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
