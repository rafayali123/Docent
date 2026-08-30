from app.services.embeddings import generate_embedding
from app.services.vector_store import search_chunks
from app.services.llm import generate_answer


def ask_question(
    question: str,
    document_id: str,
) -> str:
    # 1. Convert question string to vector embedding
    query_embedding = generate_embedding(question)

    # 2. Query Supabase via RPC filtered strictly by document_id
    results = search_chunks(
        query_embedding=query_embedding,
        document_id=document_id,
        n_results=5,
    )

    # Extract text contents from the Supabase RPC record list
    documents = [
        result["content"]
        for result in results
    ]

    # 3. Handle empty document context fallback
    print(f"\n[ RAG ] Document: {document_id}")
    print(f"[ RAG ] Retrieved chunks: {len(documents)}")

    if not documents:
        return (
            "I couldn't find this information "
            "in the document."
        )

    # 4. Clean, structured RAG logging for development/verification
    for index, document in enumerate(
        documents,
        start=1,
    ):
        preview = document[:200].replace(
            "\n",
            " ",
        )

        print(
            f"[ RAG ] Chunk {index}: "
            f"{preview}..."
        )
    print()

    context = "\n\n---\n\n".join(documents)

    # 5. Generate LLM response using document context
    return generate_answer(
        question,
        context,
    )