#!/usr/bin/env python3
"""
Development server runner with optimized file watching
"""
import uvicorn
import os

if __name__ == "__main__":
    # Run with specific reload patterns to avoid watching .venv
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=["."],
        reload_includes=["*.py"],
        reload_excludes=[
            ".venv/**/*",
            "__pycache__/**/*",
            "*.pyc",
            "*.pyo", 
            "*.pkl",
            ".git/**/*"
        ],
        log_level="info"
    )