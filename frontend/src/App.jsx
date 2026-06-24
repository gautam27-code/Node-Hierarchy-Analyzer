import React, { useState } from "react";
import { sendData } from "./api";
import "./App.css";

const defaultPlaceholder = `{
  "data": ["A->B", "A->C", "B->D"]
}`;

export default function App() {
  const [val, setVal] = useState(defaultPlaceholder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!val.trim()) return;

    setLoading(true);
    setError(null);
    setRes(null);

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(val);
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.");
      setLoading(false);
      return;
    }

    if (!parsedPayload || !Array.isArray(parsedPayload.data)) {
      setError("Validation Error: Payload must contain a 'data' array.");
      setLoading(false);
      return;
    }

    try {
      const data = await sendData(parsedPayload);
      setRes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Node Hierarchy Analyzer</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="edges">Paste JSON payload:</label>
          <textarea
            id="edges"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={defaultPlaceholder}
            rows={7}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} id="submit-btn">
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && (
        <div className="error-panel" id="error-state">
          <strong>Error:</strong> {error}
        </div>
      )}

      {res && (
        <div className="response-panel" id="results-section">
          <h2>JSON Output:</h2>
          <pre>{JSON.stringify(res, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
