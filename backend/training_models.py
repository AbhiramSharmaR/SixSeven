import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

# --------------------------------------------------
# 1️⃣ Load Dataset
# --------------------------------------------------

df = pd.read_excel("pgx_full_polypharmacy_dataset.xlsx")

print("Dataset Loaded.")
print(df.head())

# --------------------------------------------------
# 2️⃣ Define Features and Target
# --------------------------------------------------

X = df.drop(columns=["Final_Risk_Label", "Severity"])
y = df["Final_Risk_Label"]

# --------------------------------------------------
# 3️⃣ One-Hot Encode Gene Columns
# --------------------------------------------------

gene_cols = ["CYP2C19", "CYP2D6", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]

X_genes_encoded = pd.get_dummies(df[gene_cols])

drug_cols = [
    "CLOPIDOGREL",
    "CODEINE",
    "WARFARIN",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL"
]

X_final = pd.concat([X_genes_encoded, df[drug_cols]], axis=1)

# --------------------------------------------------
# 4️⃣ Encode Target Labels (REQUIRED FOR XGBOOST)
# --------------------------------------------------

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# --------------------------------------------------
# 5️⃣ Train/Test Split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_final, y_encoded, test_size=0.2, random_state=42
)

# --------------------------------------------------
# 6️⃣ Train XGBoost Model
# --------------------------------------------------

model = XGBClassifier(
    n_estimators=5000,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric="mlogloss"
)

model.fit(X_train, y_train)

print("Model Training Complete.")

# --------------------------------------------------
# 7️⃣ Evaluate Accuracy
# --------------------------------------------------

accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

# --------------------------------------------------
# 8️⃣ Save Model and Encoder
# --------------------------------------------------

joblib.dump(model, "pgx_polypharmacy_xgb_model.pkl")
joblib.dump(label_encoder, "pgx_label_encoder.pkl")

print("Model and Label Encoder Saved.")

# --------------------------------------------------
# 9️⃣ Example Prediction
# --------------------------------------------------

example_patient = pd.DataFrame([{
    "CYP2C19": "URM",
    "CYP2D6": "NM",
    "CYP2C9": "NM",
    "SLCO1B1": "PM",
    "TPMT": "NM",
    "DPYD": "NM",
    "CLOPIDOGREL": 0,
    "CODEINE": 0,
    "WARFARIN": 1,
    "SIMVASTATIN": 0,
    "AZATHIOPRINE": 0,
    "FLUOROURACIL": 1
}])

example_genes_encoded = pd.get_dummies(example_patient[gene_cols])

# Align columns with training data
example_genes_encoded = example_genes_encoded.reindex(
    columns=X_genes_encoded.columns,
    fill_value=0
)

example_final = pd.concat(
    [example_genes_encoded, example_patient[drug_cols]],
    axis=1
)

prediction_encoded = model.predict(example_final)
prediction = label_encoder.inverse_transform(prediction_encoded)

probabilities = model.predict_proba(example_final)
confidence = max(probabilities[0])

print("Predicted Risk:", prediction[0])
print("Confidence:", confidence)
