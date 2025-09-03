"""
Database connection and session management for production use.
Uses SQLAlchemy 2.0 async patterns with connection pooling.
"""

import os
import logging
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import AsyncAdaptedQueuePool

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Convert to async URL if needed
# In a FastAPI app, endpoints can be async def.
# If you use a sync DB driver inside an async endpoint,
# every DB query blocks the event loop until it finishes. That kills concurrency.
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Create async engine with production settings
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for development debugging
    poolclass=AsyncAdaptedQueuePool,
    pool_size=10,  # Connection pool size
    max_overflow=20,  # Max overflow connections
    pool_timeout=30,  # Connection timeout
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Test connections before use
)

# Create async session factory
# session is an abstraction on top of connections.
# very very similar to context in golang. 
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# FastAPI uses Python’s yield-based context managers to handle setup and cleanup.
# I am going to use it as dependency so at every route 
# can call get_db to get a session out of our session factory.
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function for FastAPI to get database session.
    Use with: async def endpoint(db: AsyncSession = Depends(get_db))
    """
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

