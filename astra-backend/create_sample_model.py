#!/usr/bin/env python3
"""
Create a sample Random Forest model for testing purposes
"""
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification

# Create sample data with the same features as your schema
feature_names = [
    'dec', 'st_pmra', 'st_pmdec', 'pl_tranmid', 'pl_orbper',
    'pl_trandurh', 'pl_trandep', 'pl_rade', 'pl_insol', 'st_tmag',
    'st_dist', 'st_teff', 'st_logg', 'st_rad'
]

print("Creating sample dataset...")
X, y = make_classification(
    n_samples=1000,
    n_features=14,
    n_informative=10,
    n_redundant=2,
    n_clusters_per_class=1,
    random_state=42
)

print("Training Random Forest model...")
rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    max_depth=10
)

rf_model.fit(X, y)

print("Saving model...")
with open('rf_model_toi_sample.pkl', 'wb') as f:
    pickle.dump(rf_model, f)

print("Sample model created and saved as 'rf_model_toi_sample.pkl'")
print("You can rename this file to 'rf_model_toi.pkl' to test the API")

# Test the model
print("\nTesting model...")
sample_prediction = rf_model.predict_proba([[0.1] * 14])[0]
print(f"Sample prediction probabilities: {sample_prediction}")