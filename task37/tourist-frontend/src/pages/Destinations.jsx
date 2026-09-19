import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { ArrowRight, CalendarDays, Clock, Heart, MapPin, Search, SearchX, SlidersHorizontal, Star } from 'lucide-react';
import { getDestinationImage } from '../utils/destinationImages';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.data || []))
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
      setDestinations(Array.isArray(data) ? data : data.data || []);
    } catch {
      setError('Could not load destinations. Please check if the backend is running.');
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
    <div className="page destinations-page">
      <div className="destinations-header">
        <h1>Explore Destinations</h1>
        <p className="muted">Discover incredible mountain peaks, peaceful valleys, and rich cultural heritage.</p>
      </div>

      {/* SEARCH AND CATEGORY FILTERS */}
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by destination name or location (e.g., Kalash, Hunza, Chitral)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-cta">
          <Search size={17} aria-hidden="true" /> Search
        </button>
      </form>

      <div className="category-pills">
        <span className="filter-section-label"><SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" /> Filter</span>
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

      {loading && <p className="muted">Loading mountain destinations...</p>}
      {error && <div className="alert-error">{error}</div>}

      <div className="card-grid destinations-grid">
        {!loading && destinations.length === 0 && (
          <div className="no-results-box">
            <SearchX size={28} aria-hidden="true" />
            <p className="muted">No destinations match your search criteria.</p>
          </div>
        )}
        {destinations.map((dest) => {
          const image = getDestinationImage(dest.name, dest.location);
          return (
            <Link to={`/destinations/${dest.id}`} key={dest.id} className="card destination-card-enhanced">
              <div className="dest-card-image-wrap">
                <img src={image} alt={dest.name} loading="lazy" />
                {dest.category && <span className="dest-badge-top">{dest.category.name}</span>}
              </div>

              <div className="dest-card-body">
                <h3>{dest.name}</h3>
                <p className="muted inline-icon location-tag">
                  <MapPin size={15} aria-hidden="true" /> {dest.location}
                </p>
                {dest.description && (
                  <p className="description-preview">{dest.description}</p>
                )}

                <div className="dest-card-footer">
                  {dest.best_season && (
                    <span className="season-tag">
                      <Clock size={14} strokeWidth={1.75} aria-hidden="true" /> {dest.best_season}
                    </span>
                  )}
                  {dest.reviews_avg_rating && <span className="rating-stars"><Star size={14} strokeWidth={1.75} aria-hidden="true" /> {Number(dest.reviews_avg_rating).toFixed(1)}</span>}
                  {dest.estimated_cost && (
                    <span className="dest-price-tag">
                      Est. Rs. {Number(dest.estimated_cost).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="view-details-btn">
                  <Heart size={15} strokeWidth={1.75} aria-hidden="true" /> View Packages & Details <ArrowRight size={15} aria-hidden="true" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
