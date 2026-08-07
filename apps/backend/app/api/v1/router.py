from fastapi import APIRouter
from app.api.v1.endpoints import auth, sessions, shots, upload, analyze, dashboard, training

router = APIRouter()

router.include_router(auth.router)
router.include_router(sessions.router)
router.include_router(shots.router)
router.include_router(upload.router)
router.include_router(analyze.router)
router.include_router(dashboard.router)
router.include_router(training.router)