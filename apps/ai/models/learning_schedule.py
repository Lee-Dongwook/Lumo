from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Union
from datetime import date, time

class SingleModeMeta(BaseModel):
    date: date
    time: time
    call_time: int

class CurriculumModeMeta(BaseModel):
    start_date: date
    end_date: date
    total_sessions: int
    repeat_days: List[str]
    session_time_from: time
    session_time_to: time
    call_time: int

class LearningScheduleBase(BaseModel):
    mode: Literal['single','curriculum']
    purpose: Optional[str]
    subject: str
    reference_urls: Optional[List[str]] = []
    material_url: Optional[str]
    material_file: Optional[str]
    use_research: bool = False
    mode_meta: Union[SingleModeMeta, CurriculumModeMeta]

class LearningScheduleCreate(LearningScheduleBase):
    pass

class LearningScheduleOut(LearningScheduleBase):
    id: str
    user_id: str