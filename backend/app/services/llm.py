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
    system_instruction = (
        "You are an AI PDF Study Assistant.\n\n"
        "Answer the user's question using ONLY the provided document context.\n\n"
        "If the answer cannot be found in the context, clearly say:\n"
        "\"I couldn't find this information in the document.\"\n\n"
        "Do not invent facts.\n"
        "Do not use outside knowledge.\n"
        "Keep the answer clear and educational."
    )

    user_content = f"DOCUMENT CONTEXT:\n{context}\n\nUSER QUESTION:\n{question}\n\nANSWER:"

    response = ollama.chat(
        model="qwen2.5:1.5b",
        messages=[
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_content}
        ],
        options={
            "temperature": 0.1,
            "num_thread": 4,  # Keeps CPU usage low to prevent laptop freezes
        },
        keep_alive="0s"  # Immediately frees up RAM after generating the answer
    )

    return response["message"]["content"]
