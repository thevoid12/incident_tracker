"""
Database package initialization.
Instead of writing:
from backend.app.db.db import get_db
I want to simplify imports:
from backend.app.db import get_db
and more importantly since db is a critical system,
I want to only expose limited functions as part of db pkg
"""

from .db import get_db, create_tables, drop_tables, engine

__all__ = ["get_db", "engine"]