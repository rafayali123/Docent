from app.services.chunker import chunk_text
from app.services.embeddings import generate_embedding
from app.services.pdf_loader import extract_text_from_pdf
from app.services.vector_store import add_chunks, search_chunks


pdf_path = "data/uploads/sample.pdf"


# 1. Extract text
text = extract_text_from_pdf(pdf_path)


# 2. Create chunks
chunks = chunk_text(text)


# 3. Generate embeddings
embeddings = [
    generate_embedding(chunk)
    for chunk in chunks
]


# 4. Store chunks + embeddings
add_chunks(chunks, embeddings)


print(f"Stored {len(chunks)} chunks in ChromaDB.")


# 5. Test semantic search
question = "What is this document about?"

query_embedding = generate_embedding(question)


results = search_chunks(query_embedding)


print("\n===== SEARCH RESULTS =====")

for document in results["documents"][0]:
    print("\n---")
    print(document)