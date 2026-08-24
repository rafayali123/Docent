# import os

# from openai import OpenAI
# from dotenv import load_dotenv


# load_dotenv()

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# def generate_embedding(text: str) -> list[float]:
#     response = client.embeddings.create(
#         model="text-embedding-3-small",
#         input=text
#     )

#     return response.data[0].embedding














from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    embedding = model.encode(text)

    return embedding.tolist()