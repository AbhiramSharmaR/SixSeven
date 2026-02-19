
import joblib
try:
    le = joblib.load("pgx_label_encoder.pkl")
    print("Classes:", le.classes_)
except Exception as e:
    print(e)
