import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
  Bell,
  Compass,
  Heart,
  LogOut,
  Menu,
  Users,
  X
} from 'lucide-react';
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
      .catch(() => { });
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markRead = async (id) => {
    try {
      await client.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch { }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <header className="site-header-wrapper">
      <nav className="navbar vitour-navbar">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-logo-wrapper">
            <img src={northernPlaceLogo} alt="Northern Place" className="brand-logo-image" />
            <span className="brand-text">Northern Place</span>
          </div>
        </Link>

        <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/destinations" onClick={() => setMenuOpen(false)}>Tour</Link>
          <Link to="/destinations" onClick={() => setMenuOpen(false)}>Destination</Link>
          <Link to="/packages" onClick={() => setMenuOpen(false)}>Packages</Link>
          <Link to="/#about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          {user && (
            <>
              <Link to="/favourites" onClick={() => setMenuOpen(false)}><Heart size={15} aria-hidden="true" /> Saved</Link>
              <Link to="/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
          )}

          {user?.role === 'guide' && (
            <Link to="/guide" className="guide-nav-link" onClick={() => setMenuOpen(false)}><Users size={15} aria-hidden="true" /> Guide Portal</Link>
          )}

          {user ? (
            <div className="user-nav-group">
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

              <button onClick={handleLogout} className="btn-link"><LogOut size={15} aria-hidden="true" /> Logout</button>
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="btn-cta green-cta">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
