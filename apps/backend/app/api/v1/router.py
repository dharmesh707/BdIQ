from fastapi import APIRouter
from app.api.v1.endpoints import auth, sessions, shots

router = APIRouter()
router.include_router(auth.router)
router.include_router(sessions.router)
router.include_router(shots.router)