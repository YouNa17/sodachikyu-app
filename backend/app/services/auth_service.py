# -----------------
# ユーザー取得・作成ロジック
# -----------------
from app.models.user import User


def get_or_create_user(db, decoded_token: dict):
    firebase_uid = decoded_token["uid"]

    # DBでログインしたFirebaseUIDがいるか検索
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    # ユーザーがいなかった場合
    if not user:
        # 新しいUserインスタンスを作る
        user = User(firebase_uid=firebase_uid)
        # DBに追加
        db.add(user)
        # 保存
        db.commit()
        # DBから最新情報を取得
        db.refresh(user)

        # ユーザーオブジェクトを返す
    return user
