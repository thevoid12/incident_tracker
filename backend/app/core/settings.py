"""
Dynaconf settings configuration for the application.
Loads configuration from config.json and environment variables.
"""

import os
import json
from pathlib import Path
from dynaconf import Dynaconf

# Get the directory of this file
current_dir = Path(__file__).parent
config_file = current_dir / "config.json"

config = Dynaconf(
    environments=True,
    envvar_prefix="INCIDENT_TRACKER",
    load_dotenv=True,
)

# Load JSON file manually
if config_file.exists():
    with open(config_file, 'r') as f:
        data = json.load(f)
    config.update(data)