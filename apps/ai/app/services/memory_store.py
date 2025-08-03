from typing import Dict, Any

# 간단한 메모리 스토어
memory_store: Dict[str, Any] = {}

def set_memory(key: str, value: Any):
    memory_store[key] = value

def get_memory(key: str) -> Any:
    return memory_store.get(key) 