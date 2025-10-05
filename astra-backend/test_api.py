#!/usr/bin/env python3
"""
Simple test script for the FastAPI server
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health-check")
        print("Health Check Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the server first.")
        return False
    except Exception as e:
        print(f"❌ Error testing health check: {e}")
        return False

def test_prediction():
    """Test the prediction endpoint"""
    try:
        # Sample prediction request
        test_data = {
            "dec": 41.9,
            "st_pmra": -5.2,
            "st_pmdec": -12.3,
            "pl_tranmid": 2454833.0,
            "pl_orbper": 3.52,
            "pl_trandurh": 0.128,
            "pl_trandep": 0.0156,
            "pl_rade": 1.08,
            "pl_insol": 1420.0,
            "st_tmag": 9.97,
            "st_dist": 47.3,
            "st_teff": 6091.0,
            "st_logg": 4.35,
            "st_rad": 1.15
        }
        
        response = requests.post(f"{BASE_URL}/predict", json=test_data, headers={"Content-Type": "application/json"})
        print("\nPrediction Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing prediction: {e}")
        return False

def test_llm_prediction():
    """Test the LLM prediction endpoint"""
    try:
        # Sample prediction request
        test_data = {
            "dec": 41.9,
            "st_pmra": -5.2,
            "st_pmdec": -12.3,
            "pl_tranmid": 2454833.0,
            "pl_orbper": 3.52,
            "pl_trandurh": 0.128,
            "pl_trandep": 0.0156,
            "pl_rade": 1.08,
            "pl_insol": 1420.0,
            "st_tmag": 9.97,
            "st_dist": 47.3,
            "st_teff": 6091.0,
            "st_logg": 4.35,
            "st_rad": 1.15
        }
        
        response = requests.post(f"{BASE_URL}/llm-predict", json=test_data, headers={"Content-Type": "application/json"})
        print("\nLLM Prediction Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing LLM prediction: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing FastAPI server...")
    
    if test_health_check():
        print("✅ Health check passed")
        
        if test_prediction():
            print("✅ Prediction test passed")
        else:
            print("❌ Prediction test failed")
            
        print("\n🤖 Testing LLM endpoint...")
        if test_llm_prediction():
            print("✅ LLM prediction test passed")
        else:
            print("❌ LLM prediction test failed")
    else:
        print("❌ Health check failed")
        
    print("\n📖 To test with your own model:")
    print("1. Replace 'rf_model_toi.pkl' with your trained model")
    print("2. Or rename 'rf_model_toi_sample.pkl' to 'rf_model_toi.pkl' for testing")
    print("3. Set OPENAI_API_KEY environment variable for LLM predictions")