import { useState, useEffect, useCallback } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(() => {
    if (token) {
      fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    }
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  }, [token]);

  const fetchUser = useCallback(
    (authToken) => {
      fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Session expired, please login again");
          return res.json();
        })
        .then((result) => setUser(result.user))
        .catch((err) => {
          setError(err.message);
          handleLogout();
        });
    },
    [handleLogout]
  );

  useEffect(() => {
    if (token) fetchUser(token);
  }, [token, fetchUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (!result.success) {
          setError(result.message || "Login failed");
          return;
        }
        localStorage.setItem("token", result.token);
        setToken(result.token);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  if (token && user) {
    return (
      <div className="app-shell authenticated-shell">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{user.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div>
              <p className="eyebrow">Account overview</p>
              <h1>Welcome back</h1>
            </div>
          </div>

          <div className="user-details">
            <div className="detail-row">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="detail-row">
              <span>User ID</span>
              <strong>#{user.id}</strong>
            </div>
          </div>

          <button type="button" className="primary-button logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="auth-card">
        <div className="brand-panel">
          <div className="brand-mark">A</div>
          <p className="eyebrow">Secure portal</p>
          <h1>Access your account</h1>
          <p className="brand-copy">
            Manage your profile and stay connected with a streamlined login experience.
          </p>
        </div>

        <div className="form-panel">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin} className="auth-form">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;