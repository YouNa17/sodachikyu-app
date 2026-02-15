from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Action(Base):
    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    action_key = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)

    category = relationship("Category", back_populates="actions")
    logs = relationship("ActionLog", back_populates="action", cascade="all, delete")