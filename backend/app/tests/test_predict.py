import io

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


client = TestClient(app)


def _create_image_bytes(width: int = 640, height: int = 480) -> io.BytesIO:
    img = Image.new("RGB", (width, height), color=(255, 0, 0))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def test_predict_returns_deterministic_detection():
    img_bytes = _create_image_bytes()
    files = {"image": ("test.png", img_bytes, "image/png")}

    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 200
    data = response.json()

    assert "detections" in data
    assert "meta" in data
    assert data["meta"]["width"] == 640
    assert data["meta"]["height"] == 480

    detections = data["detections"]
    assert isinstance(detections, list)
    assert len(detections) == 1

    det = detections[0]
    assert det["class"] == "scratch"
    assert det["confidence"] == 0.87

    # call again and ensure detections are the same for the same image size
    img_bytes_2 = _create_image_bytes()
    files_2 = {"image": ("test.png", img_bytes_2, "image/png")}
    response_2 = client.post("/api/v1/predict", files=files_2)
    assert response_2.status_code == 200
    data_2 = response_2.json()
    assert data_2["detections"] == data["detections"]

