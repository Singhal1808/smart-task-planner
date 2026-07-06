import { useState } from "react";
import "../styles/LoginModal.css";

function LoginModal({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", data.email);
      onLoginSuccess(data.email);
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h1>Smart Task Planner</h1>
          <p>Login to manage your tasks</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="demo-hint-button"
          onClick={() => setShowDemoHint(!showDemoHint)}
        >
          💡 Need demo credentials?
        </button>

        {showDemoHint && (
          <div className="demo-credentials">
            <p><strong>Demo Accounts:</strong></p>
            <p>📧 demo@example.com</p>
            <p>🔑 demo123</p>
            <hr />
            <p>📧 user@example.com</p>
            <p>🔑 password123</p>
          </div>
        )}

        <p className="login-info">
          This is a mock authentication system for demo purposes.
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
