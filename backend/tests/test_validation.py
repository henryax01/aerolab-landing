def test_register_rejects_invalid_email(client):
    response = client.post(
        "/api/register",
        json={"name": "Ada", "email": "no-es-un-correo", "password": "secreto123"},
    )

    assert response.status_code == 422


def test_login_requires_password(client):
    response = client.post("/api/login", json={"email": "ada@example.com"})

    assert response.status_code == 422


def test_contact_requires_message(client):
    response = client.post(
        "/api/contact",
        json={"name": "Ada", "email": "ada@example.com"},
    )

    assert response.status_code == 422


def test_verify_email_requires_token(client):
    response = client.post("/api/verify-email", json={})

    assert response.status_code == 422


def test_forgot_password_rejects_invalid_email(client):
    response = client.post("/api/forgot-password", json={"email": "no-es-un-correo"})

    assert response.status_code == 422


def test_reset_password_requires_token_and_password(client):
    response = client.post("/api/reset-password", json={"token": "abc"})

    assert response.status_code == 422


def test_resend_verification_requires_authentication(client):
    response = client.post("/api/resend-verification")

    assert response.status_code == 401


def test_list_orders_requires_authentication(client):
    response = client.get("/api/orders")

    assert response.status_code == 401


def _auth_headers():
    from utils.auth.session import create_access_token

    token = create_access_token({"email": "cliente@example.com", "name": "Cliente", "role": "customer"})
    return {"Authorization": f"Bearer {token}"}


def test_list_orders_rejects_page_size_over_limit(client):
    response = client.get("/api/orders", params={"pageSize": 1000}, headers=_auth_headers())

    assert response.status_code == 422


def test_list_orders_rejects_page_below_one(client):
    response = client.get("/api/orders", params={"page": 0}, headers=_auth_headers())

    assert response.status_code == 422


def test_list_orders_rejects_invalid_status_filter(client):
    response = client.get("/api/orders", params={"status": "no-existe"}, headers=_auth_headers())

    assert response.status_code == 400


def test_list_notifications_requires_authentication(client):
    response = client.get("/api/notifications")

    assert response.status_code == 401


def test_mark_notification_read_rejects_invalid_id_format(client):
    response = client.put("/api/notifications/not-an-object-id/read", headers=_auth_headers())

    assert response.status_code == 404


def test_mark_all_notifications_read_requires_authentication(client):
    response = client.put("/api/notifications/read-all")

    assert response.status_code == 401


def test_setup_two_factor_requires_authentication(client):
    response = client.post("/api/2fa/setup")

    assert response.status_code == 401


def test_enable_two_factor_requires_authentication(client):
    response = client.post("/api/2fa/enable", json={"code": "123456"})

    assert response.status_code == 401


def test_enable_two_factor_requires_code(client):
    response = client.post("/api/2fa/enable", json={}, headers=_auth_headers())

    assert response.status_code == 422


def test_disable_two_factor_requires_authentication(client):
    response = client.post("/api/2fa/disable", json={"code": "123456"})

    assert response.status_code == 401


def test_login_two_factor_requires_challenge_token_and_code(client):
    response = client.post("/api/login/2fa", json={"code": "123456"})

    assert response.status_code == 422


def test_login_two_factor_rejects_invalid_challenge_token(client):
    response = client.post("/api/login/2fa", json={"challengeToken": "not-a-jwt", "code": "123456"})

    assert response.status_code == 401


def test_login_two_factor_rejects_session_token_as_challenge(client):
    from utils.auth.session import create_access_token

    session_token = create_access_token({"email": "cliente@example.com", "name": "Cliente", "role": "customer"})
    response = client.post("/api/login/2fa", json={"challengeToken": session_token, "code": "123456"})

    assert response.status_code == 401


def test_validate_coupon_requires_code_and_subtotal(client):
    response = client.post("/api/coupons/validate", json={"code": "PROMO10"})

    assert response.status_code == 422


def _admin_auth_headers():
    from utils.auth.session import create_access_token

    token = create_access_token({"email": "admin@example.com", "name": "Admin", "role": "admin"})
    return {"Authorization": f"Bearer {token}"}


def test_list_coupons_requires_authentication(client):
    response = client.get("/api/coupons")

    assert response.status_code == 401


def test_list_coupons_requires_admin_role(client):
    response = client.get("/api/coupons", headers=_auth_headers())

    assert response.status_code == 403


def test_create_coupon_requires_admin_role(client):
    response = client.post("/api/coupons", json={"code": "PROMO10", "type": "percentage", "value": 10}, headers=_auth_headers())

    assert response.status_code == 403


def test_create_coupon_rejects_percentage_out_of_range(client):
    response = client.post(
        "/api/coupons",
        json={"code": "PROMO150", "type": "percentage", "value": 150},
        headers=_admin_auth_headers(),
    )

    assert response.status_code == 400


def test_create_coupon_rejects_non_positive_fixed_value(client):
    response = client.post(
        "/api/coupons",
        json={"code": "FIXEDZERO", "type": "fixed", "value": 0},
        headers=_admin_auth_headers(),
    )

    assert response.status_code == 400


def test_update_coupon_rejects_invalid_id_format(client):
    response = client.put("/api/coupons/not-an-object-id", json={"active": False}, headers=_admin_auth_headers())

    assert response.status_code == 404


def test_delete_coupon_requires_admin_role(client):
    response = client.delete("/api/coupons/000000000000000000000000", headers=_auth_headers())

    assert response.status_code == 403
