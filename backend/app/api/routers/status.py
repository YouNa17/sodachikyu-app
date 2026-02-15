# -----------------
# 今日の状態を取得する
# -----------------
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.status import TodayStatusResponse
from app.services.status_service import build_today_status

# ルーター定義
# エンドポイントのベースは /api/status Swaggerでは「status」グループに入る
router = APIRouter(prefix="/api/status", tags=["status"])

# 今日の状態を取得するAPI
@router.get("/today", response_model=TodayStatusResponse)
def get_today_status(
    # トークン検証済みユーザーを取得
    current_user = Depends(get_current_user),
    # DBセッション自動取得
    db: Session = Depends(get_db)
):

    return build_today_status(db, current_user.id)