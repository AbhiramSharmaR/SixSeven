import random

class PharmacogenomicModel:
    def __init__(self):
        # In a real app, this would load trained models
        pass
        
    def predict(self, genotypes: dict, drug: str) -> dict:
        """
        Predicts risk, gene, phenotype based on genotypes and drug.
        """
        # Mock logic to match frontend expectations
        # Real logic would use the genotypes to look up variants
        
        # Deterministic random based on drug name for consistency in demo
        seed = sum(ord(c) for c in drug)
        random.seed(seed)
        
        risk_labels = ["Safe", "Adjust Dosage", "Toxic", "Ineffective"]
        risk = random.choice(risk_labels)
        
        result = {
            "risk_assessment": {
                "risk_label": risk,
                "confidence_score": round(random.uniform(0.7, 0.99), 2),
                "severity": "high" if risk == "Toxic" else "moderate" if risk == "Adjust Dosage" else "low"
            },
            "pharmacogenomic_profile": {
                "primary_gene": "CYP2D6", # Simplified
                "diplotype": "*1/*2",
                "phenotype": "Intermediate Metabolizer",
                "detected_variants": []
            }
        }
        
        # Add some dummy variants from the input if matches (simulation)
        for rsid, gt in list(genotypes.items())[:2]:
            result["pharmacogenomic_profile"]["detected_variants"].append({"rsid": rsid})
            
        return result

model = PharmacogenomicModel()
