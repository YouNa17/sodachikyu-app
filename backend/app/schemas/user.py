from pydantic import BaseModel
from uuid import UUID


class UserMeResponse(BaseModel):
    id: UUID
