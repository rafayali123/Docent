# import chromadb


# client = chromadb.PersistentClient(
#     path="data/chroma"
# )


# collection = client.get_or_create_collection(
#     name="pdf_documents"
# )


# def add_chunks(
#     chunks: list[str],
#     embeddings: list[list[float]]
# ):
#     ids = [
#         f"chunk_{index}"
#         for index in range(len(chunks))
#     ]

#     collection.add(
#         ids=ids,
#         documents=chunks,
#         embeddings=embeddings
#     )


# def search_chunks(
#     query_embedding: list[float],
#     n_results: int = 3
# ):
#     results = collection.query(
#         query_embeddings=[query_embedding],
#         n_results=n_results
#     )

#     return results

























import chromadb

# Initialize persistent client and single collection for all documents
client = chromadb.PersistentClient(path="data/chroma")
collection = client.get_or_create_collection(name="pdf_documents")


def add_chunks(
    chunks: list[str],
    embeddings: list[list[float]],
    document_id: str
):
    """
    Stores document chunks and embeddings with metadata isolating them by document_id.
    """
    ids = [
        f"{document_id}_{index}"
        for index in range(len(chunks))
    ]

    metadatas = [
        {
            "document_id": document_id,
            "chunk_index": index,
        }
        for index in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def search_chunks(
    query_embedding: list[float],
    document_id: str,
    n_results: int = 3,
):
    """
    Queries ChromaDB filtering strictly by the specified document_id.
    """
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where={
            "document_id": document_id
        },
    )

    return results