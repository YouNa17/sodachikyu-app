from sqlalchemy.orm import Session

from app.models.action_log import ActionLog
from app.utils.date import get_jst_today


# =========================================================
# API-SS-01, API-SS-02
# 正常レスポンス & JSON構造確認
# =========================================================
def test_get_today_status_structure(authorized_client):

    client, user = authorized_client

    response = client.get("/api/status/today")

    # API-SS-01 正常レスポンス
    assert response.status_code == 200

    data = response.json()

    # API-SS-02 JSON構造確認
    assert "server_date" in data
    assert "action_count_today" in data
    assert "earth_state" in data
    assert "message" in data


# =========================================================
# API-SS-03, API-SS-04, API-SS-05
# count と earth_state message 確認
# =========================================================
def test_get_today_status_with_logs(authorized_client, db: Session):

    # authorized_client fixtureから
    # 認証済みclientとoverrideされたユーザーを取得
    client, user = authorized_client

    today = get_jst_today()

    # action_logを3件作成
    for action_id in [1, 2, 3]:
        log = ActionLog(user_id=user.id, action_id=action_id, action_date=today)

        db.add(log)

    db.commit()

    # API呼び出し
    response = client.get("/api/status/today")

    assert response.status_code == 200

    data = response.json()

    # API-SS-03 action_count一致
    assert data["action_count_today"] == 3

    # API-SS-04 earth_state確認
    assert data["earth_state"] == "smile"

    # API-SS-05 message確認
    assert data["message"] is not None
