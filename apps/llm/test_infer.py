from infer import generate_response

if __name__ == "__main__":
    print("LLM 테스트 시작")

    while True:
        prompt = input("💬 User: ")
        if prompt.lower() in ["exit", "quit", "q"]:
            print("👋 종료합니다.")
            break

        full_prompt = f"User: {prompt}\nAI:"
        response = generate_response(full_prompt)
        print(response)