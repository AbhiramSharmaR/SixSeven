from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.config import settings
from app.database import db
from app.models import UserInDB
from app.utils.security import verify_password
# Remove async/await for Firestore (synchronous client) unless using async adapter
# But typical python firebase-admin is sync. Let's check requirements.
# The user wants "firebase-admin". It is synchronous.

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Firestore Query
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).stream()
    
    user_doc = None
    for doc in query:
        user_data = doc.to_dict()
        user_data["uid"] = doc.id
        user_doc = user_data
        break
        
    if user_doc is None:
        raise credentials_exception
        
    return user_doc

def authenticate_user(email: str, password: str):
    # Firestore Query
    users_ref = db.collection("users")
    query = users_ref.where("email", "==", email).limit(1).stream()
    
    user_doc = None
    for doc in query:
        user_doc = doc.to_dict()
        break
        
    if not user_doc:
        return False
    if not verify_password(password, user_doc["hashed_password"]):
        return False
    
    return user_doc
