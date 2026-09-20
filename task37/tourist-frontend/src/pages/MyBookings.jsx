import { useEffect, useState } from 'react';
import client from '../api/client';
import { Ban, CalendarDays, CheckCircle2, Clock, MapPin, Ticket, Users, Wallet, XCircle } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = () => {
    setLoading(true);
    client.get('/bookings')
      .then(({ data }) => setBookings(data.data || data))
      .catch(() => setError('Could not load your bookings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await client.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      loadBookings();
    } catch {
      alert('Could not cancel booking.');
    }
  };

  return (
    <div className="page booking-page">
      <div className="booking-page-header">
        <div>
          <h1 className="title-with-icon"><Ticket size={28} strokeWidth={1.75} aria-hidden="true" /> My Bookings</h1>
          <p className="muted">Track your upcoming trips and reservation details</p>
        </div>
      </div>

      {loading && <p className="muted">Loading your bookings...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <p className="muted">You have no active tour bookings.</p>
        </div>
      )}

      <div className="booking-list">
        {bookings.map((b) => (
          <article key={b.id} className="booking-card card">
            <div className="booking-main">
              <div className="booking-card-body">
                <div className="booking-header-row">
                  <div>
                    <span className="booking-label">Tour reservation</span>
                    <h3>{b.package?.title || `Booking #${b.id}`}</h3>
                  </div>

                  <span className={`status-badge status-${b.status}`}>
                    {b.status === 'pending' && <Clock size={14} aria-hidden="true" />}
                    {b.status === 'confirmed' && <CheckCircle2 size={14} aria-hidden="true" />}
                    {(b.status === 'cancelled' || b.status === 'rejected') && <XCircle size={14} aria-hidden="true" />}
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <p className="muted inline-icon"><MapPin size={15} aria-hidden="true" /> {b.package?.destination?.name || 'Destination'}</p>

                <div className="meta-row">
                  <span className="inline-icon"><CalendarDays size={15} aria-hidden="true" /> Travel Date: <strong>{b.travel_date}</strong></span>
                  <span className="inline-icon"><Users size={15} aria-hidden="true" /> Persons: <strong>{b.persons}</strong></span>
                  <span className="inline-icon"><Wallet size={15} aria-hidden="true" /> Total: <strong>Rs. {Number(b.total_cost).toLocaleString()}</strong></span>
                </div>

                {b.guide?.user && (
                  <p className="guide-info inline-icon"><Users size={15} aria-hidden="true" /> Assigned Guide: <strong>{b.guide.user.name}</strong></p>
                )}
              </div>

              <div className="booking-side">
                <div className="booking-pricing">
                  <span>Amount paid</span>
                  <strong>Rs. {Number(b.total_cost || 0).toLocaleString()}</strong>
                </div>

                <div className="booking-actions">
                  {b.status === 'pending' && (
                    <button className="btn-danger small" onClick={() => handleCancel(b.id)}>
                      <Ban size={15} aria-hidden="true" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
