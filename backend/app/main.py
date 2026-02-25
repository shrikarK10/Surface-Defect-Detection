from fastapi import FastAPI

from app.api.predict import router as predict_router
from app.api.upload import router as upload_router
from app.api.models_api import router as models_router
from app.core.logging import get_logger


logger = get_logger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Surface Defect Detection System",
        version="0.1.0",
    )

    app.include_router(predict_router)
    app.include_router(upload_router)
    app.include_router(models_router)

    @app.get("/api/v1/health")
    async def health():
        logger.info("health_check", extra={"status": "ok"})
        return {"status": "ok"}

    logger.info("application_started")
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

