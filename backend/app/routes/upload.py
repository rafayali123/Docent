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

ALLOWED_CONTENT_TYPE = "application/pdf"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Content Type Check
    if file.content_type != ALLOWED_CONTENT_TYPE:
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    # 2. Extension check safety
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    # 3. File Size Check
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="PDF must be smaller than 10 MB.",
        )

    try:
        file_path = UPLOAD_DIR / file.filename

        # Write the read content to destination
        with file_path.open("wb") as buffer:
            buffer.write(content)

        # Extract text
        text = extract_text_from_pdf(str(file_path))

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF.",
            )

        # Create chunks
        chunks = chunk_text(text)

        # Generate embeddings
        embeddings = [
            generate_embedding(chunk)
            for chunk in chunks
        ]

        # Use filename as document_id
        document_id = file.filename

        # Store document-specific chunks in ChromaDB
        add_chunks(
            chunks=chunks,
            embeddings=embeddings,
            document_id=document_id
        )

        return {
            "message": "PDF uploaded and processed successfully.",
            "document_id": document_id,
            "filename": file.filename,
            "chunks": len(chunks)
        }

    except HTTPException:
        raise
    except Exception as error:
        print(f"[UPLOAD ERROR] {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to process the PDF.",
        )