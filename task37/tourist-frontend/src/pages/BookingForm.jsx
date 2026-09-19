import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';
import { AlertTriangle, CalendarCheck, CreditCard, Loader2, Mail, Phone, Users } from 'lucide-react';

export default function BookingForm() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [form, setForm] = useState({ travel_date: '', persons: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    client.get(`/packages/${packageId}`)
      .then(({ data }) => setPkg(data))
      .catch(() => setError('Could not load this package. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [packageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await client.post('/bookings', { package_id: packageId, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><p className="muted">Loading...</p></div>;
  if (!pkg) return <div className="page"><div className="alert-error"><AlertTriangle size={17} aria-hidden="true" /> {error || 'Package not found.'}</div></div>;

  const totalCost = pkg.price * form.persons;

  return (
    <div className="page narrow">
      <h1>Book: {pkg.title}</h1>
      <p className="muted">{pkg.destination?.name} · {pkg.duration} days</p>

      {success && <div className="alert-success">Booking submitted! Redirecting...</div>}
      {error && <div className="alert-error"><AlertTriangle size={17} aria-hidden="true" /> {error}</div>}

      <form className="auth-card" onSubmit={handleSubmit}>
        <label><CalendarCheck size={16} strokeWidth={1.75} aria-hidden="true" /> Travel Date</label>
        <input
          type="date"
          value={form.travel_date}
          onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
          required
        />

        <label><Users size={16} strokeWidth={1.75} aria-hidden="true" /> Number of Persons</label>
        <input
          type="number"
          min="1"
          value={form.persons}
          onChange={(e) => setForm({ ...form, persons: Number(e.target.value) })}
          required
        />

        <p className="price"><CreditCard size={16} strokeWidth={1.75} aria-hidden="true" /> Total: Rs. {totalCost.toLocaleString()}</p>
        <div className="booking-support"><span><Phone size={14} aria-hidden="true" /> +92 300 1234567</span><span><Mail size={14} aria-hidden="true" /> support@northernplace.pk</span></div>

        <button type="submit" disabled={submitting}>{submitting ? <><Loader2 className="spin" size={17} aria-hidden="true" /> Confirming...</> : 'Confirm Booking'}</button>
      </form>
    </div>
  );
}
