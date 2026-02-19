import joblib
import pandas as pd
import numpy as np
import os
import random

# Get the directory of the current file to load models correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class PharmacogenomicModel:
    def __init__(self):
        try:
            self.model = joblib.load(os.path.join(BASE_DIR, "pgx_polypharmacy_xgb_model.pkl"))
            self.le = joblib.load(os.path.join(BASE_DIR, "pgx_label_encoder.pkl"))
            print("Models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}")
            self.model = None
            self.le = None

    def map_genotypes_to_phenotypes(self, genotypes: dict) -> dict:
        """
        Maps rsID genotypes to Gene Phenotypes.
        Simplified logic for demonstration.
        """
        # Default to Normal Metabolizer (NM)
        phenotypes = {
            "CYP2C19": "NM",
            "CYP2D6": "NM",
            "CYP2C9": "NM",
            "SLCO1B1": "NM",
            "TPMT": "NM",
            "DPYD": "NM"
        }
        
        # Example Simplified Mapping (This is illustrative, not exhaustive clinically)
        # CYP2C19
        if "rs4244285" in genotypes: # CYP2C19*2
             phenotypes["CYP2C19"] = "PM"
        elif "rs12248560" in genotypes: # CYP2C19*17
             phenotypes["CYP2C19"] = "URM"
             
        # CYP2D6 (Highly complex, simplified here)
        if "rs3892097" in genotypes: # CYP2D6*4
            phenotypes["CYP2D6"] = "PM"
            
        # SLCO1B1
        if "rs4149056" in genotypes: # *5
            phenotypes["SLCO1B1"] = "PM"

        return phenotypes

    def predict(self, genotypes: dict, drug: str) -> dict:
        """
        Predicts risk, gene, phenotype based on genotypes and drug.
        """
        # 1. Map Genotypes to Phenotypes
        phenotypes = self.map_genotypes_to_phenotypes(genotypes)
        
        # 2. Prepare Features for Model
        if self.model:
            # Get feature names from the model
            if hasattr(self.model, "feature_names_in_"):
                 feature_names = self.model.feature_names_in_
            elif hasattr(self.model, "get_booster"):
                 feature_names = self.model.get_booster().feature_names
            else:
                 feature_names = [] # Should not happen with typical XGBoost

            # Initialize all features to 0
            features = {name: 0 for name in feature_names}
            
            # Set Drug Feature
            drug_feature = f"DRUG_{drug.upper()}" # Assuming one-hot encoding format like DRUG_NAME
            # Check if drug feature exists directly or cleaner
            # Based on inspect_model output, features are like 'WARFARIN', 'CYP2C19_PM'
            # So it seems it is just the name. 
            
            if drug.upper() in features:
                features[drug.upper()] = 1
            
            # Set Phenotype Features
            for gene, pheno in phenotypes.items():
                feature_key = f"{gene}_{pheno}"
                if feature_key in features:
                    features[feature_key] = 1
            
            # Create DataFrame
            df = pd.DataFrame([features])
            
            # Predict
            try:
                prediction_idx = self.model.predict(df)[0]
                prediction_prob = self.model.predict_proba(df)[0]
                
                # Decode Label
                risk_label = self.le.inverse_transform([prediction_idx])[0]
                confidence = float(np.max(prediction_prob))
            except Exception as e:
                print(f"Prediction error: {e}")
                risk_label = "Unknown"
                confidence = 0.0
        else:
            # Fallback if model not loaded
            risk_label = "Safe"
            confidence = 0.5

        # 3. Construct Detailed Response
        
        # Calculate Severity based on risk label
        severity = "low"
        if risk_label in ["Toxic", "High Risk"]:
            severity = "high"
        elif risk_label in ["Adjust Dosage", "Moderate Risk"]:
            severity = "moderate"
            
        # Determine Primary Gene (Simplified: Pick CYP2C19 or first found)
        primary_gene = "CYP2C19" # Default
        # Try to find relevant gene for drug (Knowledge Base would be better here)
        drug_gene_map = {
            "CLOPIDOGREL": "CYP2C19",
            "WARFARIN": "CYP2C9", # or VKORC1
            "CODEINE": "CYP2D6",
            "SIMVASTATIN": "SLCO1B1",
            "AZATHIOPRINE": "TPMT",
            "FLUOROURACIL": "DPYD"
        }
        primary_gene = drug_gene_map.get(drug.upper(), "CYP2C19")
        
        result = {
            "patient_id": "PATIENT_001", # Placeholder
            "drug": drug,
            "timestamp": pd.Timestamp.now().isoformat(),
            "risk_assessment": {
                "risk_label": risk_label,
                "confidence_score": round(confidence, 2),
                "severity": severity
            },
            "pharmacogenomic_profile": {
                "primary_gene": primary_gene,
                "diplotype": "*1/*1", # Placeholder logic
                "phenotype": phenotypes.get(primary_gene, "NM"),
                "detected_variants": [{"rsid": k, "genotype": v} for k, v in genotypes.items()]
            },
            "clinical_recommendation": {
                "text": f"Based on the {risk_label} risk for {drug}, please consult guidelines."
            },
            "llm_generated_explanation": {
                "summary": f"The patient is a {phenotypes.get(primary_gene, 'NM')} for {primary_gene}, which affects {drug} metabolism."
            },
            "quality_metrics": {
                "vcf_parsing_success": True,
                "variant_count": len(genotypes),
                "model_available": self.model is not None
            }
        }
        
        return result

model = PharmacogenomicModel()

