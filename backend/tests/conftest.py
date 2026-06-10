import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from main import app  # noqa: E402


@pytest.fixture()
def client():
    # No usamos "with TestClient(...)" a propósito: eso dispara el evento de
    # arranque (siembra del admin en Mongo) y en Windows el loop de Motor
    # queda ligado a un event loop que pytest-asyncio cierra entre tests.
    return TestClient(app)
