import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():

    # FastAPI TestClient を提供するfixture
    with TestClient(app) as client:
        yield client
