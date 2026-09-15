import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { Heart, Trash2 } from 'lucide-react';

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavourites = () => {
    setLoading(true);
    client.get('/favourites')
      .then(({ data }) => setFavourites(data))
      .catch(() => setError('Could not load your saved favourites.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const removeFavourite = async (destId) => {
    try {
      await client.delete(`/favourites/${destId}`);
      setFavourites((prev) => prev.filter((f) => f.destination_id !== destId));
    } catch {
      alert('Could not remove from favourites.');
    }
  };

  return (
    <div className="page">
      <h1 className="title-with-icon"><Heart size={28} aria-hidden="true" /> My Favourite Destinations</h1>
      <p className="muted">Quick access to your saved travel spots</p>

      {loading && <p className="muted">Loading favourites...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && favourites.length === 0 && (
        <div className="empty-state">
          <p className="muted">You haven't saved any destinations yet.</p>
          <Link to="/destinations" className="btn-cta small">Browse Destinations</Link>
        </div>
      )}

      <div className="card-grid">
        {favourites.map((fav) => {
          const dest = fav.destination;
          if (!dest) return null;
          return (
            <div key={fav.id} className="card fav-card">
              <div className="card-header">
                <h3>{dest.name}</h3>
                <button
                  className="btn-icon"
                  title="Remove from favourites"
                  onClick={() => removeFavourite(dest.id)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
              <p className="muted">{dest.location}</p>
              {dest.estimated_cost && (
                <p className="price">Est. Rs. {Number(dest.estimated_cost).toLocaleString()}</p>
              )}
              <Link to={`/destinations/${dest.id}`} className="btn-secondary small">View Details</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
