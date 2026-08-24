from app.services.embeddings import generate_embedding


text = "Operating systems manage computer resources."

embedding = generate_embedding(text)

print("Embedding generated successfully!")
print("Vector length:", len(embedding))
print("First 10 values:", embedding[:10])