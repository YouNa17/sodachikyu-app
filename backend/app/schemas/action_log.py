from pydantic import BaseModel
from datetime import date


class ActionLogResponse(BaseModel):
    server_date: date
    action_id: int
    action_title: str
    action_count_today: int
    earth_state: str
    message: str
