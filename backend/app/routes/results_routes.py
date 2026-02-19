from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from app.models import AnalysisHistoryItem, AnalysisResultResponse
from app.auth import get_current_user
from app.database import db
import firebase_admin
from firebase_admin import firestore

router = APIRouter()

@router.get("/api/results", response_model=List[AnalysisHistoryItem])
async def get_results_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("uid")
    
    # Firestore Query
    analyses_ref = db.collection("analyses")
    query = analyses_ref.where("user_id", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING).stream()
    
    history = []
    for doc in query:
        data = doc.to_dict()
        history.append(AnalysisHistoryItem(
            id=data["id"],
            fileName=data["file_name"],
            drugs=data["drugs"],
            timestamp=data["timestamp"].isoformat() if isinstance(data["timestamp"], datetime) else data["timestamp"]
        ))
    
    return history

@router.get("/api/results/{analysis_id}", response_model=AnalysisResultResponse)
async def get_single_result(analysis_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user.get("uid")
    
    # Firestore Query
    analyses_ref = db.collection("analyses")
    query = analyses_ref.where("id", "==", analysis_id).where("user_id", "==", user_id).limit(1).stream()
    
    result_doc = None
    for doc in query:
        result_doc = doc.to_dict()
        break
    
    if not result_doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    return AnalysisResultResponse(**result_doc["result_data"])
