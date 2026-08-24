from app.services.pdf_loader import extract_text_from_pdf
from app.services.chunker import chunk_text


pdf_path = "data/uploads/sample.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = chunk_text(text)

print("===== CHUNKING RESULT =====")
print(f"Total chunks: {len(chunks)}")

for index, chunk in enumerate(chunks, start=1):
    print(f"\n===== CHUNK {index} =====")
    print(chunk)