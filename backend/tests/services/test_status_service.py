import uuid
from sqlalchemy.orm import Session

from app.services.status_service import build_today_status

from app.models.user import User
from app.models.action_log import ActionLog

# serviceと同じ日付関数
from app.utils.date import get_jst_today


# =========================================================
# SS-01
# アクション0回 → state = normal
# =========================================================
def test_status_zero_actions(db: Session):

    today = get_jst_today()

    # Arrange
    # ユーザーのみ作成（ログは作らない）
    user = User(firebase_uid=f"uid_status_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # Act
    result = build_today_status(db, user.id)

    # Assert

    # SS-04 count確認
    assert result["action_count_today"] == 0

    # SS-01 state確認
    assert result["earth_state"] == "normal"

    # server_date確認
    assert result["server_date"] == today


# =========================================================
# SS-02, SS-04
# アクション3回 → state = smile
# =========================================================
def test_status_three_actions(db: Session):

    today = get_jst_today()

    # Arrange
    user = User(firebase_uid=f"uid_status_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # action_logを3件作成
    for action_id in [1, 2, 3]:
        log = ActionLog(user_id=user.id, action_id=action_id, action_date=today)
        db.add(log)

    db.commit()

    # Act
    result = build_today_status(db, user.id)

    # Assert

    # SS-04 count確認
    assert result["action_count_today"] == 3

    # SS-02 state確認
    assert result["earth_state"] == "smile"

    assert result["server_date"] == today


# =========================================================
# SS-03
# アクション5回 → state = happy
# =========================================================
def test_status_five_actions(db: Session):

    today = get_jst_today()

    # Arrange
    user = User(firebase_uid=f"uid_status_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # action_logを5件作成
    for action_id in [1, 2, 3, 4, 5]:
        log = ActionLog(user_id=user.id, action_id=action_id, action_date=today)
        db.add(log)

    db.commit()

    # Act
    result = build_today_status(db, user.id)

    # Assert

    # SS-03 state確認
    assert result["earth_state"] == "happy"

    assert result["action_count_today"] == 5

    assert result["server_date"] == today
