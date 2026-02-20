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
            print(f"Firebase initialized with credentials from {cred_path}")
        elif os.path.exists("/etc/secrets/serviceAccountKey.json"):
            # Fallback for Render secret file mount
            # This handles the case where user mounts the secret but forgets to update ENV var
            print("Found credentials at /etc/secrets/serviceAccountKey.json")
            cred = credentials.Certificate("/etc/secrets/serviceAccountKey.json")
            firebase_admin.initialize_app(cred)
        else:
            print(f"WARNING: Firebase credentials not found at {cred_path} or /etc/secrets/serviceAccountKey.json")
            print("Attempting to initialize with Application Default Credentials (ADC)...")
            # Try to initialize with Environment Variables or ADC
            try:
                firebase_admin.initialize_app()
                print("Firebase initialized with ADC/Env vars")
            except Exception as e:
                print(f"Failed to initialize Firebase: {e}") 

def get_firestore_client():
    try:
        initialize_firebase()
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firestore client: {e}")
        return None
