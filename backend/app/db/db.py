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

# Read database configuration from environment
db_echo = os.getenv("DB_ECHO", "false").lower() == "true"
db_pool_size = int(os.getenv("DB_POOL_SIZE", "10"))
db_max_overflow = int(os.getenv("DB_MAX_OVERFLOW", "20"))
db_pool_timeout = int(os.getenv("DB_POOL_TIMEOUT", "30"))
db_pool_recycle = int(os.getenv("DB_POOL_RECYCLE", "3600"))
db_pool_pre_ping = os.getenv("DB_POOL_PRE_PING", "true").lower() == "true"

# Create async engine with production settings
engine = create_async_engine(
    DATABASE_URL,
    echo=db_echo,
    poolclass=AsyncAdaptedQueuePool,
    pool_size=db_pool_size,
    max_overflow=db_max_overflow,
    pool_timeout=db_pool_timeout,
    pool_recycle=db_pool_recycle,
    pool_pre_ping=db_pool_pre_ping,
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

