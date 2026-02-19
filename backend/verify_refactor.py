
import sys
import os
import joblib

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from training_models import model

# Mock Data
mock_genotypes = {
    "rs4244285": "A", # CYP2C19*2 (PM)
}
drug = "CLOPIDOGREL"

print(f"Running prediction for {drug} with genotypes {mock_genotypes}...")
try:
    result = model.predict(mock_genotypes, drug)
    print("Result:")
    import json
    print(json.dumps(result, indent=2))
    
    # Assertions
    assert "risk_assessment" in result
    assert "pharmacogenomic_profile" in result
    assert "clinical_recommendation" in result
    assert "llm_generated_explanation" in result
    assert "quality_metrics" in result

    # Validate with Pydantic
    try:
        from app.models import DrugResult
        # Create a DrugResult instance from the dictionary
        dr = DrugResult(**result)
        print("\n✅ Pydantic Validation Successful!")
        print(dr.model_dump_json(indent=2))
    except ImportError:
        print("\n⚠️ Could not import app.models (running in isolation?), skipping Pydantic check.")
    except Exception as e:
        print(f"\n❌ Pydantic Validation Failed: {e}")

    print("\n✅ Verification Finalized!")
except Exception as e:
    print(f"\n❌ Verification Failed: {e}")
    import traceback
    traceback.print_exc()
    print(f"\n❌ Verification Failed: {e}")
    # Print stack trace
    import traceback
    traceback.print_exc()
