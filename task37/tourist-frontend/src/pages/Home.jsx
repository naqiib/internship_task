import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <h1>Discover Your Next Adventure</h1>
      <p className="muted">
        Explore destinations, book guided tours, and plan your perfect trip —
        all from one platform.
      </p>
      <Link to="/destinations" className="btn-cta">Browse Destinations</Link>
    </div>
  );
}
