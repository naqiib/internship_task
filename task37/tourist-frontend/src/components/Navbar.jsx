import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Bell, Heart, LogOut, Menu, Settings, X } from 'lucide-react';
import northernPlaceLogo from '../assets/northern-place-logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}><img className="brand-logo" src={northernPlaceLogo} alt="Northern Place mountain logo" /> <span>Northern Place</span></Link>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/destinations" onClick={() => setMenuOpen(false)}>Destinations</Link>
        <Link to="/packages" onClick={() => setMenuOpen(false)}>Packages</Link>
        <a href="/#about" onClick={() => setMenuOpen(false)}>About us</a>
        <a href="/#services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="/#contact" onClick={() => setMenuOpen(false)}>Contact us</a>
        
        {user && (
          <>
            <Link to="/favourites" onClick={() => setMenuOpen(false)}><Heart size={16} aria-hidden="true" /> Saved</Link>
            <Link to="/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
          </>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-nav-link" onClick={() => setMenuOpen(false)}><Settings size={16} aria-hidden="true" /> Admin Dashboard</Link>
        )}

        {user ? (
          <div className="user-nav-group">
            {/* NOTIFICATIONS DROPDOWN */}
            <div className="notif-wrapper">
              <button className="notif-btn" aria-label="Notifications" onClick={() => setShowNotifs(!showNotifs)}>
                <Bell size={19} aria-hidden="true" />
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

            <button onClick={handleLogout} className="btn-link"><LogOut size={16} aria-hidden="true" /> Logout</button>
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
