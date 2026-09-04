from fastapi import FastAPI, HTTPException
from investigator.agent import investigate_with_ai
from backend.schemas import TransactionInput
from backend.model_service import predict_transaction
from investigator.risk_interpreter import build_investigation_report
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="RazorGuard API",
    description="AI-powered payment fraud risk detection",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "RazorGuard",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(transaction: TransactionInput):

    try:
        data = transaction.model_dump()

        prediction = predict_transaction(data)

        report = build_investigation_report(
            prediction
        )

        return report

    except Exception as e:

        print("PREDICTION ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/investigate")
def investigate(transaction: TransactionInput):

    try:
        data = transaction.model_dump()

        # Step 1: ML prediction
        prediction = predict_transaction(data)

        # Step 2: deterministic report
        report = build_investigation_report(
            prediction
        )

        # Step 3: AI only when appropriate
        ai_result = investigate_with_ai(
            transaction=data,
            report=report
        )

        return {
            "model": report,
            "investigation": ai_result
        }

    except Exception as e:

        print("INVESTIGATION ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )