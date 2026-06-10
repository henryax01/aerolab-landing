import pytest
from fastapi import HTTPException
from jose import jwt

from config.roles import get_role_level
from utils.auth.session import JWT_ALGORITHM, JWT_SECRET, create_access_token, require_role_level


def test_create_access_token_roundtrip():
    user = {"email": "ada@example.com", "name": "Ada", "role": "admin"}

    token = create_access_token(user)
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

    assert payload["sub"] == "ada@example.com"
    assert payload["name"] == "Ada"
    assert payload["role"] == "admin"


def test_get_role_level_known_and_unknown_roles():
    assert get_role_level("admin") == 6
    assert get_role_level("customer") == 1
    assert get_role_level("rol-inexistente") == 1


async def test_require_role_level_blocks_insufficient_role():
    dependency = require_role_level(6)

    with pytest.raises(HTTPException) as exc_info:
        await dependency(user={"role": "customer", "role_level": 1})

    assert exc_info.value.status_code == 403


async def test_require_role_level_allows_sufficient_role():
    dependency = require_role_level(6)
    user = {"role": "admin", "role_level": 6}

    assert await dependency(user=user) == user
