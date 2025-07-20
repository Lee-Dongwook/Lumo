from fastapi import APIRouter, Depends, HTTPException, Path
from ai.utils.jwt_utils import decode_token
from fastapi.security import OAuth2PasswordBearer
from ai.supa.client import supabase
from uuid import uuid4
from ai.models.learning_schedule import SingleModeMeta, CurriculumModeMeta, LearningScheduleBase, LearningScheduleCreate, LearningScheduleOut, LearningScheduleRow

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

    res = supabase.table('learning_schedules').insert({
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