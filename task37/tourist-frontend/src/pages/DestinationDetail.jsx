import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock3, Heart, MapPin, Star, Wallet } from 'lucide-react';

export default function DestinationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    client.get(`/destinations/${id}`)
      .then(({ data }) => {
        if (active) setDestination(data);
      })
      .catch(() => {
        if (active) setError('Could not load this destination.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    if (user) {
      client.get('/favourites')
        .then(({ data }) => {
          if (active && Array.isArray(data)) {
            setIsFav(data.some((f) => String(f.destination_id) === String(id)));
          }
        })
        .catch(() => {});
    }

    return () => { active = false; };
  }, [id, user]);

  const toggleFavourite = async () => {
    try {
      if (isFav) {
        await client.delete(`/favourites/${id}`);
        setIsFav(false);
      } else {
        await client.post(`/favourites/${id}`);
        setIsFav(true);
      }
    } catch {
      alert('Could not update favourite status.');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await client.post(`/destinations/${id}/reviews`, reviewForm);
      setReviewMsg('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await client.get(`/destinations/${id}`);
      setDestination(data);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review.');
    }
  };

  if (loading) return <div className="page"><p className="muted">Loading destination details...</p></div>;
  if (error) return <div className="page"><div className="alert-error">{error}</div></div>;
  if (!destination) return <div className="page"><p>Destination not found.</p></div>;

  return (
    <div className="page destination-detail-page">
      <Link to="/destinations" className="back-link">&larr; Back to destinations</Link>

      <div className="detail-header">
        <div>
          <h1>{destination.name}</h1>
          <p className="muted inline-icon"><MapPin size={15} aria-hidden="true" /> {destination.location} · <span className="badge">{destination.category?.name}</span></p>
        </div>

        {user && (
          <button
            className={`btn-fav ${isFav ? 'active' : ''}`}
            onClick={toggleFavourite}
          >
            <Heart size={16} fill={isFav ? 'currentColor' : 'none'} aria-hidden="true" /> {isFav ? 'Saved to Favourites' : 'Add to Favourites'}
          </button>
        )}
      </div>

      <div className="detail-card">
        <h3>About this Destination</h3>
        <p>{destination.description}</p>
        <div className="meta-row">
          {destination.estimated_cost && (
            <span className="inline-icon"><Wallet size={15} aria-hidden="true" /> Estimated Cost: <strong>Rs. {Number(destination.estimated_cost).toLocaleString()}</strong></span>
          )}
          {destination.best_season && (
            <span className="inline-icon"><CalendarDays size={15} aria-hidden="true" /> Best Season: <strong>{destination.best_season}</strong></span>
          )}
          {destination.reviews_avg_rating && (
            <span className="inline-icon"><Star size={15} aria-hidden="true" /> Rating: <strong>{Number(destination.reviews_avg_rating).toFixed(1)} / 5</strong></span>
          )}
        </div>
      </div>

      {/* TOUR PACKAGES */}
      <h2>Available Tour Packages</h2>
      <div className="card-grid">
        {destination.packages?.length ? destination.packages.map((pkg) => (
          <div key={pkg.id} className="card pkg-card">
            <h3>{pkg.title}</h3>
            <p className="muted inline-icon"><Clock3 size={15} aria-hidden="true" /> {pkg.duration} days</p>
            {pkg.description && <p className="small">{pkg.description}</p>}
            {pkg.included_services && <p className="badge-light">Includes: {pkg.included_services}</p>}
            <p className="price">Rs. {Number(pkg.price).toLocaleString()}</p>
            {user ? (
              <Link to={`/book/${pkg.id}`} className="btn-cta small">Book Package</Link>
            ) : (
              <Link to="/login" className="btn-cta small">Login to Book</Link>
            )}
          </div>
        )) : <p className="muted">No packages currently available for this destination.</p>}
      </div>

      {/* REVIEWS SECTION */}
      <h2>Traveler Reviews</h2>
      {destination.reviews?.length ? (
        <ul className="review-list">
          {destination.reviews.map((r) => (
            <li key={r.id} className="review-item">
              <div className="review-header">
                <strong>{r.user?.name || 'Anonymous Traveler'}</strong>
                <span className="rating-stars" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true" />)}
                </span>
              </div>
              <p>{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : <p className="muted">No reviews yet. Be the first to share your experience!</p>}

      {user && (
        <form className="review-form card" onSubmit={submitReview}>
          <h3>Write a Review</h3>
          {reviewMsg && <p className="alert-success">{reviewMsg}</p>}
          <label>Rating</label>
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
            ))}
          </select>

          <label>Comment</label>
          <textarea
            rows="3"
            required
            placeholder="Tell future travelers about your trip..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
          <button type="submit" className="btn-cta">Post Review</button>
        </form>
      )}
    </div>
  );
}
