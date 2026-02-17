import pytest
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.action_log_service import create_action_log

from app.models.user import User
from app.models.action import Action
from app.models.action_log import ActionLog

from app.utils.date import get_jst_today


# =========================================================
# AS-01, AS-04, AS-05
# 正常保存テスト
# =========================================================
def test_create_action_log_success(db: Session):
    """
    目的：
    - action_logが正常に保存される
    - action_count_todayが増える
    - earth_stateが更新される
    """

    today = get_jst_today()

    # -------------------------
    # Arrange（準備）
    # -------------------------

    # ユーザー作成（uuidで一意）
    user = User(firebase_uid=f"uid_log_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # action作成
    action = Action(
        action_key=f"test_action_{uuid.uuid4()}",
        title="Test Action",
        description="Test Description",
        category_id=1,
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # -------------------------
    # Act（実行）
    # -------------------------
    result = create_action_log(db, user.id, action.id)

    # -------------------------
    # Assert（検証）
    # -------------------------

    # AS-01 保存確認
    log = (
        db.query(ActionLog)
        .filter(
            ActionLog.user_id == user.id,
            ActionLog.action_id == action.id,
            ActionLog.action_date == today,
        )
        .first()
    )

    assert log is not None

    # AS-04 count増加確認
    assert result["action_count_today"] == 1

    # AS-05 earth_state確認
    assert result["earth_state"] in ["normal", "smile", "happy"]

    # レスポンス確認
    assert result["action_id"] == action.id
    assert result["action_title"] == action.title
    assert result["server_date"] == today


# =========================================================
# AS-02
# action存在しない → 404
# =========================================================
def test_create_action_log_action_not_found(db: Session):
    """
    存在しないaction_id → 404
    """

    user = User(firebase_uid=f"uid_log_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    with pytest.raises(HTTPException) as exc:
        create_action_log(
            db,
            user.id,
            999999,  # 存在しないID
        )

    assert exc.value.status_code == 404
    assert exc.value.detail == "Action not found"


# =========================================================
# AS-03
# 同日2回実行 → 409
# =========================================================
def test_create_action_log_duplicate_same_day(db: Session):
    """
    同じactionを同日に2回 → 409
    """

    # user作成
    user = User(firebase_uid=f"uid_log_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # action作成
    action = Action(
        action_key=f"test_action_{uuid.uuid4()}",
        title="Test Action",
        description="Test Description",
        category_id=1,
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # 1回目（成功）
    create_action_log(db, user.id, action.id)

    # 2回目（失敗）
    with pytest.raises(HTTPException) as exc:
        create_action_log(db, user.id, action.id)

    assert exc.value.status_code == 409
    assert exc.value.detail == "Already executed today"
