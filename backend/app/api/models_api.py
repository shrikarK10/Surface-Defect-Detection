from typing import List

from fastapi import APIRouter

from app.api.models import ModelInfo, ModelLoadRequest, ModelLoadResponse
from app.core.logging import get_logger


router = APIRouter(prefix="/api/v1", tags=["models"])

logger = get_logger(__name__)

_MODELS: dict[str, ModelInfo] = {
    "surface-yolo-v1": ModelInfo(name="surface-yolo-v1", version="1.0.0", loaded=True),
    "surface-yolo-v2": ModelInfo(name="surface-yolo-v2", version="2.0.0", loaded=False),
}


@router.get("/models", response_model=List[ModelInfo])
def list_models():
    return list(_MODELS.values())


@router.post("/models/load", response_model=ModelLoadResponse)
def load_model(payload: ModelLoadRequest):
    model = _MODELS.get(payload.name)
    if model is None:
        # create a new mock model entry if it doesn't exist yet
        model = ModelInfo(
            name=payload.name,
            version=payload.version or "1.0.0",
            loaded=False,
        )
        _MODELS[payload.name] = model

    new_loaded_state = not model.loaded
    updated = model.model_copy(update={"loaded": new_loaded_state})
    _MODELS[payload.name] = updated

    logger.info(
        "model_load_toggled",
        extra={
            "name": updated.name,
            "version": updated.version,
            "loaded": updated.loaded,
        },
    )

    return ModelLoadResponse(
        name=updated.name,
        version=updated.version,
        loaded=updated.loaded,
    )

