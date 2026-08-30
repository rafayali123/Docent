import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router


app = FastAPI(
    title="AI PDF Study Assistant",
    description="RAG-based PDF study assistant",
    version="1.0.0",
)

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    upload_router,
    prefix="/api",
)
app.include_router(
    chat_router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "message": "AI PDF Study Assistant API is running."
    }