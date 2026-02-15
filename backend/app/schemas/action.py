from pydantic import BaseModel
from datetime import date


class ActionItem(BaseModel):
    id: int
    title: str
    description: str | None
    done_today: bool


class ActionsByCategoryResponse(BaseModel):
    server_date: date
    actions: list[ActionItem]
