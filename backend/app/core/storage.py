from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from app.core.logging import get_logger


logger = get_logger(__name__)

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB per file


def get_images_dir() -> Path:
    project_root = Path(__file__).resolve().parents[3]
    images_dir = project_root / "data" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    return images_dir


async def save_upload_file(
    upload_file: UploadFile, destination_dir: Path
) -> Optional[Path]:
    if not upload_file.filename:
        return None

    safe_name = upload_file.filename.replace("/", "_").replace("\\", "_")
    target_path = destination_dir / safe_name

    total_bytes = 0

    try:
        with target_path.open("wb") as buffer:
            while True:
                chunk = await upload_file.read(1024 * 1024)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > MAX_FILE_SIZE_BYTES:
                    logger.info(
                        "file_too_large",
                        extra={
                            "filename": upload_file.filename,
                            "size_bytes": total_bytes,
                            "limit_bytes": MAX_FILE_SIZE_BYTES,
                        },
                    )
                    buffer.close()
                    try:
                        target_path.unlink(missing_ok=True)
                    except OSError:
                        # best effort cleanup
                        ...
                    await upload_file.seek(0)
                    return None
                buffer.write(chunk)
        logger.info(
            "file_saved",
            extra={
                "filename": upload_file.filename,
                "path": str(target_path),
                "size_bytes": total_bytes,
            },
        )
        await upload_file.seek(0)
        return target_path
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception(
            "file_save_failed",
            extra={"filename": upload_file.filename, "error": str(exc)},
        )
        try:
            target_path.unlink(missing_ok=True)
        except OSError:
            ...
        return None


