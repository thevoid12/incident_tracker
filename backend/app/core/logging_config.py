"""
Logging configuration for the application.
Provides structured logging with rotating file output and different log levels.
"""

import sys
import logging
from pathlib import Path
from logging.handlers import RotatingFileHandler
import os

# Create logs directory if it doesn't exist
logs_dir = Path(__file__).parent.parent / "logs"
logs_dir.mkdir(exist_ok=True)

# Log format
LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)-20s | %(filename)-15s:%(lineno)-4d | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FORMAT))

# Custom rotating file handler that recreates file if deleted during runtime
class CustomRotatingFileHandler(RotatingFileHandler):
    def emit(self, record):
        # Check if the log file exists, if not, recreate it
        if not os.path.exists(self.baseFilename):
            # Close current stream if open
            if self.stream:
                self.stream.close()
                self.stream = None
            # Reopen will create the file
            self._open()
        super().emit(record)

# Rotating file handler for all logs
file_handler = CustomRotatingFileHandler(
    logs_dir / "app.log",
    maxBytes=10 * 1024 * 1024,  # 10 MB
    backupCount=5,
    encoding='utf-8'
)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FORMAT))


# Single application logger
LOGGER_NAME = "incident_tracker"
LOGGER = logging.getLogger(LOGGER_NAME)

def setup_logging(log_level: str = "DEBUG") -> None:
    """
    Setup logging configuration for the entire application.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Remove old handlers because unkowingly if you call set logger again,
    # we shouldnt write it twice. So I remove the old logger and add the newer one
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add handlers
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Reduce noise from external libraries
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.dialects").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    # Log initialization
    LOGGER.info("Logging system initialized")
    LOGGER.info(f"Log files will be written to: {logs_dir}")
    LOGGER.info(f"Log level set to: {log_level}")

def get_logger() -> logging.Logger:
    """
    Get the main application logger.
    """
    return LOGGER

