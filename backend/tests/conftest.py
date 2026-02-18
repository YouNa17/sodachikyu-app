import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.api.deps import get_current_user
from app.models.user import User
from app.db.session import engine, get_db


# ------------------------
# FastAPI TestClient
# ------------------------
@pytest.fixture
def client():

    # FastAPI TestClient fixture
    with TestClient(app) as client:
        yield client


# ------------------------
# DB fixture（Service単体テスト用）ロールバック付き
# ------------------------
@pytest.fixture
def db():

    connection = engine.connect()
    transaction = connection.begin()

    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=connection
    )

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


# ------------------------
# API用　認証済み状態をテストで再現
# ------------------------
@pytest.fixture
def authorized_client(client, db):

    test_user = User(firebase_uid=f"test_uid_{uuid.uuid4()}")

    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    # get_current_user override
    def override_get_current_user():
        return test_user

    # get_db override
    def override_get_db():
        yield db

    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_db] = override_get_db

    yield client, test_user

    app.dependency_overrides.clear()
