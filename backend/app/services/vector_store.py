from app.services.supabase_client import supabase


def create_document(filename: str) -> str:
    """
    Creates a new document record in Supabase and returns its UUID.
    """
    response = (
        supabase
        .table("documents")
        .insert({
            "filename": filename,
        })
        .execute()
    )

    if not response.data:
        raise RuntimeError(
            "Failed to create document."
        )

    return response.data[0]["id"]


def add_chunks(
    chunks: list[str],
    embeddings: list[list[float]],
    document_id: str
):
    """
    Stores document chunks and their vector embeddings into Supabase.
    """
    rows = []

    for index, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        rows.append({
            "document_id": document_id,
            "content": chunk,
            "chunk_index": index,
            "embedding": embedding,
        })

    if rows:
        (
            supabase
            .table("document_chunks")
            .insert(rows)
            .execute()
        )


def search_chunks(
    query_embedding: list[float],
    document_id: str,
    n_results: int = 3,
):
    """
    Queries Supabase using the match_document_chunks RPC function,
    filtering strictly by the specified document_id.
    """
    response = supabase.rpc(
        "match_document_chunks",
        {
            "query_embedding": query_embedding,
            "match_document_id": document_id,
            "match_count": n_results,
        },
    ).execute()

    return response.data or []