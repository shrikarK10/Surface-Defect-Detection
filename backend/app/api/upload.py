from typing import Annotated, List

from fastapi import APIRouter, File, UploadFile

from app.api.models import UploadResponse
from app.core.logging import get_logger
from app.core.storage import get_images_dir, save_upload_file


router = APIRouter(prefix="/api/v1", tags=["upload"])

logger = get_logger(__name__)


@router.post("/upload", response_model=UploadResponse)
async def upload_images(
    files: Annotated[List[UploadFile], File(..., description="Image files to upload")]
):
    images_dir = get_images_dir()

    uploaded_count = 0
    for file in files:
        if not file.content_type or not file.content_type.startswith("image/"):
            logger.info(
                "file_skipped_non_image",
                extra={
                    "filename": file.filename,
                    "content_type": file.content_type,
                },
            )
            continue

        saved_path = await save_upload_file(file, images_dir)
        if saved_path:
            uploaded_count += 1

    logger.info(
        "files_uploaded",
        extra={"uploaded": uploaded_count, "target_dir": str(images_dir)},
    )

    return UploadResponse(uploaded=uploaded_count)


