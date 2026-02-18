from sqlalchemy.orm import Session
import uuid

from app.services.action_service import get_actions_by_category

from app.models.user import User
from app.models.action import Action
from app.models.action_log import ActionLog

# 今日の日付取得関数（serviceと同じものを使う）
from app.utils.date import get_jst_today


# =========================================================
# AL-01, AL-03, AL-04
# 「今日実行していない場合」のテスト
# =========================================================
def test_done_today_false(db: Session):

    # Arrange（準備）
    # -----------------------------------------------------
    # 今日の日付（service内部と同じ関数を使用）
    today = get_jst_today()

    # テスト用ユーザー作成
    # uuidを使う理由：
    # → 既存データとfirebase_uidが衝突しないようにするため
    user = User(firebase_uid=f"uid_false_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # テスト用action作成
    # category_id=1 に属するaction
    action = Action(
        action_key=f"test_action_false_{uuid.uuid4()}",
        title="Action False",
        description="desc",
        category_id=1,
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # ※ActionLogは作らない
    # → つまり「今日実行していない」状態

    # Act（実行）
    # -----------------------------------------------------
    result = get_actions_by_category(db=db, user_id=user.id, category_id=1)

    # Assert（検証）
    # -----------------------------------------------------

    # AL-01
    # 追加したactionがレスポンスに含まれているか確認
    test_action = next(a for a in result["actions"] if a.id == action.id)

    # AL-03
    # 今日実行していないので done_today は False
    assert test_action.done_today is False

    # AL-04
    # server_date が今日の日付になっている
    assert result["server_date"] == today


# =========================================================
# AL-01, AL-02, AL-04
# 「今日実行している場合」のテスト
# =========================================================
def test_done_today_true(db: Session):

    # Arrange（準備）
    today = get_jst_today()

    # テスト用ユーザー
    user = User(firebase_uid=f"uid_true_{uuid.uuid4()}")
    db.add(user)
    db.commit()
    db.refresh(user)

    # テスト用action
    action = Action(
        action_key=f"test_action_true_{uuid.uuid4()}",
        title="Action True",
        description="desc",
        category_id=2,
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # 今日のActionLogを作成
    # → このactionは「今日実行済み」という状態になる
    log = ActionLog(user_id=user.id, action_id=action.id, action_date=today)
    db.add(log)
    db.commit()

    # Act（実行）
    result = get_actions_by_category(db=db, user_id=user.id, category_id=2)

    # Assert（検証）

    # AL-01
    # 追加したactionを取得
    test_action = next(a for a in result["actions"] if a.id == action.id)

    # AL-02
    # 今日実行済みなので done_today=True
    assert test_action.done_today is True

    # AL-04
    # server_date確認
    assert result["server_date"] == today
