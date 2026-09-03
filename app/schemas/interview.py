from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class InterviewCreate(BaseModel):
    target_role: str
    interview_type: str
    difficulty: str
    experience_level: str
    question_count: int = Field(ge=1, le=50)


class InterviewResponse(BaseModel):
    id: int
    user_id: int
    target_role: str
    interview_type: str
    difficulty: str
    experience_level: str
    question_count: int
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)