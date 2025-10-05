from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Union, Optional

import pandas as pd
import io
import pickle
import numpy as np
import warnings
from schemas import *
from openai import OpenAI
# Suppress sklearn version warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

app = FastAPI(
    title="Astra ML API",
    description="FastAPI service for transiting exoplanet predictions",
    version="0.1.0"
)

# Add CORS middleware to allow all origins and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)
client = OpenAI()

# Load the Random Forest model
rf_model = None
model_status = "not_loaded"

try:
    with open('xgb_weighted_model.joblib', 'rb') as f:
        loaded_data = pickle.load(f)
    rf_model = loaded_data
     
except FileNotFoundError:
    model_status = "file_not_found"
    print("Warning: rf_model_toi.pkl not found")
    print("Server will start but predictions will not be available")
except Exception as e:
    model_status = "error"
    print(f"Error loading model: {e}")
    print("Server will start but predictions will not be available")

@app.get("/health-check", response_model=HealthCheckResponse)
def read_root():
    return {
        "message": "the server is OK",
        "model_status": model_status,
        "model_available": rf_model is not None
    } 
@app.post("/llm-predict", response_model=LLMPredictionResponse)
async def llm_predict(prediction_request: PredictionRequest):
    response = client.responses.parse(
                model="gpt-5",
                reasoning={
                "effort": "minimal"
            },
            input=[
                {"role": "system", "content": SystemPrompt.DEFAULT.value},
                {
                    "role": "user",
                    "content": "Here you have one record"+prediction_request.model_dump_json(),
                },
            ],
            text_format=LLMPredictionResponse,
        )
    return response.output_parsed

@app.post("/predict", response_model=PredictionResponse)
async def predict_json(prediction_request: PredictionRequest):
    """Make a prediction from JSON data"""
    if rf_model is None:
        error_messages = {
            "not_loaded": "Random Forest model is not loaded",
            "file_not_found": "Model file 'rf_model_toi.pkl' not found",
            "invalid_format": "Model file contains invalid data (feature names instead of trained model)",
            "error": "Error occurred while loading the model"
        }
        raise HTTPException(
            status_code=503, 
            detail=f"{error_messages.get(model_status, 'Model not available')}. Please ensure you have a properly trained Random Forest model saved as 'rf_model_toi.pkl'"
        )
    
    try:
        # Convert request to feature array
        features = [
            prediction_request.dec,
            prediction_request.st_pmra,
            prediction_request.st_pmdec,
            prediction_request.pl_tranmid,
            prediction_request.pl_orbper,
            prediction_request.pl_trandurh,
            prediction_request.pl_trandep,
            prediction_request.pl_rade,
            prediction_request.pl_insol,
            prediction_request.st_tmag,
            prediction_request.st_dist,
            prediction_request.st_teff,
            prediction_request.st_logg,
            prediction_request.st_rad
        ]
        
        # Make prediction
        prediction_proba = rf_model.predict_proba([features])[0, 1]  # Probability of positive class
        prediction_class = rf_model.predict([features])[0]
        
        return {
            "message": "Prediction made successfully",
            "prediction_probability": float(prediction_proba),
            "prediction_class": int(prediction_class),
            "input_data": prediction_request.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error making prediction: {str(e)}")

@app.post("/predict-csv", response_model=CSVPredictionResponse)
async def predict_csv(file: UploadFile = File(...)):
    """Make predictions from CSV file upload"""
    if rf_model is None:
        error_messages = {
            "not_loaded": "Random Forest model is not loaded",
            "file_not_found": "Model file 'rf_model_toi.pkl' not found",
            "invalid_format": "Model file contains invalid data (feature names instead of trained model)",
            "error": "Error occurred while loading the model"
        }
        raise HTTPException(
            status_code=503, 
            detail=f"{error_messages.get(model_status, 'Model not available')}. Please ensure you have a properly trained Random Forest model saved as 'rf_model_toi.pkl'"
        )
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Expected feature order
        expected_features = [
            'dec', 'st_pmra', 'st_pmdec', 'pl_tranmid', 'pl_orbper',
            'pl_trandurh', 'pl_trandep', 'pl_rade', 'pl_insol', 'st_tmag',
            'st_dist', 'st_teff', 'st_logg', 'st_rad'
        ]
        
        # Ensure we have the right columns in the right order
        if not all(col in df.columns for col in expected_features):
            missing_cols = [col for col in expected_features if col not in df.columns]
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        # Select and reorder columns to match expected features
        feature_df = df[expected_features]
        
        # Make predictions for all rows in the CSV
        predictions = rf_model.predict_proba(feature_df)[:, 1]  # Get probability of positive class
        prediction_classes = rf_model.predict(feature_df)
        
        # Add predictions to original dataframe
        result_df = df.copy()
        result_df['prediction_probability'] = predictions
        result_df['prediction_class'] = prediction_classes
        
        return {
            "message": "CSV file processed and predictions made successfully",
            "data": result_df.to_dict(orient="records"),
            "rows_count": len(result_df)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")
