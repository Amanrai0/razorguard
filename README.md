# RazorGuard

**AI-Powered Real-Time Fraud Detection & Risk Investigation System**

RazorGuard is an intelligent transaction fraud detection platform built to identify suspicious financial transactions in real time, explain the factors contributing to their risk, and provide investigators with a workflow for reviewing and responding to potentially fraudulent activity.

The project was developed for the **Razorpay Buildathon**.

---

## Overview

Traditional fraud detection systems often provide only a binary decision — fraud or not fraud.

RazorGuard goes further by combining **machine learning-based risk scoring**, **risk explanations**, and an **investigation dashboard**.

For every transaction, RazorGuard can:

* Generate a fraud risk score
* Classify transactions by risk level
* Recommend an appropriate action
* Highlight important risk factors
* Send suspicious transactions for investigation
* Allow investigators to approve or block transactions
* Maintain transaction and investigation history

---

## Features

### Real-Time Fraud Analysis

Transactions are processed through a trained machine learning model that generates a fraud probability.

Example:

```json id="w2t0xu"
{
  "risk_score": 0.0797,
  "risk_percentage": 7.97,
  "risk_level": "LOW",
  "recommendation": "ALLOW"
}
```

### Risk Classification

Transactions are categorized into:

```text id="f2s7i5"
LOW
ELEVATED
HIGH
```

This allows the system to prioritize suspicious transactions for investigation.

### Explainable Risk Factors

Instead of returning only a fraud probability, RazorGuard provides observations about the features that influenced the model's decision.

Example:

```json id="vhncl8"
{
  "feature": "transactions_last_5min",
  "observation": "Recent transaction activity contributed to the risk score.",
  "impact": 0.62
}
```

This helps investigators understand **why a transaction was considered suspicious**.

### Investigation Workflow

Elevated and high-risk transactions can be reviewed through the investigation interface.

Investigators can:

* Review transaction details
* Examine risk factors
* Inspect the model's risk score
* Allow legitimate transactions
* Block suspicious transactions
* Track pending investigations

### Transaction History

RazorGuard maintains a transaction history containing:

* Transaction amount
* Risk score
* Risk level
* Investigation status
* Investigator decision

---

## Architecture

```text id="51g91b"
Transaction
     |
     v
FastAPI Backend
     |
     v
Fraud Detection Model
     |
     v
Risk Scoring & Explanation
     |
     v
RazorGuard Dashboard
     |
     +-- Risk Analysis
     +-- Transactions
     +-- Investigation
     +-- Review
```

---

## Machine Learning

The fraud detection model was trained using transaction data based on the **IEEE-CIS Fraud Detection** dataset.

The model uses transaction, card, device, behavioral, and engineered features to estimate the probability that a transaction is fraudulent.

### Model

**XGBoost Classifier**

### Model Performance

| Metric             |      Score |
| ------------------ | ---------: |
| ROC-AUC            | **0.9190** |
| PR-AUC             | **0.5892** |
| Precision          | **0.6831** |
| Recall             | **0.4868** |
| F1 Score           | **0.5685** |
| Selected Threshold | **0.2334** |

PR-AUC is particularly useful for fraud detection because fraudulent transactions represent a relatively small proportion of the overall dataset.

---

## Example Model Features

RazorGuard uses features including:

```text id="8n4gf9"
Transaction amount
Product information
Card information
Device information
Transaction frequency
Recent transaction amount
Transaction day
Missing-value patterns
Historical transaction attributes
```

Engineered features include:

```text id="0duqlf"
transactions_last_5min
amount_last_1hour
amount_log
transaction_day
missing_count
has_device_type
```

---

## Tech Stack

### Machine Learning

* Python
* XGBoost
* Scikit-learn
* Pandas
* NumPy

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* React
* JavaScript
* HTML
* CSS

### Development

* Git
* GitHub
* Google Colab
* VS Code

---

## Project Structure

```text id="dj2rlp"
razorguard/
|
|-- backend/
|   |-- main.py
|   `-- ...
|
|-- frontend/
|   `-- ...
|
|-- models/
|   |-- fraud detection model
|   |-- encoders
|   `-- model artifacts
|
|-- investigator/
|   `-- ...
|
|-- .gitignore
|-- requirements.txt
`-- README.md
```

---

## Local Setup

### 1. Clone the Repository

```bash id="gtr4d3"
git clone <your-repository-url>
cd razorguard
```

### 2. Create a Virtual Environment

```bash id="hr5q4f"
python -m venv .venv
```

Windows:

```bash id="qx7g6o"
.venv\Scripts\activate
```

macOS/Linux:

```bash id="k7ol4t"
source .venv/bin/activate
```

### 3. Install Dependencies

```bash id="czmnd7"
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root if the application requires API keys or other secrets.

```env id="2qpyzo"
OPENAI_API_KEY=your_api_key_here
```

Never commit `.env` or API keys to GitHub.

### 5. Start the Backend

```bash id="8q6v5w"
python -m uvicorn backend.main:app --reload
```

FastAPI's interactive API documentation is available through the `/docs` endpoint of the running backend.

### 6. Start the Frontend

Navigate to the frontend directory:

```bash id="yp9dvu"
cd frontend
```

Install dependencies:

```bash id="n9z3mq"
npm install
```

Start the development server:

```bash id="3z4mbh"
npm run dev
```

---

## Fraud Detection Flow

```text id="egr2z7"
Transaction
     |
     v
Feature Processing
     |
     v
XGBoost Fraud Model
     |
     v
Fraud Probability
     |
     v
Risk Classification
     |
     +-- LOW --------> Allow
     |
     +-- ELEVATED ---> Investigate
     |
     `-- HIGH -------> Review / Block
                          |
                          v
                 Investigator Decision
```

---

## Security

Sensitive information such as API keys and environment variables should never be stored directly in the repository.

The following files and directories are excluded using `.gitignore`:

```text id="tm2h41"
.env
.venv/
node_modules/
__pycache__/
datasets/
```

Production secrets should be configured using environment variables provided by the deployment platform.

---

## Future Improvements

Potential improvements include:

* Real-time transaction streaming
* Persistent database integration
* Investigator authentication and role-based access
* Advanced explainable-AI visualizations
* Merchant-specific fraud thresholds
* Device fingerprinting
* Fraud pattern clustering
* Model monitoring and drift detection
* Automated retraining pipelines
* Case management and investigator audit logs
* Webhook integration for payment systems

---

## Disclaimer

RazorGuard is a prototype fraud detection and investigation system developed for demonstration and hackathon purposes.

It should not be used as the sole decision-making system for real financial transactions without additional validation, security controls, compliance review, and production-grade monitoring.

---

## Author

**Aman Rai**

RazorGuard — AI-powered fraud detection and investigation.
