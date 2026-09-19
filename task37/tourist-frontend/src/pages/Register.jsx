import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import northernPlaceLogo from '../assets/northern-place-logo.jpg';

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
      <form className="auth-card auth-register-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <img src={northernPlaceLogo} alt="Northern Place" className="auth-logo" />
          <span>Northern Place</span>
        </div>
        <h1>Create your account</h1>
        <p className="auth-intro">Start planning your next mountain escape.</p>

        {errors.general && <div className="alert-error">{errors.general[0]}</div>}

        <label className="auth-field"><span>Full name</span><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        {errors.name && <span className="field-error">{errors.name[0]}</span>}

        <label className="auth-field"><span>Email address</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
        {errors.email && <span className="field-error">{errors.email[0]}</span>}

        <label className="auth-field"><span>I am a</span><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="tourist">Tourist</option>
          <option value="guide">Guide</option>
        </select></label>

        <label className="auth-field"><span>Password</span><span className="password-input"><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
        {errors.password && <span className="field-error">{errors.password[0]}</span>}

        <label className="auth-field"><span>Confirm password</span><span className="password-input"><input type={showConfirmation ? 'text' : 'password'} value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required /><button type="button" onClick={() => setShowConfirmation(!showConfirmation)} aria-label={showConfirmation ? 'Hide password' : 'Show password'}>{showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>

        <label className="auth-consent"><input type="checkbox" required /> <span>I agree to the Northern Place terms and privacy policy.</span></label>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-switch muted small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
