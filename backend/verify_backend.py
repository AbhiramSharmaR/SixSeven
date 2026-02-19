import json
import sys
from unittest.mock import MagicMock

# Mock firebase_admin before importing app.main
sys.modules["firebase_admin"] = MagicMock()
sys.modules["firebase_admin.credentials"] = MagicMock()
sys.modules["firebase_admin.firestore"] = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.firestore"] = MagicMock()

# Now import app
from app.main import app
from app.models import UserSignup, AnalysisResultResponse, AnalysisHistoryItem
from fastapi.routing import APIRoute

print("============================================================")
print("1. LIST OF BACKEND ROUTES")
print("============================================================")
for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"{route.methods} {route.path}")

print("\n============================================================")
print("2. EXAMPLE REQUEST PAYLOAD (Signup)")
print("============================================================")
signup_example = {
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser",
    "fullName": "Test User",
    "hospital": "Test Hospital",
    "gender": "male"
}
# Validate against model
try:
    UserSignup(**signup_example)
    print(json.dumps(signup_example, indent=2))
    print("(Matches UserSignup model)")
except Exception as e:
    print(f"Validation Error: {e}")

print("\n============================================================")
print("3. EXAMPLE RESPONSE JSON (Analysis Result)")
print("============================================================")
# Mock data matching frontend structure
analysis_example = {
    "patient_id": "PATIENT_12345",
    "timestamp": "2023-10-27T10:00:00Z",
    "results": [
        {
            "drug": "DrugA",
            "risk_assessment": {
                "risk_label": "High",
                "confidence_score": 0.95,
                "severity": "high"
            },
            "pharmacogenomic_profile": {
                "primary_gene": "CYP2D6",
                "diplotype": "*1/*2",
                "phenotype": "PM",
                "detected_variants": [{"rsid": "rs123"}]
            }
        }
    ]
}
try:
    AnalysisResultResponse(**analysis_example)
    print(json.dumps(analysis_example, indent=2))
    print("(Matches AnalysisResultResponse model)")
except Exception as e:
    print(f"Validation Error: {e}")

print("\n============================================================")
print("4. EXAMPLE RESPONSE JSON (History Item)")
print("============================================================")
history_example = {
    "id": "123",
    "fileName": "sample.vcf",
    "drugs": ["DrugA", "DrugB"],
    "timestamp": "2023-10-27T10:00:00Z"
}
try:
    AnalysisHistoryItem(**history_example)
    print(json.dumps(history_example, indent=2))
    print("(Matches AnalysisHistoryItem model)")
except Exception as e:
    print(f"Validation Error: {e}")
