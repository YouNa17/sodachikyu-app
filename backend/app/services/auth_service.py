# -----------------
# ユーザー取得・作成ロジック（初回ログイン判定付き）
# -----------------
from datetime import datetime, timedelta
from app.models.user import User
from app.utils.date import get_jst_today


def get_or_create_user(db, decoded_token: dict):
    firebase_uid = decoded_token["uid"]

    today = get_jst_today()

    # DBでログインしたFirebaseUIDがいるか検索
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    # ユーザーがいなかった場合
    if not user:
        # ★ updated_at を昨日にする
        yesterday = datetime.utcnow() - timedelta(days=1)

        # 新しいUserインスタンスを作る
        user = User(firebase_uid=firebase_uid, updated_at=yesterday)
        # DBに追加
        db.add(user)
        # 保存
        db.commit()
        # DBから最新情報を取得
        db.refresh(user)

        is_first_login_today = True
    
    else:

        # updated_at が今日でなければ初回ログイン
        last_login_date = user.updated_at.date()
        # 更新前の値で判定
        is_first_login_today = last_login_date != today
    

    # userオブジェクトにフラグを追加
    user.is_first_login_today = is_first_login_today
    
    # ↓AIの挙動確認用のログ、本番では消す
    # print(
    # f"[AUTH DEBUG] uid={firebase_uid}, "
    # f"created_at={user.created_at}, "
    # f"updated_at={user.updated_at}, "
    # f"is_first_login_today={is_first_login_today}"
    # )
        # ユーザーオブジェクトを返す
    return user
