from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.rag import ask_question


router = APIRouter(prefix="/api", tags=["Chat"])


class ChatRequest(BaseModel):
    question: str
    document_id: str


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        answer = ask_question(
            question=request.question,
            document_id=request.document_id,
        )

        return {
            "question": request.question,
            "answer": answer,
        }

    except HTTPException:
        raise
    except Exception as error:
        print(f"[CHAT ERROR] {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to generate an answer.",
        )