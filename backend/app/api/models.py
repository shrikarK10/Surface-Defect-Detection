from typing import List

from pydantic import BaseModel, Field, ConfigDict


class Detection(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    class_: str = Field(alias="class", serialization_alias="class")
    confidence: float
    bbox: List[float]


class Meta(BaseModel):
    width: int
    height: int
    inference_ms: float


class PredictResponse(BaseModel):
    detections: List[Detection]
    meta: Meta


class UploadResponse(BaseModel):
    uploaded: int


class ModelInfo(BaseModel):
    name: str
    version: str
    loaded: bool


class ModelLoadRequest(BaseModel):
    name: str
    version: str | None = None


class ModelLoadResponse(BaseModel):
    name: str
    version: str
    loaded: bool

