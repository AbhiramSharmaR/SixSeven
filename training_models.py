import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

df = pd.read_excel("pgx_training_dataset.xlsx")

#print(df.head())

X = df[["Gene", "Phenotype", "Drug"]]
y = df["Risk_Label"]

X_encoded = pd.get_dummies(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)


new_patient = pd.DataFrame([{
    "Gene": "CYP2C19",
    "Phenotype": "NM",
    "Drug": "CLOPIDOGREL"
}])

new_encoded = pd.get_dummies(new_patient)
new_encoded = new_encoded.reindex(columns=X_encoded.columns, fill_value=0)

prediction = model.predict(new_encoded)
probabilities = model.predict_proba(new_encoded)

print("Predicted Risk:", prediction[0])
print("Confidence:", max(probabilities[0]))