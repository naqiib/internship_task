import { useEffect, useState } from 'react';
import client from '../api/client';
import { CalendarDays, CheckCircle2, Clock, MapPin, Route, Users, Wallet } from 'lucide-react';

export default function GuideDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/bookings')
      .then(({ data }) => setBookings(data.data || data))
      .catch(() => setError('Could not load your assigned tours.'))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'pending');
  const touristCount = bookings.reduce((total, booking) => total + Number(booking.persons || 0), 0);
  const confirmedCount = bookings.filter((booking) => booking.status === 'confirmed').length;

  return (
    <div className="page guide-dashboard">
      <div className="guide-welcome">
        <div><span className="section-kicker">Guide workspace</span><h1>Your tours, clearly planned.</h1><p className="muted">Keep track of assigned tourists, travel dates, and the details that make every trip smooth.</p></div>
        <div className="guide-status"><CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" /> Available for tours</div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      <div className="guide-stats">
        <div className="guide-stat"><span className="guide-stat-icon"><Users size={19} /></span><strong>{touristCount}</strong><span>Assigned tourists</span></div>
        <div className="guide-stat"><span className="guide-stat-icon"><CalendarDays size={19} /></span><strong>{upcoming.length}</strong><span>Upcoming tours</span></div>
        <div className="guide-stat"><span className="guide-stat-icon"><CheckCircle2 size={19} /></span><strong>{confirmedCount}</strong><span>Confirmed tours</span></div>
      </div>

      <div className="guide-section-heading"><div><span className="section-kicker"><Route size={15} aria-hidden="true" /> Your schedule</span><h2>Assigned tours</h2></div><span className="packages-count"><Clock size={14} aria-hidden="true" /> {bookings.length} total bookings</span></div>
      {loading && <p className="muted">Loading your guide schedule...</p>}
      {!loading && !error && bookings.length === 0 && <div className="empty-state guide-empty"><Users size={28} /><h3>No tours assigned yet</h3><p className="muted">When an admin assigns a booking to you, the tourist and travel details will appear here.</p></div>}
      <div className="guide-booking-list">
        {bookings.map((booking) => (
          <article className="guide-booking-card" key={booking.id}>
            <div className="guide-booking-main"><div className="guide-booking-icon"><MapPin size={22} /></div><div><span className="guide-booking-id">BOOKING #{booking.id}</span><h3>{booking.package?.title || 'Tour package'}</h3><p className="muted inline-icon"><MapPin size={14} /> {booking.package?.destination?.name || 'Northern Pakistan'}</p></div></div>
            <div className="guide-booking-details"><div><span>Tourist</span><strong>{booking.user?.name || `User #${booking.user_id}`}</strong></div><div><span>Travel date</span><strong><CalendarDays size={14} /> {booking.travel_date}</strong></div><div><span>Group</span><strong><Users size={14} /> {booking.persons} {booking.persons === 1 ? 'person' : 'people'}</strong></div><div><span>Budget</span><strong><Wallet size={14} /> Rs. {Number(booking.total_cost || 0).toLocaleString()}</strong></div></div>
            <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
