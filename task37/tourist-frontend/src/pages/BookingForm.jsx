import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client';

export default function BookingForm() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [form, setForm] = useState({ travel_date: '', persons: 1 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    client.get(`/packages/${packageId}`)
      .then(({ data }) => setPkg(data))
      .catch(() => setError('Could not load this package. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [packageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/bookings', { package_id: packageId, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    }
  };

  if (loading) return <div className="page"><p className="muted">Loading...</p></div>;
  if (!pkg) return <div className="page"><div className="alert-error">{error || 'Package not found.'}</div></div>;

  const totalCost = pkg.price * form.persons;

  return (
    <div className="page narrow">
      <h1>Book: {pkg.title}</h1>
      <p className="muted">{pkg.destination?.name} · {pkg.duration} days</p>

      {success && <div className="alert-success">Booking submitted! Redirecting...</div>}
      {error && <div className="alert-error">{error}</div>}

      <form className="auth-card" onSubmit={handleSubmit}>
        <label>Travel Date</label>
        <input
          type="date"
          value={form.travel_date}
          onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
          required
        />

        <label>Number of Persons</label>
        <input
          type="number"
          min="1"
          value={form.persons}
          onChange={(e) => setForm({ ...form, persons: Number(e.target.value) })}
          required
        />

        <p className="price">Total: Rs. {totalCost.toLocaleString()}</p>

        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}
