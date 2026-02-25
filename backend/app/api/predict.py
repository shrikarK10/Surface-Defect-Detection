from time import perf_counter
from typing import Annotated
from io import BytesIO

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from PIL import Image

from app.api.models import PredictResponse
from app.core.model_stub import ModelStub
from app.core.logging import get_logger


router = APIRouter(prefix="/api/v1", tags=["predict"])

logger = get_logger(__name__)
model_stub = ModelStub()


@router.post("/predict", response_model=PredictResponse)
async def predict(image: Annotated[UploadFile, File(...)]):
    if image.content_type is None or not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )

    start = perf_counter()
    contents = await image.read()

    try:
        img = Image.open(BytesIO(contents))
        img = img.convert("RGB")
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("failed_to_open_image", extra={"error": str(exc)})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file",
        ) from exc

    width, height = img.size
    detections = model_stub.predict(img)
    elapsed_ms = (perf_counter() - start) * 1000.0

    logger.info(
        "prediction_completed",
        extra={
            "width": width,
            "height": height,
            "inference_ms": round(elapsed_ms, 3),
            "detections_count": len(detections),
        },
    )

    return PredictResponse(
        detections=detections,
        meta={
            "width": width,
            "height": height,
            "inference_ms": round(elapsed_ms, 3),
        },
    )

