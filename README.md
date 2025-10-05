# astra-sn

A full-stack machine learning application for transiting exoplanet predictions.

## Project Structure

```
astra-sn/
├── astra-frontend/    # Next.js frontend application
├── astra-backend/     # FastAPI backend service
└── README.md          # This file
```

## Overview

Astra-SN is a comprehensive ML platform that combines a modern web interface with a powerful prediction API for analyzing transiting exoplanet data.

## Quick Start

### Backend Setup

```bash
cd astra-backend
uv sync
uv run python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`
API documentation: `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd astra-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

- **ML Predictions**: Random Forest model for exoplanet classification
- **CSV Upload**: Batch predictions from CSV files
- **Interactive UI**: Modern Next.js interface
- **REST API**: FastAPI backend with automatic documentation

## Requirements

- Python 3.12+
- Node.js 18+
- uv (Python package manager)

## License

MIT
