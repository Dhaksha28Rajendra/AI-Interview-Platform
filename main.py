from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import Base, engine
from app.models import User, Interview

from app.api.users import router as users_router

from app.api.auth import router as auth_router

from app.api.interviews import router as interviews_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Platform API",
    description="Backend API for the AI Software Engineering Interview Platform",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(interviews_router)

@app.get("/")
def root():
    return {
        "message": "AI Interview Platform API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }