from pathlib import Path
import json
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb

from xgboost import XGBClassifier


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# -----------------------------
# Load model artifacts
# -----------------------------

model = XGBClassifier()
model.load_model(MODEL_DIR / "fraud_model.json")

encoder = joblib.load(
    MODEL_DIR / "encoder.pkl"
)

with open(MODEL_DIR / "features.json") as f:
    FEATURES = json.load(f)

with open(MODEL_DIR / "categorical_features.json") as f:
    CATEGORICAL_FEATURES = json.load(f)

with open(MODEL_DIR / "thresholds.json") as f:
    THRESHOLDS = json.load(f)


# -----------------------------
# SHAP explainer
# -----------------------------



# -----------------------------
# Risk policy
# -----------------------------

def get_risk_level(score: float):

    if score < THRESHOLDS["low_risk_max"]:
        return "LOW"

    elif score < THRESHOLDS["high_risk_min"]:
        return "ELEVATED"

    return "HIGH"


# -----------------------------
# Preprocessing
# -----------------------------

def preprocess_transaction(data: dict):

    df = pd.DataFrame([data])

    # Add missing model features
    for feature in FEATURES:
        if feature not in df.columns:
            df[feature] = np.nan

    # Exact feature order
    df = df[FEATURES]

    # -----------------------------
    # Categorical features
    # -----------------------------
    for col in CATEGORICAL_FEATURES:
        df[col] = (
            df[col]
            .fillna("MISSING")
            .astype(str)
        )

    df[CATEGORICAL_FEATURES] = encoder.transform(
        df[CATEGORICAL_FEATURES]
    )

    # -----------------------------
    # Numerical features
    # -----------------------------
    numeric_features = [
        col for col in FEATURES
        if col not in CATEGORICAL_FEATURES
    ]

    for col in numeric_features:
        df[col] = pd.to_numeric(
            df[col],
            errors="coerce"
        )

    # Replace infinity with NaN
    df = df.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # Force numeric dtype for XGBoost
    df[numeric_features] = df[numeric_features].astype(
        "float32"
    )

    return df


# -----------------------------
# SHAP explanation
# -----------------------------

def explain_prediction(X, top_n=5):

    booster = model.get_booster()

    dmatrix = xgb.DMatrix(
        X,
        feature_names=FEATURES
    )

    contributions = booster.predict(
        dmatrix,
        pred_contribs=True
    )[0]

    # Last value is the bias/base contribution
    feature_contributions = contributions[:-1]

    explanation = pd.DataFrame({
        "feature": FEATURES,
        "value": X.iloc[0].values,
        "shap_value": feature_contributions
    })

    explanation["abs_shap"] = (
        explanation["shap_value"].abs()
    )

    explanation = explanation.sort_values(
        "abs_shap",
        ascending=False
    )

    risk_factors = []

    for _, row in explanation.iterrows():

        # Positive contribution pushes toward fraud
        if row["shap_value"] > 0:

            value = row["value"]

            if pd.isna(value):
                value = None
            elif isinstance(value, np.generic):
                value = value.item()

            risk_factors.append({
                "feature": row["feature"],
                "value": value,
                "impact": float(row["shap_value"])
            })

        if len(risk_factors) >= top_n:
            break

    return risk_factors


# -----------------------------
# Prediction
# -----------------------------

def predict_transaction(data: dict):

    X = preprocess_transaction(data)

    risk_score = float(
        model.predict_proba(X)[0, 1]
    )

    risk_factors = explain_prediction(
        X,
        top_n=5
    )

    return {
        "risk_score": round(risk_score, 4),
        "risk_level": get_risk_level(risk_score),
        "top_risk_factors": risk_factors
    }