import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (!user) return;
    client.get('/notifications')
      .then(({ data }) => setNotifications(data.data || data))
      .catch(() => {});
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    try {
      await client.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🏔️ Tourist Management</Link>
      <div className="nav-links">
        <Link to="/destinations">Destinations</Link>
        <Link to="/packages">Packages</Link>
        
        {user && (
          <>
            <Link to="/favourites">❤️ Saved</Link>
            <Link to="/bookings">My Bookings</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-nav-link">⚙️ Admin Dashboard</Link>
        )}

        {user ? (
          <div className="user-nav-group">
            {/* NOTIFICATIONS DROPDOWN */}
            <div className="notif-wrapper">
              <button className="notif-btn" onClick={() => setShowNotifs(!showNotifs)}>
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {showNotifs && (
                <div className="notif-dropdown">
                  <h4>Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="muted small">No notifications yet.</p>
                  ) : (
                    <ul className="notif-list">
                      {notifications.map((n) => (
                        <li key={n.id} className={n.is_read ? 'read' : 'unread'} onClick={() => markRead(n.id)}>
                          <strong>{n.title}</strong>
                          <p>{n.message}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <span className="user-pill">
              {user.name} <span className="role-tag">{user.role}</span>
            </span>

            <button onClick={handleLogout} className="btn-link">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-cta">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
