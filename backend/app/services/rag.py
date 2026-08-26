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
from app.services.embeddings import generate_embedding 


def ask_question(question: str, document_id: str) -> str:
    # 1. Convert question string to vector embedding
    query_embedding = generate_embedding(question)

    # 2. Query ChromaDB filtered strictly by document_id (Updated to 5 results)
    results = search_chunks(
        query_embedding=query_embedding,
        document_id=document_id,
        n_results=5,
    )

    retrieved_docs = results.get("documents", [[]])[0]

    # 3. Handle empty document context fallback
    if not retrieved_docs:
        return (
            "I could not find relevant information "
            "in the selected document."
        )

    # 4. Clean, structured RAG logging for development/verification
    print(f"\n[ RAG ] Document: {document_id}")
    print(f"[ RAG ] Retrieved chunks: {len(retrieved_docs)}")
    for index, document in enumerate(retrieved_docs, start=1):
        preview = document[:200].replace("\n", " ")
        print(f"[ RAG ] Chunk {index}: {preview}...")
    print()

    doc_context = "\n\n".join(retrieved_docs)

    # 5. Generate LLM response using document context
    return generate_answer(question, doc_context)