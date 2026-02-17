def test_get_me_success(authorized_client):

    client, user = authorized_client

    response = client.get("/api/users/me")

    assert response.status_code == 200

    data = response.json()

    assert "id" in data

    # 追加：正しいユーザーか確認
    assert data["id"] == str(user.id)


def test_get_me_unauthorized(client):

    response = client.get("/api/users/me")

    assert response.status_code == 401
