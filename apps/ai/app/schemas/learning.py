"""
Learning Schedule Schemas
학습 스케줄 관련 Pydantic 스키마
"""

from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Union
from datetime import date, time


class SingleModeMeta(BaseModel):
    """단일 모드 메타데이터"""
    date: date
    time: time
    call_time: int = Field(..., description="통화 시간(분)")


class CurriculumModeMeta(BaseModel):
    """커리큘럼 모드 메타데이터"""
    start_date: date
    end_date: date
    total_sessions: int = Field(..., description="총 세션 수")
    repeat_days: List[str] = Field(..., description="반복 요일")
    session_time_from: time
    session_time_to: time
    call_time: int = Field(..., description="통화 시간(분)")


class LearningScheduleBase(BaseModel):
    """학습 스케줄 기본 모델"""
    mode: str = Field(..., description="학습 모드")
    purpose: Optional[str] = Field(None, description="학습 목적")
    subject: str = Field(..., description="학습 주제")
    reference_urls: Optional[List[str]] = Field(default=[], description="참고 URL")
    material_url: Optional[str] = Field(None, description="학습 자료 URL")
    material_file: Optional[str] = Field(None, description="학습 자료 파일")
    use_research: bool = Field(default=False, description="연구 기능 사용 여부")
    mode_meta: Union[SingleModeMeta, CurriculumModeMeta]


class LearningScheduleCreate(LearningScheduleBase):
    """학습 스케줄 생성 요청"""
    pass


class LearningScheduleUpdate(BaseModel):
    """학습 스케줄 수정 요청"""
    mode: Optional[str] = None
    purpose: Optional[str] = None
    subject: Optional[str] = None
    reference_urls: Optional[List[str]] = None
    material_url: Optional[str] = None
    material_file: Optional[str] = None
    use_research: Optional[bool] = None
    mode_meta: Optional[Union[SingleModeMeta, CurriculumModeMeta]] = None


class LearningScheduleOut(LearningScheduleBase):
    """학습 스케줄 응답"""
    id: str
    user_id: str
    created_at: str
    updated_at: str


class LearningScheduleList(BaseModel):
    """학습 스케줄 목록 응답"""
    schedules: List[LearningScheduleOut]
    total: int
    page: int
    size: int 