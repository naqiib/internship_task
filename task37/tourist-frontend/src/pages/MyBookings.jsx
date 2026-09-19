import { useEffect, useState } from 'react';
import client from '../api/client';
import { Ban, CalendarDays, CheckCircle2, Clock, Map, MapPin, Ticket, Users, Wallet, XCircle } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeItinerary, setActiveItinerary] = useState(null);

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

  const viewItinerary = async (bookingId) => {
    try {
      const { data } = await client.get(`/bookings/${bookingId}/itinerary`);
      setActiveItinerary({ bookingId, items: data });
    } catch {
      alert('Could not load itinerary.');
    }
  };

  return (
    <div className="page">
      <h1 className="title-with-icon"><Ticket size={28} strokeWidth={1.75} aria-hidden="true" /> My Bookings</h1>
      <p className="muted">Track your upcoming tours and travel itineraries</p>

      {loading && <p className="muted">Loading your bookings...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <p className="muted">You have no active tour bookings.</p>
        </div>
      )}

      <div className="booking-list">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card card">
            <div className="booking-main">
              <div>
                <h3>{b.package?.title || `Booking #${b.id}`}</h3>
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
                <span className={`status-badge status-${b.status}`}>
                  {b.status === 'pending' && <Clock size={14} aria-hidden="true" />}
                  {b.status === 'confirmed' && <CheckCircle2 size={14} aria-hidden="true" />}
                  {(b.status === 'cancelled' || b.status === 'rejected') && <XCircle size={14} aria-hidden="true" />}
                  {b.status.toUpperCase()}
                </span>

                <div className="booking-actions">
                  <button className="btn-secondary small" onClick={() => viewItinerary(b.id)}>
                    <Map size={15} aria-hidden="true" /> Itinerary
                  </button>
                  {b.status === 'pending' && (
                    <button className="btn-danger small" onClick={() => handleCancel(b.id)}>
                      <Ban size={15} aria-hidden="true" /> Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ITINERARY MODAL */}
      {activeItinerary && (
        <div className="modal-backdrop" onClick={() => setActiveItinerary(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="title-with-icon"><Map size={19} aria-hidden="true" /> Tour Itinerary (Booking #{activeItinerary.bookingId})</h3>
            {activeItinerary.items.length === 0 ? (
              <p className="muted">No detailed daily itinerary added yet for this tour.</p>
            ) : (
              <ul className="itinerary-list">
                {activeItinerary.items.map((item) => (
                  <li key={item.id} className="itinerary-item">
                    <strong>Day {item.day_number}: {item.title}</strong>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setActiveItinerary(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
