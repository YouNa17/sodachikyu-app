def test_get_categories_structure(client):

    response = client.get("/api/categories")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    # 空でなければ構造確認
    if len(data) > 0:
        category = data[0]

        assert "id" in category
        assert "name" in category

        assert isinstance(category["id"], int)
        assert isinstance(category["name"], str)
