#!/usr/bin/env python3
"""
Wrapper script to run logger tests from project root.
This script handles the dependency management and runs the test.
"""

import subprocess
import sys
from pathlib import Path

def main():
    """Run the logger test from the project root."""
    project_root = Path(__file__).parent

    # Change to backend directory where pyproject.toml is located
    backend_dir = project_root / "backend"

    # Run the test using uv
    cmd = ["uv", "run", "python", "-m", "app.core.logger_test"]

    try:
        result = subprocess.run(cmd, cwd=backend_dir, capture_output=False, text=True)
        return result.returncode
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
        return 1
    except Exception as e:
        print(f"Error running test: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())