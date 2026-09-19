import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const destination = user.role === 'admin' ? '/admin' : user.role === 'guide' ? '/guide' : '/destinations';
      navigate(destination);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split-card">
        <form className="auth-form-panel" onSubmit={handleSubmit}>
          <Link to="/" className="auth-back-home">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Home
          </Link>
          <h1>Login</h1>

          {error && <div className="alert-error">{error}</div>}

          <label className="auth-underline-field">
            <span className="auth-underline-label">Email address</span>
            <div className="auth-underline-input">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Mail size={18} aria-hidden="true" />
            </div>
          </label>

          <label className="auth-underline-field">
            <span className="auth-underline-label">Password</span>
            <div className="auth-underline-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" className="auth-pill-submit" disabled={loading}>
            {loading ? 'Logging in...' : <><LogIn size={17} aria-hidden="true" /> Log In</>}
          </button>

          <p className="auth-switch-dark">
            No account? <Link to="/register">Sign up</Link>
          </p>
        </form>

        <div className="auth-welcome-panel">
          <h2>WELCOME<br />BACK!</h2>
          <p>Log in to keep planning your next mountain escape with Northern Place.</p>
        </div>
      </div>
    </div>
  );
}