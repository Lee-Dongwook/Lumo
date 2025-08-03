from fastapi import APIRouter, Depends, HTTPException, Path
from app.core.auth import decode_token
from fastapi.security import OAuth2PasswordBearer
from app.database.supabase_client import supabase
from uuid import uuid4
from typing import List
from app.models.learning_schedule import SingleModeMeta, CurriculumModeMeta, LearningScheduleBase, LearningScheduleCreate, LearningScheduleOut, LearningScheduleRow

router = APIRouter(prefix='/api/learning-schedule',tags=['learning_schedule'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')

async def get_current_user_id(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(status_code=401, detail="인증 실패")
    return payload['sub']

@router.post('', response_model = LearningScheduleOut)
async def create_learning_schedule(schedule: LearningScheduleBase, user_id: str = Depends(get_current_user_id)):
    schedule_id = str(uuid4())

    res = supabase.table('learning_schedule').insert({
        "id": schedule_id,
        "user_id": user_id,
        **schedule.model_dump()
    }).execute()
    
    if res.error: # type: ignore
        raise HTTPException(status_code=500, detail=f"삽입 실패: {res.error.message}") # type: ignore
    
    row: LearningScheduleRow = res.data[0]
    if not row:
        raise HTTPException(status_code=500, detail="삽입된 데이터가 없습니다.")
    
    return {**schedule.dict(), "id": schedule_id, "user_id": user_id}

@router.get('', response_model=List[LearningScheduleOut])
async def get_learning_schedules_list(user_id: str = Depends(get_current_user_id)):
    res = supabase.table('learning_schedule').select('*').eq('user_id', user_id).execute()
    return res.data or []

@router.get('/${id}', response_model=LearningScheduleOut)
async def get_learning_schedule_detail(id: str, user_id: str = Depends(get_current_user_id)):
    res = supabase.table('learning_schedule').select('*').eq('id',id).eq('user_id', user_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="스케줄을 찾을 수 없습니다.")
    return res.data

@router.put("/{id}", response_model=LearningScheduleOut)
async def update_learning_schedule(id:str, schedule:LearningScheduleBase, user_id: str = Depends(get_current_user_id)):
    res = supabase.table("learning_schedule").update(schedule.dict()).eq("id", id).eq("user_id", user_id).execute()
    if res.error:
        raise HTTPException(status_code=500, detail=f"수정 실패: {res.error.message}")
    
    updated = supabase.table('learning_schedule').select("*").eq("id", id).single().execute()
    return updated.data


@router.delete("/{id}")
async def delete_schedule(id: str, user_id: str = Depends(get_current_user_id)):
    res = supabase.table("learning_schedule").delete().eq("id", id).eq("user_id", user_id).execute()
    if res.error:
        raise HTTPException(status_code=500, detail=f"삭제 실패: {res.error.message}")
    return {"message": "삭제되었습니다."} 