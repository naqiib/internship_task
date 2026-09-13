import { useEffect, useState } from 'react';
import client from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  if (error) return <div className="page"><div className="alert-error">{error}</div></div>;
  if (!stats) return <div className="page"><p className="muted">Loading dashboard...</p></div>;

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total_users}</span>
          <span className="muted">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.total_tourists}</span>
          <span className="muted">Tourists</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.total_guides}</span>
          <span className="muted">Guides</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.total_destinations}</span>
          <span className="muted">Destinations</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.total_packages}</span>
          <span className="muted">Packages</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.total_bookings}</span>
          <span className="muted">Bookings</span>
        </div>
      </div>

      <h2>Bookings by Status</h2>
      <ul>
        {Object.entries(stats.bookings_by_status || {}).map(([status, count]) => (
          <li key={status}>{status}: {count}</li>
        ))}
      </ul>

      <h2>Most Reviewed Destinations</h2>
      <ul>
        {stats.popular_destinations?.map((d) => (
          <li key={d.id}>{d.name}</li>
        ))}
      </ul>
    </div>
  );
}
