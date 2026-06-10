from datetime import timedelta

from apis.auth.auth import FRONTEND_URL, reset_link, utcnow, verification_link


def test_verification_link_points_to_frontend_account_page():
    link = verification_link("abc123")

    assert link == f"{FRONTEND_URL}/account?verify=abc123"


def test_reset_link_points_to_frontend_account_page():
    link = reset_link("xyz789")

    assert link == f"{FRONTEND_URL}/account?reset=xyz789"


def test_utcnow_is_naive_so_it_can_be_compared_with_mongo_datetimes():
    now = utcnow()

    assert now.tzinfo is None
    assert (now + timedelta(hours=1)) > now
