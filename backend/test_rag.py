from app.services.rag import ask_question


question = input("Ask a question about your PDF: ")

answer = ask_question(question)

print("\n===== AI ANSWER =====")
print(answer)