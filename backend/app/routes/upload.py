from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil

from app.services.pdf_loader import extract_text_from_pdf
from app.services.chunker import chunk_text
from app.services.embeddings import generate_embedding
from app.services.vector_store import add_chunks


router = APIRouter(prefix="/api", tags=["Upload"])


UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    text = extract_text_from_pdf(str(file_path))

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF."
        )

    # Create chunks
    chunks = chunk_text(text)

    # Generate embeddings
    embeddings = [
        generate_embedding(chunk)
        for chunk in chunks
    ]

    # Store in ChromaDB
    add_chunks(chunks, embeddings)

    return {
        "message": "PDF uploaded and processed successfully.",
        "filename": file.filename,
        "chunks": len(chunks)
    }