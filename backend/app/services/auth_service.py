# -----------------
# ユーザー取得・作成ロジック
# -----------------
from app.models.user import User


def get_or_create_user(db, decoded_token: dict):
    firebase_uid = decoded_token["uid"]

    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        user = User(firebase_uid=firebase_uid)
        db.add(user)
        db.commit()
        db.refresh(user)

    return {"id": user.id}
