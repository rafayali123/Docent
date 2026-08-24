from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag import ask_question


router = APIRouter(prefix="/api", tags=["Chat"])


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def chat(request: ChatRequest):

    answer = ask_question(request.question)

    return {
        "question": request.question,
        "answer": answer
    }