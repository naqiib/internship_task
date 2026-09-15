import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUser = (authToken) => {
    fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Session expired");
        return result;
      })
      .then((result) => setUser(result.user))
      .catch((err) => {
        setGeneralError(err.message);
        handleLogout();
      });
  };

  useEffect(() => {
    if (token) fetchUser(token);
  }, [token]);

  const handleLogin = (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setLoading(true);

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const result = await res.json();
        setLoading(false);

        if (!res.ok) {
          if (res.status === 422 && result.errors) {
            setFieldErrors(result.errors);
          } else {
            setGeneralError(result.message || "Login failed");
          }
          return;
        }

        localStorage.setItem("token", result.token);
        setToken(result.token);
      })
      .catch(() => {
        setLoading(false);
        setGeneralError("Network error. Please check your connection.");
      });
  };

  const handleLogout = () => {
    if (token) {
      fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }).catch(() => {});
    }
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  if (token && user) {
    return (
      <div style={{ maxWidth: "500px", margin: "60px auto", fontFamily: "Arial" }}>
        <h1>Protected User Data</h1>
        {generalError && <p style={{ color: "red" }}>{generalError}</p>}
        <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
        <button onClick={handleLogout} style={{ marginTop: "16px", padding: "8px 16px" }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", fontFamily: "Arial" }}>
      <h1>Login</h1>
      {generalError && (
        <p style={{ color: "red", background: "#fee", padding: "8px", borderRadius: "4px" }}>
          {generalError}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
        />
        {fieldErrors.email && (
          <p style={{ color: "red", fontSize: "13px", margin: "0 0 8px" }}>
            {fieldErrors.email[0]}
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
        />
        {fieldErrors.password && (
          <p style={{ color: "red", fontSize: "13px", margin: "0 0 8px" }}>
            {fieldErrors.password[0]}
          </p>
        )}

        <button type="submit" disabled={loading} style={{ padding: "8px 16px", marginTop: "8px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default App;