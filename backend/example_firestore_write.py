from app.firebase_config import get_firestore_client
from datetime import datetime

def example_write():
    print("Initializing Firestore...")
    db = get_firestore_client()
    
    # Data to write
    data = {
        "example_run": True,
        "timestamp": datetime.now(),
        "message": "Hello from PharmaGuard Backend!",
        "details": {
            "status": "connected",
            "db_type": "firestore"
        }
    }
    
    print(f"Writing data to collection 'test_writes'...")
    # Add a new document with auto-generated ID
    update_time, doc_ref = db.collection("test_writes").add(data)
    
    print(f"✅ Document added with ID: {doc_ref.id}")
    print(f"Update time: {update_time}")

if __name__ == "__main__":
    example_write()
