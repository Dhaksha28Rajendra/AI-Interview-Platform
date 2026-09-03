from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    target_role: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    interview_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    difficulty: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    experience_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    question_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )