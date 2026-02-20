from app.firebase_config import get_firestore_client

# Initialize Firestore Client
# Initialize Firestore Client
try:
    db = get_firestore_client()
except Exception as e:
    print(f"Failed to initialize Firestore DB: {e}")
    db = None

if db is None:
    print("WARNING: Firestore DB is not initialized. Database operations will fail.")
    class MockDB:
        def collection(self, *args, **kwargs):
            raise Exception("Firestore DB not initialized")
    db = MockDB()

# Export for use in other modules
# Usage:
# db.collection('users').add(...)
