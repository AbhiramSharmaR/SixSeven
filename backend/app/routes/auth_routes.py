from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.models import UserSignup, UserLogin, Token
from app.database import db
from app.utils.security import get_password_hash, create_access_token
from app.auth import authenticate_user
from datetime import timedelta

router = APIRouter()

@router.post("/api/signup", response_model=Token)
async def signup(user_data: UserSignup):
    # Check if user exists (Firestore)
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", user_data.email).limit(1).stream()
    
    existing_user = None
    for doc in query:
        existing_user = doc
        break
        
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.model_dump()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    
    # Save to Firestore (Auto ID)
    db.collection("users").add(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user_data.username,
            "email": user_data.email,
            "fullName": user_data.fullName
        }
    }

@router.post("/api/login", response_model=Token)
async def login(login_data: UserLogin):
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "fullName": user.get("fullName", "")
        }
    }
