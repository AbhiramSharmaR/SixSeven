from app.firebase_config import get_firestore_client

# Initialize Firestore Client
db = get_firestore_client()

# Export for use in other modules
# Usage:
# db.collection('users').add(...)
