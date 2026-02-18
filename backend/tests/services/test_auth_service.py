from sqlalchemy.orm import Session
import uuid

from app.services.auth_service import get_or_create_user
from app.models.user import User


# -------------------------
# US-01, US-03, US-04, US-05
# 新規ユーザー作成テスト
# -------------------------
def test_create_new_user(db: Session):

    firebase_uid = f"test_uid_new_{uuid.uuid4()}"

    decoded_token = {"uid": firebase_uid}

    # 実行
    user = get_or_create_user(db, decoded_token)

    # US-05 user型確認
    assert isinstance(user, User)

    # US-04 id存在
    assert user.id is not None

    # US-03 firebase_uid確認
    assert user.firebase_uid == firebase_uid

    # DB確認（US-01）
    db_user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    assert db_user is not None


# -------------------------
# US-02, US-03, US-04, US-05
# 既存ユーザー取得テスト
# -------------------------
def test_get_existing_user(db: Session):

    firebase_uid = f"test_uid_existing_{uuid.uuid4()}"

    # 事前にDBに作成
    existing_user = User(firebase_uid=firebase_uid)
    db.add(existing_user)
    db.commit()
    db.refresh(existing_user)

    decoded_token = {"uid": firebase_uid}

    # 実行
    user = get_or_create_user(db, decoded_token)

    # US-05 user型確認
    assert isinstance(user, User)

    # US-04 id存在
    assert user.id is not None

    # US-03 firebase_uid確認
    assert user.firebase_uid == firebase_uid

    # US-02 新規作成されない確認
    assert user.id == existing_user.id
