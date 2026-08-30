# import ollama


# def generate_answer(
#     question: str,
#     context: str
# ) -> str:

#     prompt = f"""
# You are an AI study assistant.

# Answer the user's question using ONLY the
# information provided in the context.

# If the answer is not available in the context,
# say that the information is not available
# in the provided document.

# Context:
# {context}

# Question:
# {question}

# Answer:
# """

#     response = ollama.chat(
#         model="llama3.2:3b",
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ]
#     )

#     return response["message"]["content"]

















import os
from google import genai

# Initialize the official Google GenAI client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(
    question: str,
    context: str,
) -> str:
    prompt = f"""You are an AI PDF Study Assistant.

Answer the user's question using ONLY the provided document context.

- If the answer is present in the context, provide a clear and educational explanation.
- If the answer cannot be found in the context at all, respond with EXACTLY and ONLY:
"I couldn't find this information in the document."

Do not invent facts. Do not use outside knowledge.

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{question}
"""

    response = client.models.generate_content(
        model=os.getenv("LLM_MODEL", "gemini-3.5-flash-lite"),
        contents=prompt,
    )

    return response.text