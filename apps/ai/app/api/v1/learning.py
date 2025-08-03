from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def learning_root():
    return {"message": "Learning API"} 