import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DestinationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
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
        if (active) setError('Could not load this destination. Is the backend running?');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const toggleFavourite = async () => {
    await client.post(`/favourites/${id}`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await client.post(`/destinations/${id}/reviews`, reviewForm);
      setReviewMsg('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await client.get(`/destinations/${id}`);
      setDestination(data);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review.');
    }
  };

  if (loading) return <div className="page"><p className="muted">Loading...</p></div>;
  if (error) return <div className="page"><div className="alert-error">{error}</div></div>;
  if (!destination) return <div className="page"><p>Destination not found.</p></div>;

  return (
    <div className="page">
      <Link to="/destinations" className="back-link">&larr; Back to destinations</Link>
      <h1>{destination.name}</h1>
      <p className="muted">{destination.location} · {destination.category?.name}</p>
      <p>{destination.description}</p>
      <div className="meta-row">
        {destination.estimated_cost && <span>💰 Est. Rs. {Number(destination.estimated_cost).toLocaleString()}</span>}
        {destination.best_season && <span>🗓️ Best season: {destination.best_season}</span>}
        {destination.reviews_avg_rating && <span>⭐ {Number(destination.reviews_avg_rating).toFixed(1)} / 5</span>}
      </div>

      {user && (
        <button className="btn-secondary" onClick={toggleFavourite}>
          ♥ Save to Favourites
        </button>
      )}

      <h2>Tour Packages</h2>
      <div className="card-grid">
        {destination.packages?.length ? destination.packages.map((pkg) => (
          <div key={pkg.id} className="card">
            <h3>{pkg.title}</h3>
            <p className="muted">{pkg.duration} days</p>
            <p className="price">Rs. {Number(pkg.price).toLocaleString()}</p>
            {user ? (
              <Link to={`/book/${pkg.id}`} className="btn-cta small">Book Now</Link>
            ) : (
              <Link to="/login" className="btn-cta small">Login to Book</Link>
            )}
          </div>
        )) : <p className="muted">No packages yet for this destination.</p>}
      </div>

      <h2>Reviews</h2>
      {destination.reviews?.length ? (
        <ul className="review-list">
          {destination.reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.user?.name}</strong> — {'⭐'.repeat(r.rating)}
              <p>{r.comment}</p>
            </li>
          ))}
        </ul>
      ) : <p className="muted">No reviews yet.</p>}

      {user && (
        <form className="review-form" onSubmit={submitReview}>
          <h3>Leave a review</h3>
          {reviewMsg && <p className="muted">{reviewMsg}</p>}
          <label>Rating</label>
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
          </select>
          <label>Comment</label>
          <textarea
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}
