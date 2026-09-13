import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDestinations = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get('/destinations', { params: { search: query } });
      setDestinations(data.data || data);
    } catch {
      setError('Could not load destinations. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadDestinations = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await client.get('/destinations');
        if (active) setDestinations(data.data || data);
      } catch {
        if (active) setError('Could not load destinations. Is the backend running?');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDestinations();
    return () => { active = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations(search);
  };

  return (
    <div className="page">
      <h1>Explore Destinations</h1>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="muted">Loading destinations...</p>}
      {error && <div className="alert-error">{error}</div>}

      <div className="card-grid">
        {!loading && destinations.length === 0 && (
          <p className="muted">No destinations found.</p>
        )}
        {destinations.map((dest) => (
          <Link to={`/destinations/${dest.id}`} key={dest.id} className="card">
            <h3>{dest.name}</h3>
            <p className="muted">{dest.location}</p>
            {dest.category && <span className="badge">{dest.category.name}</span>}
            {dest.estimated_cost && (
              <p className="price">Est. Rs. {Number(dest.estimated_cost).toLocaleString()}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
