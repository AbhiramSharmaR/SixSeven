import joblib
import pandas as pd
import xgboost

try:
    model = joblib.load("pgx_polypharmacy_xgb_model.pkl")
    print("Model loaded successfully.")
    
    if hasattr(model, "feature_names_in_"):
        print("Feature names found in model.feature_names_in_:")
        for name in model.feature_names_in_:
            print(f"FEATURE: {name}")
    elif hasattr(model, "get_booster"):
        print("Feature names found in model.get_booster().feature_names:")
        for name in model.get_booster().feature_names:
            print(f"FEATURE: {name}")
    else:
        print("Could not find feature names on model object.")
        print(f"Model type: {type(model)}")
        
except Exception as e:
    print(f"Error loading model: {e}")
