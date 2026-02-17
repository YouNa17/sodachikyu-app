from sqlalchemy.orm import Session

from app.models.action import Action
from app.models.action_log import ActionLog
from app.utils.date import get_jst_today


# =========================================================
# API-A-01, API-A-02, API-A-03
# 正常レスポンス & JSON構造 & actions取得
# =========================================================
def test_get_actions_structure(authorized_client, db: Session):

    client, user = authorized_client

    # Arrange: category_id=1 のaction作成
    action = Action(
        action_key="test_action_1",
        title="Test Action",
        description="Test Description",
        category_id=1,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # Act
    response = client.get("/api/categories/1/actions")

    # Assert
    assert response.status_code == 200

    data = response.json()

    # JSON構造確認
    assert "server_date" in data
    assert "actions" in data

    assert isinstance(data["actions"], list)
    assert len(data["actions"]) >= 1

    action_data = data["actions"][-1]

    assert "id" in action_data
    assert "title" in action_data
    assert "description" in action_data
    assert "done_today" in action_data


# =========================================================
# API-A-04 done_today False
# =========================================================
def test_get_actions_done_today_false(authorized_client, db: Session):

    client, user = authorized_client

    # Arrange
    action = Action(
        action_key="test_action_false",
        title="Test False",
        description="Test",
        category_id=2,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # Act
    response = client.get("/api/categories/2/actions")

    # Assert
    data = response.json()

    target = next(a for a in data["actions"] if a["id"] == action.id)

    assert target["done_today"] is False


# =========================================================
# API-A-05 done_today True
# =========================================================
def test_get_actions_done_today_true(authorized_client, db: Session):

    client, user = authorized_client

    today = get_jst_today()

    # Arrange
    action = Action(
        action_key="test_action_true",
        title="Test True",
        description="Test",
        category_id=3,
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    log = ActionLog(user_id=user.id, action_id=action.id, action_date=today)

    db.add(log)
    db.commit()

    # Act
    response = client.get("/api/categories/3/actions")

    # Assert
    data = response.json()

    target = next(a for a in data["actions"] if a["id"] == action.id)

    assert target["done_today"] is True
