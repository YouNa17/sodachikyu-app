# -----------------
# ログイン中の「自分のユーザー情報」を取得する
# -----------------
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import verify_token
from app.services.auth_service import get_or_create_user
from app.db.session import get_db

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me")
def get_me(
    # トークン検証、成功するとdecodedに情報入る
    decoded=Depends(verify_token),
    # DBセッション取得、DBを使える状態にする
    db: Session = Depends(get_db),
):
    #  decoded[“uid”] 取得
    #  DBにそのfirebase_uidあるか確認。なければ作る。あればそのまま返す。
    return get_or_create_user(db, decoded)
