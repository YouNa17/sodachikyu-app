# -----------------
# アクション実行記録API
# -----------------

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.action_log import ActionLogResponse
from app.services.action_log_service import create_action_log

router = APIRouter(prefix="/api/actions", tags=["action_logs"])


@router.post("/{action_id}/action-logs", response_model=ActionLogResponse)
def post_action_log(
    action_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return create_action_log(db, current_user.id, action_id)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))