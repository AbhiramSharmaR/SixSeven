from app.firebase_config import get_firestore_client
import sys

try:
    print("Initializing Firestore client...")
    db = get_firestore_client()
    
    # Try to list collections (this requires read permissions)
    print("Attempting to access Firestore...")
    collections = db.collections()
    
    # Just retrieving the iterator is not enough to verify connection/auth, need to consume it or do a read
    # Let's try to get a non-existent document which should verify auth at least
    doc_ref = db.collection("test_connection").document("ping")
    doc = doc_ref.get()
    
    print("✅ Database connection successful!")
    print(f"Project ID: {db.project}")
    
except Exception as e:
    print("❌ Database connection failed!")
    print(f"Error: {e}")
    sys.exit(1)
