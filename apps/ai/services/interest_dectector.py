from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model='gpt-3.5-turbo', temperature=0)

prompt = ChatPromptTemplate.from_template("""
아래 문장이 어떤 주제에 가장 적합한지 하나만 선택해줘:
["AI", "헬스케어", "블록체인", "기후 변화", "로봇", "우주", "교육"]

문장: "{input}"
주제:
""")

chain = prompt | llm

def detect_interest_topic_llm(user_input:str) -> str:
    return chain.invoke({"input":user_input}).content.strip() # type: ignore