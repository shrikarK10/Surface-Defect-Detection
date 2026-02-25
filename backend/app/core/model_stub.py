from __future__ import annotations

from dataclasses import dataclass
from typing import List

from PIL import Image

from app.api.models import Detection


@dataclass
class ModelStub:
    """
    Deterministic mock model used during early development.

    TODO: Replace this stub with real YOLO model loading and inference logic.
    """

    base_confidence: float = 0.87

    def predict(self, image: Image.Image) -> List[Detection]:
        width, height = image.size

        # Simple deterministic bbox based on image size:
        # a rectangle located at 10% from top-left with 50% of width/height.
        bbox_width = width * 0.5
        bbox_height = height * 0.5
        x = width * 0.1
        y = height * 0.1

        bbox = [x, y, bbox_width, bbox_height]

        return [
            Detection(
                class_="scratch",
                confidence=self.base_confidence,
                bbox=bbox,
            )
        ]

