from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
import uuid
from app.services.vcf_service import process_vcf
from app.services.prediction_service import predict_drug_risks
from app.models import AnalysisResultResponse, AnalysisRecord
from app.auth import get_current_user
from app.database import db

router = APIRouter()

@router.post("/api/analyze", response_model=AnalysisResultResponse)
async def analyze_vcf(
    vcfFile: UploadFile = File(...),
    selectedDrugs: str = Form(...), # Expecting comma-separated or JSON string
    current_user: dict = Depends(get_current_user)
):
    # Parse drugs
    if "," in selectedDrugs:
        drugs_list = [d.strip() for d in selectedDrugs.split(",")]
    else:
        drugs_list = [selectedDrugs]
        
    # Read VCF
    content = await vcfFile.read()
    genotypes = await process_vcf(content) # Note: vcf_parser is synchronous now (cpu bound)
    
    # Predict
    results = await predict_drug_risks(genotypes, drugs_list)
    
    # Create Result Object
    unique_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()
    patient_id = f"PATIENT_{unique_id[:8]}"
    
    response_data = AnalysisResultResponse(
        patient_id=patient_id,
        timestamp=timestamp,
        results=results
    )
    
    # Save to Firestore
    # User ID from Firestore doc
    user_id = current_user.get("uid")
    
    record = {
        "id": unique_id,
        "user_id": user_id,
        "file_name": vcfFile.filename,
        "drugs": drugs_list,
        "timestamp": datetime.now(),
        "result_data": response_data.model_dump()
    }
    
    db.collection("analyses").document(unique_id).set(record)
    
    return response_data
