from sqlalchemy.orm import Session

from app.models.action import Action
from app.models.action_log import ActionLog
from app.utils.date import get_jst_today


# =========================================================
# TC-AL-01, TC-AL-04, TC-AL-05, TC-AL-06, TC-AL-07, TC-AL-08
# 正常記録 + count更新 + state更新 + JSON構造確認
# =========================================================
def test_create_action_log_success(authorized_client, db: Session):

    # fixtureからclientと認証済みユーザーを取得
    client, user = authorized_client

    today = get_jst_today()

    # テスト用action作成
    action = Action(
        action_key="router_test_success",
        title="Router Success",
        description="desc",
        category_id=1,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # API実行
    response = client.post(f"/api/actions/{action.id}/action-logs")

    # TC-AL-01 正常200確認
    assert response.status_code == 200

    data = response.json()

    # TC-AL-06 JSON構造確認
    assert "server_date" in data
    assert "action_id" in data
    assert "action_title" in data
    assert "action_count_today" in data
    assert "earth_state" in data
    assert "message" in data

    # TC-AL-04 count更新確認
    assert data["action_count_today"] == 1

    # TC-AL-07 state確認（1回なのでsmile）
    assert data["earth_state"] == "smile"

    # TC-AL-08 message存在確認
    assert data["message"] is not None

    # DBにも保存されているか確認
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


# =========================================================
# TC-AL-02 action存在しない → 404
# =========================================================
def test_create_action_log_not_found(authorized_client):

    client, user = authorized_client

    # 存在しないaction_id
    response = client.post("/api/actions/999999/action-logs")

    assert response.status_code == 404


# =========================================================
# TC-AL-03 同日重複 → 409
# =========================================================
def test_create_action_log_duplicate(authorized_client, db: Session):

    client, user = authorized_client

    action = Action(
        action_key="router_test_duplicate",
        title="Router Duplicate",
        description="desc",
        category_id=1,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # 1回目（成功）
    client.post(f"/api/actions/{action.id}/action-logs")

    # 2回目（duplicate）
    response = client.post(f"/api/actions/{action.id}/action-logs")

    # TC-AL-03 409確認
    assert response.status_code == 409
