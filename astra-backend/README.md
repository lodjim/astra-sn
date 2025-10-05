# Astra Backend

FastAPI service for transiting exoplanet predictions using machine learning.

## Features

- **Health Check**: Monitor service and model status
- **JSON Predictions**: Single record predictions via REST API
- **CSV Predictions**: Batch predictions from uploaded CSV files
- **LLM Integration**: OpenAI-powered predictions
- **CORS Enabled**: Ready for frontend integration

## Installation

```bash
uv sync
```

## Running the Server

```bash
uv run python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Or use the provided script:

```bash
./start.sh
```

## API Endpoints

- `GET /health-check` - Check server and model status
- `POST /predict` - Make prediction from JSON data
- `POST /predict-csv` - Make predictions from CSV file
- `POST /llm-predict` - LLM-powered predictions

## API Documentation

Once running, visit:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Model

The service uses an XGBoost model (`xgb_weighted_model.joblib`) for predictions. Ensure the model file is present in the root directory.

## Required Features

The model expects the following features:
- dec, st_pmra, st_pmdec
- pl_tranmid, pl_orbper, pl_trandurh, pl_trandep
- pl_rade, pl_insol
- st_tmag, st_dist, st_teff, st_logg, st_rad

## Dependencies

- FastAPI
- Uvicorn
- Pandas
- Scikit-learn
- XGBoost
- OpenAI
- NumPy
