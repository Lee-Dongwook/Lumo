from fastapi import APIRouter
from infer import generate_response

router = APIRouter()

@router.post('/generate')
def generate(prompt: str):
    return {"response": generate_response(prompt)}