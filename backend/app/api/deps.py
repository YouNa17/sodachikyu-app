# -----------------
# 認証・ユーザー取得
# -----------------
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.auth import verify_token
from app.db.session import get_db
from app.services.auth_service import get_or_create_user
from app.models.user import User


def get_current_user(
    # トークン検証、成功するとdecodedに情報入る
    decoded=Depends(verify_token),
    # DBセッション取得、DBを使える状態にする
    db: Session = Depends(get_db),
) -> User:
    #  decoded[“uid”] 取得
    #  DBにそのfirebase_uidあるか確認。なければ作る。あればそのまま返す。
    return get_or_create_user(db, decoded)
