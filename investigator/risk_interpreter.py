def get_recommendation(risk_level: str):

    recommendations = {
        "LOW": "ALLOW",
        "ELEVATED": "INVESTIGATE",
        "HIGH": "MANUAL_REVIEW"
    }

    return recommendations.get(
        risk_level,
        "INVESTIGATE"
    )


def describe_feature(feature: str, value):

    if feature == "amount_to_customer_avg":
        if value is None:
            return (
                "The customer's historical amount ratio "
                "was unavailable."
            )

        return (
            f"The transaction amount is {float(value):.2f} times "
            f"the customer's historical average."
        )

    descriptions = {
        "transactions_last_5min":
            f"{value} transactions were observed in the recent 5-minute window.",

        "transactions_last_1hour":
            f"{value} transactions were observed in the recent 1-hour window.",

        "amount_last_1hour":
            f"The recent 1-hour transaction volume was {value}.",

        "device_transaction_count_before":
            f"The device had {value} previous transactions.",

        "is_new_device":
            "The transaction originated from a new device."
            if value == 1
            else "The device has been seen previously.",

        "TransactionAmt":
            f"The transaction amount is {value}.",

        "missing_count":
            f"{value} transaction attributes are missing.",

        "has_device_type":
            "Device-type information is available."
            if value == 1
            else "Device-type information is unavailable.",

        "has_device_info":
            "Detailed device information is available."
            if value == 1
            else "Detailed device information is unavailable."
    }

    return descriptions.get(
        feature,
        f"Model feature {feature} contributed to the risk score."
    )

def build_investigation_report(prediction: dict):

    risk_score = prediction["risk_score"]
    risk_level = prediction["risk_level"]

    observations = []

    for factor in prediction["top_risk_factors"]:

        observations.append(
            {
                "feature": factor["feature"],
                "observation": describe_feature(
                    factor["feature"],
                    factor["value"]
                ),
                "impact": factor["impact"]
            }
        )

    return {
        "risk_score": risk_score,
        "risk_percentage": round(
            risk_score * 100,
            2
        ),
        "risk_level": risk_level,
        "recommendation": get_recommendation(
            risk_level
        ),
        "observations": observations
    }