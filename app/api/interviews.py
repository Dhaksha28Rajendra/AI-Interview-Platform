from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.ai_evaluator import evaluate_interview

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.interview import Interview
from app.models.user import User
from app.schemas.interview import InterviewCreate, InterviewResponse

class InterviewAnswerInput(BaseModel):
    question_id: int
    question: str
    answer: str


class InterviewEvaluationRequest(BaseModel):
    answers: list[InterviewAnswerInput]

router = APIRouter(
    prefix="/api/interviews",
    tags=["Interviews"]
)

@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_201_CREATED
)
def create_interview(
    interview_data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interview = Interview(
        user_id=current_user.id,
        target_role=interview_data.target_role,
        interview_type=interview_data.interview_type,
        difficulty=interview_data.difficulty,
        experience_level=interview_data.experience_level,
        question_count=interview_data.question_count,
        status="pending"
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview

@router.get("/{interview_id}/questions")
def get_interview_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    questions = [
        {
            "id": 1,
            "text": "Tell me about yourself and explain why you’re interested in software engineering.",
        },
        {
            "id": 2,
            "text": "What is the difference between an array and a linked list?",
        },
        {
            "id": 3,
            "text": "Explain the time complexity of binary search.",
        },
        {
            "id": 4,
            "text": "What is REST and why are REST APIs commonly used?",
        },
        {
            "id": 5,
            "text": "Describe a challenging software project you worked on and what you learned from it.",
        },
    ]

    return {
        "interview_id": interview.id,
        "questions": questions,
    }

@router.post("/{interview_id}/evaluate")
def evaluate_completed_interview(
    interview_id: int,
    evaluation_data: InterviewEvaluationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    if not evaluation_data.answers:
        raise HTTPException(
            status_code=400,
            detail="No answers were provided",
        )

    questions_and_answers = [
        {
            "question_id": item.question_id,
            "question": item.question,
            "answer": item.answer,
        }
        for item in evaluation_data.answers
    ]

    try:
        evaluation = evaluate_interview(
            target_role=interview.target_role,
            interview_type=interview.interview_type,
            difficulty=interview.difficulty,
            experience_level=interview.experience_level,
            questions_and_answers=questions_and_answers,
        )

        interview.status = "completed"
        db.commit()
        db.refresh(interview)

        return {
            "interview_id": interview.id,
            "evaluation": evaluation,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"AI evaluation failed: {str(error)}",
        )