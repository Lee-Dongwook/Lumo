from typing import Optional

def detect_interest_topic(user_input: str) -> Optional[str]:
    """
    간단한 키워드 매칭 또는 규칙 기반 감지
    """
    keywords = ["AI", "헬스케어", "블록체인", "기후 변화", "로봇", "우주", "교육"]
    for keyword in keywords:
        if keyword.lower() in user_input.lower():
            return keyword
    return None