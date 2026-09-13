import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Packages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/packages')
      .then(({ data }) => setPackages(data.data || data))
      .catch(() => setError('Could not load tour packages. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1>Tour Packages</h1>
      {loading && <p className="muted">Loading packages...</p>}
      {error && <div className="alert-error">{error}</div>}
      <div className="card-grid">
        {!loading && !error && packages.length === 0 && <p className="muted">No packages found.</p>}
        {packages.map((pkg) => (
          <div key={pkg.id} className="card">
            <h3>{pkg.title}</h3>
            <p className="muted">{pkg.destination?.name} · {pkg.duration} days</p>
            <p>{pkg.description}</p>
            <p className="price">Rs. {Number(pkg.price).toLocaleString()}</p>
            {user ? (
              <Link to={`/book/${pkg.id}`} className="btn-cta small">Book Now</Link>
            ) : (
              <Link to="/login" className="btn-cta small">Login to Book</Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
