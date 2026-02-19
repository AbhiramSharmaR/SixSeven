from training_models import model

async def predict_drug_risks(genotypes: dict, drugs: list[str]):
    results = []
    for drug in drugs:
        prediction = model.predict(genotypes, drug)
        results.append({
            "drug": drug,
            **prediction
        })
    return results
