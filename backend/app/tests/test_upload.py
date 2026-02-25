import io
from pathlib import Path

from fastapi.testclient import TestClient
from PIL import Image

from app.core.storage import get_images_dir
from app.main import app


client = TestClient(app)


def _create_image_bytes(width: int = 320, height: int = 240) -> io.BytesIO:
    img = Image.new("RGB", (width, height), color=(0, 255, 0))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def test_upload_multiple_images():
    img1 = _create_image_bytes()
    img2 = _create_image_bytes()

    files = [
        ("files", ("img1.png", img1, "image/png")),
        ("files", ("img2.png", img2, "image/png")),
    ]

    response = client.post("/api/v1/upload", files=files)
    assert response.status_code == 200

    data = response.json()
    assert data["uploaded"] == 2

    images_dir = get_images_dir()
    saved_files = {p.name for p in images_dir.glob("img*.png")}
    assert "img1.png" in saved_files
    assert "img2.png" in saved_files

