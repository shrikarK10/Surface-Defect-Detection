from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from app.core.logging import get_logger


logger = get_logger(__name__)


def get_images_dir() -> Path:
    project_root = Path(__file__).resolve().parents[3]
    images_dir = project_root / "data" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    return images_dir


async def save_upload_file(upload_file: UploadFile, destination_dir: Path) -> Optional[Path]:
    if not upload_file.filename:
        return None

    safe_name = upload_file.filename.replace("/", "_").replace("\\", "_")
    target_path = destination_dir / safe_name

    try:
        with target_path.open("wb") as buffer:
            while True:
                chunk = await upload_file.read(1024 * 1024)
                if not chunk:
                    break
                buffer.write(chunk)
        logger.info(
            "file_saved",
            extra={"filename": upload_file.filename, "path": str(target_path)},
        )
        await upload_file.seek(0)
        return target_path
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception(
            "file_save_failed",
            extra={"filename": upload_file.filename, "error": str(exc)},
        )
        return None

