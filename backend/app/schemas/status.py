from pydantic import BaseModel
from datetime import date

class TodayStatusResponse(BaseModel):
    server_date: date
    action_count_today: int
    earth_state: str
    message: str