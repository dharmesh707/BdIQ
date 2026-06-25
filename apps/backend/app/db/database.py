from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    """
    Dependency that provides a database session.
    FastAPI injects this into any endpoint that declares
    db: Session = Depends(get_db)
    The finally block ensures the session always closes,
    even if an exception is raised mid-request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()