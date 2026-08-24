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

















import ollama

def generate_answer(question: str, context: str) -> str:
    prompt = f"""You are Docent, an AI document assistant.

Answer the question strictly based on the context provided.
If the exact answer isn't word-for-word present, try to infer the answer from relevant details in the context.
Only if the context has no relation to the question at all, respond that the information is not available in the provided document.

Context:
{context}

Question:
{question}

Answer:"""

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]
