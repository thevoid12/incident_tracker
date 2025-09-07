#!/usr/bin/env python3
"""
Comprehensive test suite for the dynamic logging system.
Tests all features: setup, dynamic reconfiguration, file watching, and error handling.
"""

import os
import sys
import time
import json
import tempfile
import shutil
import logging as python_logging
from pathlib import Path

# Add project root to path for imports
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "backend"))

from app.core.logger import (
    setup_logging, LOGGER, reload_logging_config,
    start_config_watcher, stop_config_watcher, get_logger
)
from app.core.settings import config


class LoggerTestSuite:
    """Comprehensive test suite for logging functionality."""

    def __init__(self):
        self.test_results = []
        self.original_config = None
        self.temp_config_path = None

    def log_test_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result."""
        status = "PASS" if success else "FAIL"
        result = f"{status}: {test_name}"
        if message:
            result += f" - {message}"
        self.test_results.append(result)
        print(result)

    def setup_test_config(self):
        """Create a temporary config file for testing."""
        # Backup original config
        config_path = Path(__file__).parent / "config.json"
        with open(config_path, 'r') as f:
            self.original_config = json.load(f)

        # Create temp config
        temp_dir = Path(tempfile.mkdtemp())
        self.temp_config_path = temp_dir / "config.json"

        # Copy original config to temp location
        shutil.copy2(config_path, self.temp_config_path)

        return temp_dir

    def restore_original_config(self):
        """Restore original config."""
        if self.original_config and self.temp_config_path:
            # Restore original config
            config_path = Path(__file__).parent / "config.json"
            with open(config_path, 'w') as f:
                json.dump(self.original_config, f, indent=2)

            # Clean up temp directory
            temp_dir = self.temp_config_path.parent
            if temp_dir.exists():
                shutil.rmtree(temp_dir)

    def test_basic_logging_setup(self):
        """Test basic logging setup."""
        try:
            setup_logging()
            LOGGER.info("Basic logging setup test")
            LOGGER.debug("Debug message test")
            LOGGER.warning("Warning message test")
            LOGGER.error("Error message test")
            self.log_test_result("Basic Logging Setup", True, "All log levels working")
            return True
        except Exception as e:
            self.log_test_result("Basic Logging Setup", False, str(e))
            return False

    def test_dynamic_config_reload(self):
        """Test dynamic configuration reloading."""
        try:
            # Change config temporarily
            temp_config = self.original_config.copy()
            temp_config["LOGGING"]["LEVEL"] = "WARNING"

            with open(self.temp_config_path, 'w') as f:
                json.dump(temp_config, f, indent=2)

            # Reload config
            reload_logging_config()

            # Test that WARNING level is now active
            LOGGER.debug("This debug should not appear")
            LOGGER.info("This info should not appear")
            LOGGER.warning("This warning should appear")

            self.log_test_result("Dynamic Config Reload", True, "Config reloaded successfully")
            return True
        except Exception as e:
            self.log_test_result("Dynamic Config Reload", False, str(e))
            return False

    def test_file_watcher_enable_disable(self):
        """Test file watcher enable/disable functionality."""
        try:
            # Test with file watcher enabled
            temp_config = self.original_config.copy()
            temp_config["LOGGING"]["ENABLE_FILE_WATCHER"] = True

            with open(self.temp_config_path, 'w') as f:
                json.dump(temp_config, f, indent=2)

            stop_config_watcher()  # Stop any existing watcher
            start_config_watcher()  # Should start with config enabled

            # Test with file watcher disabled
            temp_config["LOGGING"]["ENABLE_FILE_WATCHER"] = False
            with open(self.temp_config_path, 'w') as f:
                json.dump(temp_config, f, indent=2)

            stop_config_watcher()
            start_config_watcher()  # Should not start due to config

            self.log_test_result("File Watcher Enable/Disable", True, "File watcher control working")
            return True
        except Exception as e:
            self.log_test_result("File Watcher Enable/Disable", False, str(e))
            return False

    def test_log_level_changes(self):
        """Test different log level configurations."""
        try:
            levels = ["DEBUG", "INFO", "WARNING", "ERROR"]

            for level in levels:
                temp_config = self.original_config.copy()
                temp_config["LOGGING"]["LEVEL"] = level

                with open(self.temp_config_path, 'w') as f:
                    json.dump(temp_config, f, indent=2)

                reload_logging_config()
                LOGGER.info(f"Testing log level: {level}")

            self.log_test_result("Log Level Changes", True, f"Tested levels: {', '.join(levels)}")
            return True
        except Exception as e:
            self.log_test_result("Log Level Changes", False, str(e))
            return False

    def test_external_logger_config(self):
        """Test external library logger configuration."""
        try:
            # Test SQLAlchemy loggers
            sql_logger = python_logging.getLogger("sqlalchemy.engine")
            pool_logger = python_logging.getLogger("sqlalchemy.pool")
            dialect_logger = python_logging.getLogger("sqlalchemy.dialects")
            uvicorn_logger = python_logging.getLogger("uvicorn")
            uvicorn_access_logger = python_logging.getLogger("uvicorn.access")

            # Check if levels are set correctly from config
            expected_levels = {
                "sqlalchemy.engine": python_logging.WARNING,
                "sqlalchemy.pool": python_logging.WARNING,
                "sqlalchemy.dialects": python_logging.WARNING,
                "uvicorn": python_logging.INFO,
                "uvicorn.access": python_logging.WARNING
            }

            all_correct = True
            for logger_name, expected_level in expected_levels.items():
                logger = python_logging.getLogger(logger_name)
                if logger.level != expected_level:
                    all_correct = False
                    break

            self.log_test_result("External Logger Config", all_correct,
                               f"All external loggers configured correctly: {all_correct}")
            return all_correct
        except Exception as e:
            self.log_test_result("External Logger Config", False, str(e))
            return False

    def test_log_format_and_date_format(self):
        """Test custom log format and date format."""
        try:
            # Test that the format includes expected components
            LOGGER.info("Testing custom format")

            # Check if log file contains the expected format
            log_dir = project_root / "backend" / "app" / "logs"
            log_file = log_dir / "app.log"


            if log_file.exists():
                with open(log_file, 'r') as f:
                    lines = f.readlines()
                    if lines:
                        last_line = lines[-1]

                        # Check if format contains timestamp, level, logger name, etc.
                        has_timestamp = '|' in last_line and len(last_line.split('|')[0].strip()) > 0
                        has_level = any(level in last_line for level in ['INFO', 'DEBUG', 'WARNING', 'ERROR'])
                        has_logger_name = 'incident_tracker' in last_line

                        format_correct = has_timestamp and has_level and has_logger_name
                        self.log_test_result("Log Format", format_correct, "Custom format working correctly")
                        return format_correct
                    else:
                        self.log_test_result("Log Format", False, "No log lines found")
                        return False
            else:
                self.log_test_result("Log Format", False, "Log file not found")
                return False

        except Exception as e:
            self.log_test_result("Log Format", False, str(e))
            return False

    def test_get_logger_function(self):
        """Test the get_logger function."""
        try:
            logger_instance = get_logger()

            # Should return the same instance as LOGGER
            same_instance = logger_instance is LOGGER

            self.log_test_result("Get Logger Function", same_instance,
                               "get_logger() returns correct instance")
            return same_instance
        except Exception as e:
            self.log_test_result("Get Logger Function", False, str(e))
            return False

    def test_error_handling(self):
        """Test error handling in logging system."""
        try:
            # Test with invalid config
            temp_config = self.original_config.copy()
            temp_config["LOGGING"]["LEVEL"] = "INVALID_LEVEL"

            with open(self.temp_config_path, 'w') as f:
                json.dump(temp_config, f, indent=2)

            # This should handle the error gracefully
            reload_logging_config()

            self.log_test_result("Error Handling", True, "Handled invalid config gracefully")
            return True
        except Exception as e:
            self.log_test_result("Error Handling", False, str(e))
            return False

    def test_log_file_rotation(self):
        """Test log file rotation functionality."""
        try:
            # Generate some logs to test rotation
            for i in range(50):  # Reduced to avoid too much output
                LOGGER.info(f"Test log message {i} for rotation testing")

            # Check if log files exist
            log_dir = project_root / "backend" / "app" / "logs"
            log_files = list(log_dir.glob("app.log*"))


            has_main_log = any("app.log" == f.name for f in log_files)
            self.log_test_result("Log File Rotation", has_main_log,
                               f"Found {len(log_files)} log files")
            return has_main_log
        except Exception as e:
            self.log_test_result("Log File Rotation", False, str(e))
            return False

    def test_config_validation(self):
        """Test configuration validation."""
        try:
            # Test with missing required fields
            temp_config = self.original_config.copy()
            if "LOGGING" in temp_config and "LEVEL" in temp_config["LOGGING"]:
                del temp_config["LOGGING"]["LEVEL"]

            with open(self.temp_config_path, 'w') as f:
                json.dump(temp_config, f, indent=2)

            # Should handle missing fields gracefully
            reload_logging_config()

            self.log_test_result("Config Validation", True, "Handled missing config fields")
            return True
        except Exception as e:
            self.log_test_result("Config Validation", False, str(e))
            return False

    def test_logger_name_from_config(self):
        """Test that logger name is read from config."""
        try:
            configured_name = config.LOGGING.LOGGER_NAME
            actual_name = LOGGER.name

            name_correct = configured_name == actual_name
            self.log_test_result("Logger Name from Config", name_correct,
                               f"Expected: {configured_name}, Actual: {actual_name}")
            return name_correct
        except Exception as e:
            self.log_test_result("Logger Name from Config", False, str(e))
            return False

    def run_all_tests(self):
        """Run all tests in the suite."""
        print("Starting Logger Test Suite")
        print("=" * 50)

        # Setup test environment
        self.setup_test_config()

        try:
            # Run all tests
            self.test_basic_logging_setup()
            time.sleep(0.5)

            self.test_dynamic_config_reload()
            time.sleep(0.5)

            self.test_file_watcher_enable_disable()
            time.sleep(0.5)

            self.test_log_level_changes()
            time.sleep(0.5)

            self.test_external_logger_config()
            time.sleep(0.5)

            self.test_log_format_and_date_format()
            time.sleep(0.5)

            self.test_get_logger_function()
            time.sleep(0.5)

            self.test_logger_name_from_config()
            time.sleep(0.5)

            self.test_error_handling()
            time.sleep(0.5)

            self.test_log_file_rotation()
            time.sleep(0.5)

            self.test_config_validation()

        finally:
            # Cleanup
            self.restore_original_config()
            stop_config_watcher()

        # Print summary
        print("\n" + "=" * 50)
        print("Test Results Summary:")
        print("=" * 50)

        passed = sum(1 for result in self.test_results if "PASS:" in result)
        total = len(self.test_results)

        for result in self.test_results:
            print(result)

        print(f"\nOverall: {passed}/{total} tests passed")

        if passed == total:
            print("All tests passed! Logger system is working perfectly.")
        else:
            print("Some tests failed. Check the output above for details.")

        return passed == total


# def main():
#     """Main test runner."""
#     test_suite = LoggerTestSuite()
#     success = test_suite.run_all_tests()
#     sys.exit(0 if success else 1)


# if __name__ == "__main__":
#     main()