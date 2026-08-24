# from app.services.embeddings import generate_embedding
# from app.services.vector_store import search_chunks
# from app.services.llm import generate_answer


# def ask_question(question: str) -> str:

#     # 1. Convert question into embedding
#     query_embedding = generate_embedding(question)

#     # 2. Retrieve relevant chunks
#     results = search_chunks(
#         query_embedding,
#         n_results=3
#     )

#     # 3. Extract retrieved documents
#     documents = results["documents"][0]

#     # 4. Combine chunks into context
#     context = "\n\n".join(documents)

#     # 5. Send context + question to LLM
#     answer = generate_answer(
#         question,
#         context
#     )

#     return answer



























from app.services.vector_store import search_chunks
from app.services.llm import generate_answer
# Import embedding generator from your actual embeddings file
from app.services.embeddings import generate_embedding 

def ask_question(question: str) -> str:
    # 1. Convert question string to vector embedding
    query_embedding = generate_embedding(question)

    # 2. Query ChromaDB using the embedding vector
    results = search_chunks(query_embedding, n_results=5)

    retrieved_docs = results.get("documents", [[]])[0]
    
    doc_context = "\n\n".join(retrieved_docs) if retrieved_docs else ""

    print("--- RETRIEVED CONTEXT ---")
    print(doc_context)
    print("------------------------")

    return generate_answer(question, doc_context)