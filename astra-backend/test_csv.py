#!/usr/bin/env python3
"""
Test CSV upload functionality
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_csv_upload():
    """Test CSV file upload for batch predictions"""
    try:
        with open('sample_data.csv', 'rb') as f:
            files = {'file': ('sample_data.csv', f, 'text/csv')}
            response = requests.post(f"{BASE_URL}/predict-csv", files=files)
        
        print("CSV Upload Response:")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error testing CSV upload: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing CSV upload...")
    
    if test_csv_upload():
        print("✅ CSV upload test passed")
    else:
        print("❌ CSV upload test failed")