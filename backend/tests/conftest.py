import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():

    # FastAPI TestClient fixture
    with TestClient(app) as client:
        yield client
