import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { CalendarDays, MapPin, Search } from 'lucide-react';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const fetchDestinations = async (query = search, catId = selectedCat) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (query) params.search = query;
      if (catId) params.category_id = catId;
      const { data } = await client.get('/destinations', { params });
      setDestinations(data.data || data);
    } catch {
      setError('Could not load destinations. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations(search, selectedCat);
  }, [selectedCat]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDestinations(search, selectedCat);
  };

  return (
    <div className="page">
      <h1>Explore Destinations</h1>
      <p className="muted">Discover incredible mountains, scenic valleys, and historical wonders.</p>

      {/* SEARCH AND CATEGORY FILTERS */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="icon-button"><Search size={17} aria-hidden="true" /> Search</button>
      </form>

      <div className="category-pills">
        <button
          className={`pill ${selectedCat === '' ? 'active' : ''}`}
          onClick={() => setSelectedCat('')}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`pill ${selectedCat === String(c.id) ? 'active' : ''}`}
            onClick={() => setSelectedCat(String(c.id))}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading destinations...</p>}
      {error && <div className="alert-error">{error}</div>}

      <div className="card-grid">
        {!loading && destinations.length === 0 && (
          <p className="muted">No destinations match your search.</p>
        )}
        {destinations.map((dest) => (
          <Link to={`/destinations/${dest.id}`} key={dest.id} className="card destination-card">
            <div className="card-top">
              <h3>{dest.name}</h3>
              {dest.category && <span className="badge">{dest.category.name}</span>}
            </div>
            <p className="muted inline-icon"><MapPin size={15} aria-hidden="true" /> {dest.location}</p>
            <p className="description-preview">{dest.description}</p>
            <div className="card-footer">
              {dest.best_season && <span className="season-tag inline-icon"><CalendarDays size={14} aria-hidden="true" /> {dest.best_season}</span>}
              {dest.estimated_cost && (
                <span className="price">Est. Rs. {Number(dest.estimated_cost).toLocaleString()}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
