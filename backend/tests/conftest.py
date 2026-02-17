import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import engine


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
