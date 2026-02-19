import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os

def initialize_firebase():
    if not firebase_admin._apps:
        # Check if credentials file exists
        cred_path = settings.FIREBASE_CREDENTIALS_PATH
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print(f"WARNING: Firebase credentials not found at {cred_path}")
            # fall back to default for cloud environments if needed, or raise error
            # firebase_admin.initialize_app() 

def get_firestore_client():
    initialize_firebase()
    return firestore.client()
