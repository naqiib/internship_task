import { motion } from 'framer-motion';
import { CalendarDays, Compass, Heart, Home, Ticket, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const baseItems = [
  { label: 'Home', path: '/', Icon: Home },
  { label: 'Explore', path: '/destinations', Icon: Compass },
  { label: 'Packages', path: '/packages', Icon: CalendarDays },
];

export default function FloatingNav() {
  const location = useLocation();
  const { user } = useAuth();
  const items = [
    ...baseItems,
    ...(user ? [
      { label: 'Saved', path: '/favourites', Icon: Heart },
      { label: 'Bookings', path: '/bookings', Icon: Ticket },
    ] : []),
    { label: 'Account', path: user ? '/bookings' : '/login', Icon: User },
  ];

  const activeIndex = Math.max(
    0,
    items.findIndex(({ path }) => (
      path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    ))
  );

  return (
    <nav className="floating-nav" aria-label="Mobile navigation">
      <div className="floating-nav-inner">
        {items.map(({ label, path, Icon }, index) => {
          const active = index === activeIndex;
          return (
            <Link
              key={label}
              to={path}
              className={`floating-nav-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {active && <motion.span layoutId="floating-nav-indicator" className="floating-nav-indicator" transition={{ type: 'spring', stiffness: 420, damping: 30 }} aria-hidden="true" />}
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
