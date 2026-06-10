def test_health_returns_ok(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "message" in body


def test_health_reports_dependency_checks(client):
    response = client.get("/api/health")

    body = response.json()
    # Nota: TestClient ejecuta cada petición en su propio loop de asyncio en
    # Windows, así que el ping a Mongo puede marcar "error" aquí aunque la
    # base esté disponible en producción (uvicorn usa un único loop estable).
    assert body["checks"]["database"] in {"ok", "error"}
    assert body["checks"]["stripe"] in {"ok", "not_configured", "error"}
    assert body["success"] == (body["checks"]["database"] == "ok")
