from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def research_root():
    return {"message": "Research API"} 