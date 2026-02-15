# -----------------
# 選択したカテゴリに属するミニアクションの取得
# 実行済みのものはフラグで返す
# -----------------
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.action import ActionsByCategoryResponse
from app.services.action_service import get_actions_by_category

router = APIRouter(prefix="/api/categories", tags=["actions"])


@router.get("/{category_id}/actions", response_model=ActionsByCategoryResponse)
def get_actions(
    category_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_actions_by_category(db, current_user.id, category_id)
