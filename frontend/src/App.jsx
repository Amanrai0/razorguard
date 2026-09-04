import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [transaction, setTransaction] = useState({
    TransactionAmt: "",
    amount_to_customer_avg: "",
    transactions_last_5min: "",
    transactions_last_1hour: "",
    amount_last_1hour: "",
    device_transaction_count_before: "",
    is_new_device: "0",
    transaction_hour: "",
    missing_count: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionHistory, setTransactionHistory] = useState(() => {
  const savedHistory = localStorage.getItem(
    "razorguard_transaction_history"
  );
  return savedHistory ? JSON.parse(savedHistory) : [];
});
const [backendOnline, setBackendOnline] = useState(false);
  const [activeView, setActiveView] = useState("analyze");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  useEffect(() => {
  localStorage.setItem(
    "razorguard_transaction_history",
    JSON.stringify(transactionHistory)
  );
}, [transactionHistory]);

useEffect(() => {
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/health"
      );

      if (response.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  checkBackendHealth();

  const interval = setInterval(checkBackendHealth, 10000);

  return () => clearInterval(interval);
}, []);

  const loadLowRiskDemo = () => {
  setTransaction({
    TransactionAmt: "1200",
    amount_to_customer_avg: "0.9",
    transactions_last_5min: "1",
    transactions_last_1hour: "2",
    amount_last_1hour: "2400",
    device_transaction_count_before: "18",
    is_new_device: "0",
    transaction_hour: "14",
    missing_count: "2",
  });

  setResult(null);
  setError("");
};

const loadElevatedRiskDemo = () => {
  setTransaction({
    TransactionAmt: "18000",
    amount_to_customer_avg: "5",
    transactions_last_5min: "4",
    transactions_last_1hour: "7",
    amount_last_1hour: "38000",
    device_transaction_count_before: "2",
    is_new_device: "1",
    transaction_hour: "20",
    missing_count: "10",

    transaction_day: 120,
    amount_log: 9.8,

    ProductCD: "W",

    card1: 13926,
    card2: 327,
    card3: 150,
    card4: "visa",
    card5: 226,
    card6: "credit",

    addr1: 315,
    addr2: 87,

    dist1: 50,
    dist2: null,

    DeviceType: "mobile",
    DeviceInfo: "unknown-device",

    has_device_type: 1,
    has_device_info: 1,

    C1: 4,
C2: 3,
C3: 0,
C4: 4,
C5: 0,
C6: 5,
C7: 2,
C8: 3,
C9: 4,
C10: 3,
C11: 5,
C12: 2,
C13: 6,
C14: 5,

    D1: 1,
    D2: 0,
    D3: 0,
    D4: 0,
    D5: 0,
    D6: null,
    D7: null,
    D8: null,
    D9: null,
    D10: 1,
    D11: 0,
    D12: null,
    D13: null,
    D14: null,
    D15: 1,

    M1: "F",
    M2: "F",
    M3: "F",
    M4: "M2",
    M5: "F",
    M6: "F",
    M7: "F",
    M8: "F",
    M9: "F",
  });

  setResult(null);
  setError("");
};

const loadHighRiskDemo = () => {
  setTransaction({
    TransactionAmt: "75000",
    amount_to_customer_avg: "30",
    transactions_last_5min: "15",
    transactions_last_1hour: "28",
    amount_last_1hour: "180000",
    device_transaction_count_before: "0",
    is_new_device: "1",
    transaction_hour: "2",
    missing_count: "25",

    transaction_day: 120,
    amount_log: 11.225,

    ProductCD: "W",

    card1: 13926,
    card2: 327,
    card3: 150,
    card4: "visa",
    card5: 226,
    card6: "credit",

    addr1: 315,
    addr2: 87,

    dist1: 50,
    dist2: null,

    DeviceType: "mobile",
    DeviceInfo: "unknown-device",

    has_device_type: 1,
    has_device_info: 1,

    C1: 10,
    C2: 8,
    C3: 0,
    C4: 5,
    C5: 0,
    C6: 7,
    C7: 3,
    C8: 4,
    C9: 6,
    C10: 4,
    C11: 8,
    C12: 3,
    C13: 9,
    C14: 8,

    D1: 1,
    D2: 0,
    D3: 0,
    D4: 0,
    D5: 0,
    D6: null,
    D7: null,
    D8: null,
    D9: null,
    D10: 1,
    D11: 0,
    D12: null,
    D13: null,
    D14: null,
    D15: 1,

    M1: "F",
    M2: "F",
    M3: "F",
    M4: "M2",
    M5: "F",
    M6: "F",
    M7: "F",
    M8: "F",
    M9: "F",
  });

  setResult(null);
  setError("");
};



  const handleChange = (event) => {
    const { name, value } = event.target;

    setTransaction({
      ...transaction,
      [name]: value,
    });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  setLoading(true);
  setError("");
  setResult(null);

  try {
    const numericFields = new Set([
      "TransactionAmt",
      "amount_to_customer_avg",
      "transactions_last_5min",
      "transactions_last_1hour",
      "amount_last_1hour",
      "device_transaction_count_before",
      "is_new_device",
      "transaction_hour",
      "missing_count",
    ]);

    const payload = {};

    for (const [key, value] of Object.entries(transaction)) {
      if (value === "") {
        payload[key] = null;
      } else if (numericFields.has(key)) {
        payload[key] = Number(value);
      } else {
        payload[key] = value;
      }
    }

    const response = await fetch(
      "http://127.0.0.1:8000/investigate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
      );
    }

    setResult(data);
    const historyItem = {
  id: `TXN-${Date.now()}`,
  amount: payload.TransactionAmt,
  riskScore: data.model.risk_percentage,
  riskLevel: data.model.risk_level,
  recommendation: data.model.recommendation,
  status:
    data.model.risk_level === "HIGH"
      ? "Pending Review"
      : data.model.risk_level === "ELEVATED"
      ? "Investigating"
      : "Approved",
      details: data,
};

setTransactionHistory((previous) => [
  historyItem,
  ...previous,
]);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  const totalTransactions = transactionHistory.length;

  const lowCount = transactionHistory.filter(
    (item) => item.riskLevel === "LOW"
  ).length;

  const elevatedCount = transactionHistory.filter(
    (item) => item.riskLevel === "ELEVATED"
  ).length;

  const highCount = transactionHistory.filter(
    (item) => item.riskLevel === "HIGH"
  ).length;

  const pendingReviewCount = transactionHistory.filter(
    (item) =>
      item.status === "Pending Review" ||
      item.status === "Investigating"
  ).length;

  const approvedCount = transactionHistory.filter(
  (item) => item.status === "Approved"
).length;

const blockedCount = transactionHistory.filter(
  (item) => item.status === "Blocked"
).length;

const highRiskRate =
  totalTransactions > 0
    ? ((highCount / totalTransactions) * 100).toFixed(1)
    : "0.0";

const reviewQueue = transactionHistory.filter(
  (item) =>
    item.status === "Pending Review" ||
    item.status === "Investigating"
);


  return (
    <div className="app">
      <header className="navbar">
        <div>
          <h1>RazorGuard</h1>
          <p>AI-Powered Payment Risk Intelligence</p>
        </div>

        <nav className="top-nav">
  <button
    className={activeView === "analyze" ? "nav-active" : ""}
    onClick={() => setActiveView("analyze")}
  >
    Analyze
  </button>

  <button
    className={activeView === "transactions" ? "nav-active" : ""}
    onClick={() => setActiveView("transactions")}
  >
    Transactions
  </button>

  <button
    className={activeView === "operations" ? "nav-active" : ""}
    onClick={() => setActiveView("operations")}
  >
    Risk Operations
  </button>
</nav>
<div
  className={`system-status ${
    backendOnline ? "online" : "offline"
  }`}
>
  <span className="status-dot"></span>

  <span>
    {backendOnline ? "System Online" : "System Offline"}
  </span>
</div>
      </header>

      <main className="dashboard">
        {activeView === "analyze" && (
  <>
        <section className="hero">
          <p className="eyebrow">RISK OPERATIONS</p>

          <h2>
            Detect suspicious payments.
            <br />
            Investigate intelligently.
          </h2>

          <p className="hero-description">
            RazorGuard combines machine learning and AI-assisted
            investigation to identify high-risk transactions and provide
            analysts with actionable evidence.
          </p>
        </section>

        <section className="analysis-card">
          <h3>Transaction Analysis</h3>

          <p>
            Enter transaction signals below to calculate the fraud risk.
          </p>

          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Transaction Amount</label>

                <input
                  type="number"
                  name="TransactionAmt"
                  value={transaction.TransactionAmt}
                  onChange={handleChange}
                  placeholder="75000"
                />
              </div>

              <div className="form-group">
                <label>Amount vs Customer Average</label>

                <input
                  type="number"
                  step="0.01"
                  name="amount_to_customer_avg"
                  value={transaction.amount_to_customer_avg}
                  onChange={handleChange}
                  placeholder="30"
                />
              </div>

              <div className="form-group">
                <label>Transactions - Last 5 min</label>

                <input
                  type="number"
                  name="transactions_last_5min"
                  value={transaction.transactions_last_5min}
                  onChange={handleChange}
                  placeholder="15"
                />
              </div>

              <div className="form-group">
                <label>Transactions - Last 1 hour</label>

                <input
                  type="number"
                  name="transactions_last_1hour"
                  value={transaction.transactions_last_1hour}
                  onChange={handleChange}
                  placeholder="28"
                />
              </div>

              <div className="form-group">
                <label>Amount - Last 1 hour</label>

                <input
                  type="number"
                  name="amount_last_1hour"
                  value={transaction.amount_last_1hour}
                  onChange={handleChange}
                  placeholder="180000"
                />
              </div>

              <div className="form-group">
                <label>Previous Device Transactions</label>

                <input
                  type="number"
                  name="device_transaction_count_before"
                  value={transaction.device_transaction_count_before}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Transaction Hour</label>

                <input
                  type="number"
                  min="0"
                  max="23"
                  name="transaction_hour"
                  value={transaction.transaction_hour}
                  onChange={handleChange}
                  placeholder="2"
                />
              </div>

              <div className="form-group">
                <label>Missing Attributes</label>

                <input
                  type="number"
                  name="missing_count"
                  value={transaction.missing_count}
                  onChange={handleChange}
                  placeholder="25"
                />
              </div>

              <div className="form-group">
                <label>New Device?</label>

                <select
                  name="is_new_device"
                  value={transaction.is_new_device}
                  onChange={handleChange}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
    type="button"
    className="demo-button"
    onClick={loadLowRiskDemo}
  >
    Load Low-Risk Demo
  </button>
  <button
    type="button"
    className="demo-button"
    onClick={loadElevatedRiskDemo}
  >
    Elevated Risk
  </button>
  <button
  type="button"
  className="demo-button"
  onClick={loadHighRiskDemo}
>
  Load High-Risk Demo
</button>

  <button type="submit" disabled={loading}>
    {loading ? "Analyzing..." : "Analyze Transaction"}
  </button>
</div>
          </form>
        </section>
        {error && (
  <section className="error-card">
    <strong>Analysis failed</strong>
    <p>{error}</p>
  </section>
)}


{result && (
  <section className="risk-dashboard">

    <div className="result-header">
      <div>
        <p className="eyebrow">RISK ASSESSMENT</p>
        <h3>Transaction Analysis</h3>
      </div>

      <span
        className={`risk-badge ${result.model.risk_level.toLowerCase()}`}
      >
        {result.model.risk_level}
      </span>
    </div>

    <div className="risk-overview">

      <div className="score-card">
        <p>Risk Score</p>

        <div
          className={`risk-score ${result.model.risk_level.toLowerCase()}`}
        >
          {result.model.risk_percentage}%
        </div>

        <span>Fraud probability</span>
      </div>

      <div className="action-card">
        <p>Recommended Action</p>

        <h3>
          {result.model.recommendation.replaceAll("_", " ")}
        </h3>

        <span>
          Based on model risk assessment and current risk policy.
        </span>
      </div>

    </div>
    <div className="policy-panel">
  <div className="policy-header">
    <div>
      <p className="section-label">RISK POLICY</p>
      <h3>Decision Thresholds</h3>
    </div>

    <span className="policy-caption">
      Operational fraud review policy
    </span>
  </div>

  <div className="policy-grid">
    <div className="policy-item policy-low">
      <span className="policy-level">LOW</span>
      <strong>&lt; 10%</strong>
      <p>ALLOW</p>
    </div>

    <div className="policy-item policy-elevated">
      <span className="policy-level">ELEVATED</span>
      <strong>10% – &lt; 50%</strong>
      <p>INVESTIGATE</p>
    </div>

    <div className="policy-item policy-high">
      <span className="policy-level">HIGH</span>
      <strong>≥ 50%</strong>
      <p>MANUAL REVIEW</p>
    </div>
  </div>
</div>

    <div className="investigation-panel">
      <p className="section-label">AI INVESTIGATION</p>

      <h3>Investigation Summary</h3>

      <p className="investigation-summary">
        {result.investigation.summary}
      </p>
    </div>

    {result.investigation.suspicious_signals?.length > 0 && (
      <div className="signals-panel">
        <p className="section-label">DETECTED SIGNALS</p>

        <h3>Suspicious Signals</h3>

        <div className="signals-list">
          {result.investigation.suspicious_signals.map(
            (signal, index) => (
              <div className="signal-item" key={index}>
                <span className="signal-icon">!</span>
                <p>{signal}</p>
              </div>
            )
          )}
        </div>
      </div>
    )}
    {result.investigation.mitigating_signals?.length > 0 && (
  <div className="mitigating-panel">
    <p className="section-label">MITIGATING SIGNALS</p>
    <h3>Risk-Reducing Evidence</h3>

    <div className="mitigating-list">
      {result.investigation.mitigating_signals.map(
        (signal, index) => (
          <div className="mitigating-item" key={index}>
            <span className="mitigating-icon">✓</span>
            <p>{signal}</p>
          </div>
        )
      )}
    </div>
  </div>
)}
    {result.model.observations?.length > 0 && (
  <div className="evidence-panel">
    <p className="section-label">MODEL EVIDENCE</p>
    <h3>Feature Impact</h3>

    <p className="evidence-description">
      Features that contributed most strongly toward the model's
      risk prediction.
    </p>

    <div className="evidence-list">
      {result.model.observations.map((item, index) => {
        const maxImpact = Math.max(
          ...result.model.observations.map(
            (observation) => Math.abs(observation.impact)
          )
        );

        const width =
          maxImpact > 0
            ? (Math.abs(item.impact) / maxImpact) * 100
            : 0;

        return (
          <div className="evidence-item" key={index}>
            <div className="evidence-info">
              <span className="feature-name">
                {item.feature}
              </span>

              <span className="impact-value">
                {item.impact.toFixed(3)}
              </span>
            </div>

            <div className="impact-track">
              <div
                className="impact-bar"
                style={{ width: `${width}%` }}
              />
            </div>

            <p>{item.observation}</p>
          </div>
        );
      })}
    </div>

    <p className="evidence-note">
      Feature impact represents model influence and does not by
      itself prove fraudulent activity.
    </p>
  </div>
)}

    <div className="decision-panel">
      <div>
        <p className="section-label">FINAL RECOMMENDATION</p>
        <h3>Risk Decision</h3>
      </div>

      <div
        className={`decision-value ${result.model.risk_level.toLowerCase()}`}
      >
        {result.investigation.recommended_action.replaceAll("_", " ")}
      </div>
    </div>
    {result.model.risk_level !== "LOW" && (
  <div className="immediate-review">
    <div>
      <p className="section-label">ANALYST ACTION</p>
      <h3>Transaction requires review</h3>
      <p>
        Review the AI investigation and make a final decision on this
        transaction.
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        const latestTransaction = transactionHistory[0];

        if (latestTransaction) {
          setSelectedTransaction(latestTransaction);
          setActiveView("transactions");
        }
      }}
    >
      Review Transaction
    </button>
  </div>
)}

  </section>
)}

{transactionHistory.length > 0 && (
  <section className="operations-summary">
    <div className="summary-header">
      <div>
        <p className="section-label">RISK OPERATIONS</p>
        <h3>Operations Summary</h3>
      </div>

      <button
        type="button"
        className="clear-history-button"
        onClick={() => {
          setTransactionHistory([]);
          setSelectedTransaction(null);
        }}
      >
        Clear History
      </button>
    </div>

    <div className="summary-grid">
      <div className="summary-card">
        <span>Total Analyzed</span>
        <strong>{totalTransactions}</strong>
      </div>

      <div className="summary-card low-summary">
        <span>Low Risk</span>
        <strong>{lowCount}</strong>
      </div>

      <div className="summary-card elevated-summary">
        <span>Elevated</span>
        <strong>{elevatedCount}</strong>
      </div>

      <div className="summary-card high-summary">
        <span>High Risk</span>
        <strong>{highCount}</strong>
      </div>

      <div className="summary-card pending-summary">
        <span>Needs Attention</span>
        <strong>{pendingReviewCount}</strong>
      </div>
      <div className="summary-card">
  <span>Approved</span>
  <strong>{approvedCount}</strong>
</div>

<div className="summary-card">
  <span>Blocked</span>
  <strong>{blockedCount}</strong>
</div>

<div className="summary-card">
  <span>High-Risk Rate</span>
  <strong>{highRiskRate}%</strong>
</div>
    </div>
    <div className="review-queue">
  <div className="review-queue-header">
    <div>
      <p className="section-label">REVIEW QUEUE</p>
      <h3>Transactions Requiring Attention</h3>
    </div>

    <span>{reviewQueue.length} open</span>
  </div>

  {reviewQueue.length === 0 ? (
    <div className="queue-empty">
      No transactions currently require analyst review.
    </div>
  ) : (
    <div className="table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reviewQueue.map((item) => (
            <tr
              key={item.id}
              className="clickable-row"
              onClick={() => {
                setSelectedTransaction(item);
                setActiveView("transactions");
              }}
            >
              <td className="transaction-id">{item.id}</td>

              <td>
                ₹{Number(item.amount).toLocaleString("en-IN")}
              </td>

              <td>
                <strong>{item.riskScore}%</strong>
              </td>

              <td>
                <span
                  className={`table-risk ${item.riskLevel.toLowerCase()}`}
                >
                  {item.riskLevel}
                </span>
              </td>

              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  </section>
)}
    </>
  )}
  {activeView === "operations" && (
  <>
    {transactionHistory.length === 0 ? (
      <section className="empty-state">
        <p className="section-label">RISK OPERATIONS</p>

        <h2>No risk activity yet</h2>

        <p>
          Analyze transactions first to populate the operations dashboard.
        </p>

        <button
          type="button"
          onClick={() => setActiveView("analyze")}
        >
          Analyze Transaction
        </button>
      </section>
    ) : (
      <section className="operations-summary">
        <div className="summary-header">
          <div>
            <p className="section-label">RISK OPERATIONS</p>
            <h3>Operations Summary</h3>
          </div>

          <button
            type="button"
            className="clear-history-button"
            onClick={() => {
              setTransactionHistory([]);
              setSelectedTransaction(null);
            }}
          >
            Clear History
          </button>
        </div>

        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Analyzed</span>
            <strong>{totalTransactions}</strong>
          </div>

          <div className="summary-card low-summary">
            <span>Low Risk</span>
            <strong>{lowCount}</strong>
          </div>

          <div className="summary-card elevated-summary">
            <span>Elevated</span>
            <strong>{elevatedCount}</strong>
          </div>

          <div className="summary-card high-summary">
            <span>High Risk</span>
            <strong>{highCount}</strong>
          </div>

          <div className="summary-card pending-summary">
            <span>Needs Attention</span>
            <strong>{pendingReviewCount}</strong>
          </div>
        </div>
      </section>
    )}
  </>
)}
  {activeView === "transactions" && (
  <>
  {transactionHistory.length === 0 && (
  <section className="empty-state">
    <p className="section-label">TRANSACTIONS</p>
    <h2>No transactions analyzed yet</h2>

    <p>
      Analyze a transaction and it will appear here for review.
    </p>

    <button
      type="button"
      onClick={() => setActiveView("analyze")}
    >
      Analyze Transaction
    </button>
  </section>
)}
{transactionHistory.length > 0 && (
  <section className="history-panel">
    <div className="history-header">
      <div>
        <p className="section-label">RISK OPERATIONS</p>
        <h3>Transaction History</h3>
      </div>

      <span>
        {transactionHistory.length} transactions analyzed
      </span>
    </div>

    <div className="table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
            <th>Recommendation</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactionHistory.map((item) => (
            <tr
  key={item.id}
  onClick={() => {
    if (item.riskLevel !== "LOW") {
      setSelectedTransaction(item);
    }
  }}
  className={item.riskLevel !== "LOW" ? "clickable-row" : ""}
>
              <td className="transaction-id">
                {item.id}
              </td>

              <td>
                ₹{Number(item.amount).toLocaleString("en-IN")}
              </td>

              <td>
                <strong>{item.riskScore}%</strong>
              </td>

              <td>
                <span
                  className={`table-risk ${item.riskLevel.toLowerCase()}`}
                >
                  {item.riskLevel}
                </span>
              </td>

              <td>
                {item.recommendation.replaceAll("_", " ")}
              </td>

              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}
{selectedTransaction && (
  <section className="review-panel">
    <div className="review-header">
      <div>
        <p className="section-label">ANALYST REVIEW</p>
        <h3>{selectedTransaction.id}</h3>
      </div>

      <button
        type="button"
        className="close-review"
        onClick={() => setSelectedTransaction(null)}
      >
        Close
      </button>
    </div>

    <div className="review-grid">
      <div>
        <span>Amount</span>
        <strong>
          ₹{Number(selectedTransaction.amount).toLocaleString("en-IN")}
        </strong>
      </div>

      <div>
        <span>Risk Score</span>
        <strong>{selectedTransaction.riskScore}%</strong>
      </div>

      <div>
        <span>Risk Level</span>
        <strong>{selectedTransaction.riskLevel}</strong>
      </div>

      <div>
        <span>Model Recommendation</span>
        <strong>
          {selectedTransaction.recommendation.replaceAll("_", " ")}
        </strong>
      </div>
    </div>
    {selectedTransaction.details && (
  <div className="review-investigation">

    <div className="review-investigation-section">
      <p className="section-label">AI INVESTIGATION</p>
      <h3>Investigation Summary</h3>

      <p>
        {selectedTransaction.details.investigation.summary}
      </p>
    </div>

    {selectedTransaction.details.investigation
      .suspicious_signals?.length > 0 && (
      <div className="review-investigation-section">
        <h4>Suspicious Signals</h4>

        <div className="review-signal-list">
          {selectedTransaction.details.investigation
            .suspicious_signals.map((signal, index) => (
            <div className="review-signal" key={index}>
              <span>!</span>
              <p>{signal}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {selectedTransaction.details.investigation
      .mitigating_signals?.length > 0 && (
      <div className="review-investigation-section">
        <h4>Mitigating Signals</h4>

        <div className="review-signal-list">
          {selectedTransaction.details.investigation
            .mitigating_signals.map((signal, index) => (
            <div className="review-signal mitigating" key={index}>
              <span>✓</span>
              <p>{signal}</p>
            </div>
          ))}
        </div>
      </div>
    )}

  </div>
)}
    <div className="review-actions">
      <button
        type="button"
        className="approve-action"
        onClick={() => {
          setTransactionHistory((previous) =>
            previous.map((item) =>
              item.id === selectedTransaction.id
                ? { ...item, status: "Approved" }
                : item
            )
          );

          setSelectedTransaction({
            ...selectedTransaction,
            status: "Approved",
          });
        }}
      >
        Approve
      </button>

      <button
        type="button"
        className="block-action"
        onClick={() => {
          setTransactionHistory((previous) =>
            previous.map((item) =>
              item.id === selectedTransaction.id
                ? { ...item, status: "Blocked" }
                : item
            )
          );

          setSelectedTransaction({
            ...selectedTransaction,
            status: "Blocked",
          });
        }}
      >
        Block Transaction
      </button>
    </div>

    <p className="review-status">
      Analyst Status:{" "}
      <strong>{selectedTransaction.status}</strong>
    </p>
  </section>
)}
  </>
)}
      </main>
    </div>
  );
}

export default App;