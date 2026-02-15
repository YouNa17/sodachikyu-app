import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action_id = Column(Integer, ForeignKey("actions.id"), nullable=False)
    action_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint(
            "user_id", "action_id", "action_date", name="unique_user_action_per_day"
        ),
    )

    action = relationship("Action", back_populates="logs")
    user = relationship("User", back_populates="logs")
