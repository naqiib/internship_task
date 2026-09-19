import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'tourist',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate(form.role === 'guide' ? '/guide' : '/destinations');
    } catch (err) {
      setErrors(err.response?.data?.errors || {
        general: [err.response ? 'Registration failed. Please check your details.' : 'Cannot reach the server. Please check the API connection.']
      });
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

          <h1>Sign Up</h1>

          {errors.general && <div className="alert-error">{errors.general[0]}</div>}

          <label className="auth-underline-field">
            <span className="auth-underline-label">Full name</span>
            <div className="auth-underline-input">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <User size={18} aria-hidden="true" />
            </div>
          </label>
          {errors.name && <span className="auth-field-error">{errors.name[0]}</span>}

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
          {errors.email && <span className="auth-field-error">{errors.email[0]}</span>}

          <label className="auth-underline-field">
            <span className="auth-underline-label">I am a</span>
            <div className="auth-underline-input">
              <select
                className="auth-select-dark"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="tourist">Tourist</option>
                <option value="guide">Guide</option>
              </select>
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
          {errors.password && <span className="auth-field-error">{errors.password[0]}</span>}

          <label className="auth-underline-field">
            <span className="auth-underline-label">Confirm password</span>
            <div className="auth-underline-input">
              <input
                type={showConfirmation ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                required
              />
              <button
                type="button"
                className="auth-eye-toggle"
                onClick={() => setShowConfirmation(!showConfirmation)}
                aria-label={showConfirmation ? 'Hide password' : 'Show password'}
              >
                {showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="auth-consent-dark">
            <input type="checkbox" required />
            <span>I agree to the Northern Place terms and privacy policy.</span>
          </label>

          <button type="submit" className="auth-pill-submit" disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={17} aria-hidden="true" /> Sign Up</>}
          </button>

          <p className="auth-switch-dark">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>

        <div className="auth-welcome-panel">
          <h2>JOIN THE<br />JOURNEY!</h2>
          <p>Create your account and start exploring the northern trails.</p>
        </div>
      </div>
    </div>
  );
}