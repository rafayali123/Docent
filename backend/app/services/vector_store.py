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

client = chromadb.PersistentClient(path="data/chroma")


def get_clean_collection():
    try:
        client.delete_collection(name="pdf_documents")
    except Exception:
        pass
    return client.get_or_create_collection(name="pdf_documents")


def add_chunks(chunks: list[str], embeddings: list[list[float]]):
    collection = get_clean_collection()

    ids = [f"chunk_{index}" for index in range(len(chunks))]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings
    )


def search_chunks(query_embedding: list[float], n_results: int = 5):
    collection = get_clean_collection()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results