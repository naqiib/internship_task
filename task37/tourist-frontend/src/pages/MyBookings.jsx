import { useEffect, useState } from 'react';
import client from '../api/client';

const STATUS_COLORS = {
  pending: '#f0ad4e',
  confirmed: '#5cb85c',
  rejected: '#d9534f',
  completed: '#5bc0de',
  cancelled: '#999',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/bookings')
      .then(({ data }) => setBookings(data.data || data))
      .catch(() => setError('Could not load your bookings. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {loading && <p className="muted">Loading bookings...</p>}
      {error && <div className="alert-error">{error}</div>}
      {!loading && bookings.length === 0 && <p className="muted">No bookings yet.</p>}

      <div className="booking-list">
        {bookings.map((b) => (
          <div key={b.id} className="booking-item">
            <div>
              <h3>{b.package?.title}</h3>
              <p className="muted">{b.package?.destination?.name}</p>
              <p>Travel date: {b.travel_date} · {b.persons} person(s)</p>
              <p className="price">Rs. {Number(b.total_cost).toLocaleString()}</p>
              {b.guide?.user && <p className="muted">Guide: {b.guide.user.name}</p>}
            </div>
            <span
              className="status-badge"
              style={{ backgroundColor: STATUS_COLORS[b.status] || '#999' }}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
