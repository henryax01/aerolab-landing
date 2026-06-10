ROLE_LEVELS = {
    "customer": 1,
    "admin": 6,
}


def get_role_level(role: str) -> int:
    return ROLE_LEVELS.get(role, ROLE_LEVELS["customer"])
