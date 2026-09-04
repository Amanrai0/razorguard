import json
from openai import OpenAI

client = OpenAI()


def build_verified_evidence(transaction: dict, report: dict):
    """
    Convert transaction fields into factual statements.
    The LLM receives these statements instead of interpreting raw fields.
    """

    evidence = []

    # Amount anomaly
    amount_ratio = transaction.get("amount_to_customer_avg")

    if amount_ratio is not None:
        evidence.append(
            f"The transaction amount is {amount_ratio:.2f} times "
            f"the customer's historical average."
        )

    # 5-minute velocity
    tx_5min = transaction.get("transactions_last_5min")

    if tx_5min is not None:
        evidence.append(
            f"{tx_5min} transactions were observed in the "
            f"recent 5-minute window."
        )

    # 1-hour velocity
    tx_1hour = transaction.get("transactions_last_1hour")

    if tx_1hour is not None:
        evidence.append(
            f"{tx_1hour} transactions were observed in the "
            f"recent 1-hour window."
        )

    # Aggregate transaction amount during previous hour
    amount_1hour = transaction.get("amount_last_1hour")

    if amount_1hour is not None:
        evidence.append(
            f"The aggregate transaction amount observed in the "
            f"recent 1-hour window was {amount_1hour}."
    )

    # Device history
    device_count = transaction.get(
        "device_transaction_count_before"
    )

    if device_count is not None:
        evidence.append(
            f"The device had {device_count} previous transactions."
        )

    # New device
    is_new_device = transaction.get("is_new_device")

    if is_new_device == 1:
        evidence.append(
            "The transaction originated from a device marked as new."
        )
    elif is_new_device == 0:
        evidence.append(
            "The device has been observed previously."
        )

    # Transaction hour
    hour = transaction.get("transaction_hour")

    if hour is not None:
        evidence.append(
            f"The transaction occurred during hour {hour} "
            f"of the day."
        )

    # Missing data
    missing = transaction.get("missing_count")

    if missing is not None:
        evidence.append(
            f"{missing} transaction attributes are missing."
        )

    return evidence


def investigate_with_ai(transaction: dict, report: dict):

    # Don't spend API tokens on LOW-risk transactions
    if report["risk_level"] == "LOW":
        return {
            "ai_used": False,
            "summary":
                "The transaction is low risk based on the "
                "current fraud model and risk policy.",
            "suspicious_signals": [],
            "mitigating_signals": [],
            "recommended_action": "ALLOW"
        }

    verified_evidence = build_verified_evidence(
        transaction,
        report
    )

    # Keep anonymized model features separate.
    model_evidence = []

    for observation in report["observations"]:
        model_evidence.append({
            "feature": observation["feature"],
            "impact": observation["impact"]
        })

    evidence = {
        "risk_score": report["risk_score"],
        "risk_percentage": report["risk_percentage"],
        "risk_level": report["risk_level"],
        "model_recommendation": report["recommendation"],
        "verified_behavioral_evidence": verified_evidence,
        "model_feature_evidence": model_evidence
    }

    prompt = f"""
You are RazorGuard's payment-risk investigation assistant.

Analyze ONLY the evidence provided below.

STRICT RULES:

1. Do not claim fraud definitely occurred.

2. Do not invent meanings for anonymized model features
   such as C1, C4, D2, M5, etc.

3. Model feature contributions indicate influence on the
   model prediction. They are not proof of fraud.

4. Treat verified_behavioral_evidence as factual statements.

5. Do not reinterpret, recalculate, or modify those statements.

6. Do not invent customer history or transaction information.

7. The recommended action must be exactly one of:
   ALLOW
   INVESTIGATE
   MANUAL_REVIEW

8. The recommended action should normally follow the
   supplied model recommendation unless the evidence is
   insufficient.

9. risk_score is a probability between 0 and 1.
   risk_percentage is the corresponding percentage between 0 and 100.
   Never interchange these values.

10. Do not characterize transaction timing as unusual, suspicious,
   late-night, or off-hours unless historical customer timing
   evidence explicitly supports that conclusion.

Evidence:

{json.dumps(evidence, indent=2)}

Return ONLY valid JSON using this exact structure:

{{
    "summary": "short investigation summary",
    "suspicious_signals": [
        "signal 1",
        "signal 2"
    ],
    "mitigating_signals": [
        "signal 1"
    ],
    "recommended_action": "ALLOW | INVESTIGATE | MANUAL_REVIEW"
}}
"""

    response = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    raw_output = response.output_text.strip()

    # Remove markdown fences if the model happens to add them
    if raw_output.startswith("```json"):
        raw_output = raw_output[7:]

    if raw_output.startswith("```"):
        raw_output = raw_output[3:]

    if raw_output.endswith("```"):
        raw_output = raw_output[:-3]

    try:
        result = json.loads(raw_output.strip())

    except json.JSONDecodeError:

        return {
            "ai_used": True,
            "summary":
                "AI investigation was generated but could not "
                "be parsed into structured output.",
            "suspicious_signals": [],
            "mitigating_signals": [],
            "recommended_action":
                report["recommendation"],
            "raw_analysis": response.output_text
        }

    return {
        "ai_used": True,
        **result
    }