#!/bin/bash

# Start FastAPI server with proper exclusions
export WATCHFILES_IGNORE_PATHS=".venv;__pycache__;*.pyc;*.pyo;*.pkl;.git"

fastapi dev main.py --host 127.0.0.1 --port 8000