# -----------------
# ログイン中の「自分のユーザー情報」を取得する
# -----------------
from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.user import UserMeResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserMeResponse)
def get_me(current_user=Depends(get_current_user)):
    return {"id": current_user.id}
