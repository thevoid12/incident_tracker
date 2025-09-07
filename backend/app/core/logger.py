"""
Logging configuration for the application.
Provides structured logging with rotating file output and different log levels.
"""

import sys
import logging
from pathlib import Path
from logging.handlers import RotatingFileHandler
import os
import threading
import time
from .settings import config
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Try to import watchdog for file watching
try:
    WATCHDOG_AVAILABLE = True
except ImportError:
    WATCHDOG_AVAILABLE = False

# Global variables for file watching
_config_observer = None
_config_watcher_thread = None


# Create logs directory if it doesn't exist
logs_dir = Path(__file__).parent.parent / "logs"
logs_dir.mkdir(exist_ok=True)

# Log format - will be set during setup_logging
LOG_FORMAT = config.LOGGING.LOG_FORMAT
DATE_FORMAT = config.LOGGING.DATE_FORMAT

# Console handler - will be configured during setup_logging
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(getattr(logging, config.LOGGING.CONSOLE_LEVEL.upper(), logging.INFO))
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

# Single application logger
LOGGER_NAME = config.LOGGING.LOGGER_NAME
LOGGER = logging.getLogger(LOGGER_NAME)

def setup_logging(log_level: str = "DEBUG", max_bytes: int = 10 * 1024 * 1024, backup_count: int = 5) -> None:
    """
    Setup logging configuration for the entire application.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        max_bytes: Maximum size of log file in bytes
        backup_count: Number of backup log files to keep
    """
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    root_logger = logging.getLogger()
    root_logger.setLevel(numeric_level)

    # Remove old handlers to avoid duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Create file handler with config values
    file_handler = CustomRotatingFileHandler(
        logs_dir / "app.log",
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding='utf-8'
    )
    file_handler.setLevel(getattr(logging, config.LOGGING.FILE_LEVEL.upper(), logging.DEBUG))
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT, DATE_FORMAT))

    # Add handlers
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Reduce noise from external libraries
    for logger_name, level in config.LOGGING.EXTERNAL_LOGGERS.items():
        logging.getLogger(logger_name).setLevel(getattr(logging, level.upper(), logging.WARNING))

    # Log initialization
    LOGGER.info("Logging system initialized")
    LOGGER.info(f"Log files will be written to: {logs_dir}")
    LOGGER.info(f"Log level set to: {log_level}")

    # Start config file watcher for dynamic updates
    start_config_watcher()

def get_logger() -> logging.Logger:
    """
    Get the main application logger.
    """
    return LOGGER


def reload_logging_config() -> None:
    """
    Reload logging configuration from config file and apply changes dynamically.
    This function re-reads the current config and updates all logging settings.
    """
    try:
        # Force reload of config (Dynaconf should handle this)
        # The config object should automatically reflect file changes

        # Update root logger level
        root_logger = logging.getLogger()
        root_logger.setLevel(getattr(logging, config.LOGGING.LEVEL.upper(), logging.INFO))

        # Update console handler level
        console_handler.setLevel(getattr(logging, config.LOGGING.CONSOLE_LEVEL.upper(), logging.INFO))

        # Update file handler level (find it in root logger handlers)
        for handler in root_logger.handlers:
            if hasattr(handler, 'baseFilename') and 'app.log' in handler.baseFilename:
                handler.setLevel(getattr(logging, config.LOGGING.FILE_LEVEL.upper(), logging.DEBUG))
                break

        # Update external logger levels
        for logger_name, level in config.LOGGING.EXTERNAL_LOGGERS.items():
            logging.getLogger(logger_name).setLevel(getattr(logging, level.upper(), logging.WARNING))

        LOGGER.info(f"Logging configuration reloaded - Root: {config.LOGGING.LEVEL}, Console: {config.LOGGING.CONSOLE_LEVEL}, File: {config.LOGGING.FILE_LEVEL}")

    except Exception as e:
        LOGGER.error(f"Failed to reload logging config: {str(e)}")
        # Don't re-raise to avoid crashing the application

def start_config_watcher() -> None:
    """Start watching config.json for changes."""
    # Check if file watcher is enabled in config
    if not config.LOGGING.ENABLE_FILE_WATCHER:
        LOGGER.info("Config file watcher disabled by configuration")
        return

    if not WATCHDOG_AVAILABLE:
        LOGGER.warning("watchdog not available, config file watching disabled")
        return

    try:
        config_path = Path(__file__).parent / "config.json"

        if not config_path.exists():
            LOGGER.warning(f"Config file not found: {config_path}")
            return

        global _config_observer, _config_watcher_thread

        # Stop existing watcher if running
        if _config_observer:
            _config_observer.stop()
            _config_observer.join()

        # Create new watcher
        event_handler = ConfigFileHandler(config_path)
        _config_observer = Observer()
        _config_observer.schedule(event_handler, str(config_path.parent), recursive=False)

        # Start watcher in background thread
        _config_watcher_thread = threading.Thread(target=_config_observer.start, daemon=True)
        _config_watcher_thread.start()

        LOGGER.info("Config file watcher started")

    except Exception as e:
        LOGGER.error(f"Failed to start config watcher: {str(e)}")


def stop_config_watcher() -> None:
    """Stop watching config.json for changes."""
    global _config_observer, _config_watcher_thread

    if _config_observer:
        try:
            _config_observer.stop()
            if _config_watcher_thread and _config_watcher_thread.is_alive():
                _config_watcher_thread.join(timeout=1.0)
            _config_observer = None
            _config_watcher_thread = None
            LOGGER.info("Config file watcher stopped")
        except RuntimeError:
            # Thread was never started or already joined
            _config_observer = None
            _config_watcher_thread = None
            LOGGER.debug("Config file watcher cleanup completed")


class ConfigFileHandler(FileSystemEventHandler):
    """File system event handler for config.json changes."""

    def __init__(self, config_path: Path):
        self.config_path = config_path
        self.last_modified = config_path.stat().st_mtime

    def on_modified(self, event):
        """Called when config.json is modified."""
        if event.src_path == str(self.config_path):
            # Add a small delay to avoid multiple rapid triggers
            time.sleep(0.5)

            # Check if file was actually modified (not just accessed)
            current_mtime = self.config_path.stat().st_mtime
            if current_mtime > self.last_modified:
                self.last_modified = current_mtime
                LOGGER.info("Config file changed, reloading logging configuration...")
                reload_logging_config()
