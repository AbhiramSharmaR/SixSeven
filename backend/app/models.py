from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from datetime import datetime

# --- Auth Models ---
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    username: str
    fullName: str
    hospital: str
    gender: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserInDB(UserSignup):
    hashed_password: str
    uid: Optional[str] = None # Firestore ID

# --- Analysis Result Models ---
class RiskAssessment(BaseModel):
    risk_label: str
    confidence_score: float
    severity: str

class Variant(BaseModel):
    rsid: str
    genotype: Optional[str] = None

class PharmacogenomicProfile(BaseModel):
    primary_gene: str
    diplotype: str
    phenotype: str
    detected_variants: List[Variant] = []

class ClinicalRecommendation(BaseModel):
    text: str

class LLMExplanation(BaseModel):
    summary: str

class QualityMetrics(BaseModel):
    vcf_parsing_success: bool
    variant_count: int
    model_available: bool

class DrugResult(BaseModel):
    drug: str
    risk_assessment: RiskAssessment
    pharmacogenomic_profile: PharmacogenomicProfile
    clinical_recommendation: Optional[ClinicalRecommendation] = None
    llm_generated_explanation: Optional[LLMExplanation] = None
    quality_metrics: Optional[QualityMetrics] = None

class AnalysisResultResponse(BaseModel):
    patient_id: str
    timestamp: str
    results: List[DrugResult]

# --- History Models ---
class AnalysisHistoryItem(BaseModel):
    id: str
    fileName: str
    drugs: List[str]
    timestamp: str

# --- DB Models (Internal) ---
class AnalysisRecord(BaseModel):
    id: str
    user_id: str
    file_name: str
    drugs: List[str]
    timestamp: datetime
    result_data: AnalysisResultResponse
