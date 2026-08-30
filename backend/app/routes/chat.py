from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio  # Import asyncio for non-blocking delays

from app.services.rag import ask_question

router = APIRouter(tags=["Upload"])

class ChatRequest(BaseModel):
    question: str
    document_id: str

@router.post("/chat")
async def chat(request: ChatRequest):
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            # Attempt to ask the question
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
            error_msg = str(error)
            print(f"[CHAT ERROR - Attempt {attempt + 1}/{max_retries}] {error_msg}")
            
            # If it's a 503 Service Unavailable, wait 2 seconds and retry
            if "503" in error_msg and attempt < max_retries - 1:
                print("Google API is busy. Retrying in 2 seconds...")
                await asyncio.sleep(2)
                continue
            
            # If it fails after 3 tries or it's a different error, return the 500 error
            raise HTTPException(
                status_code=500,
                detail="Unable to generate an answer.",
            )