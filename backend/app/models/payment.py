
import uuid
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
from datetime import datetime

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)

    stripe_payment_id = Column(String, unique=True, nullable=False)

    amount = Column(Integer, nullable=False)
    currency = Column(String(3), nullable=False)

    status = Column(String, nullable=False)
    paid_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
