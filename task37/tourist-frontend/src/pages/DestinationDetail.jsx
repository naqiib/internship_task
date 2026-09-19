import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageSquare,
  Mountain,
  Image as ImageIcon,
  ShieldCheck,
  Star,
  Sun,
  Thermometer,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { getDestinationImage } from '../utils/destinationImages';

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
        if (active) setError('Could not load this destination. Please check connection.');
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

  if (loading) return <div className="page center-spinner"><div className="spinner"></div><p className="muted" style={{ marginTop: '1rem' }}>Loading destination details...</p></div>;
  if (error) return <div className="page"><div className="alert-error">{error}</div></div>;
  if (!destination) return <div className="page"><p>Destination not found.</p></div>;

  const bgImage = getDestinationImage(destination.name, destination.location);

  return (
    <div className="page destination-detail-enhanced">
      {/* BACK LINK */}
      <Link to="/destinations" className="back-link-btn">
        <ArrowLeft size={16} /> Back to all destinations
      </Link>

      {/* HERO IMAGE BANNER */}
      <div className="detail-hero-banner" style={{ backgroundImage: `linear-gradient(180deg, rgba(16,40,31,0.3) 0%, rgba(16,40,31,0.85) 100%), url(${bgImage})` }}>
        <div className="detail-hero-content">
          <div className="detail-badges-row">
            <span className="category-tag">{destination.category?.name || 'Destination'}</span>
            <span className="location-pill"><MapPin size={14} /> {destination.location}</span>
          </div>

          <h1><Mountain size={28} strokeWidth={1.75} aria-hidden="true" /> {destination.name}</h1>

          <div className="detail-quick-meta">
            {destination.estimated_cost && (
              <span className="quick-meta-item">
                <Wallet size={16} /> Est. Cost: <strong>Rs. {Number(destination.estimated_cost).toLocaleString()}</strong>
              </span>
            )}
            {destination.best_season && (
              <span className="quick-meta-item">
                <CalendarDays size={16} /> Best Season: <strong>{destination.best_season}</strong>
              </span>
            )}
            {destination.reviews_avg_rating && (
              <span className="quick-meta-item">
                <Star size={16} className="star-gold" /> Rating: <strong>{Number(destination.reviews_avg_rating).toFixed(1)} / 5</strong>
              </span>
            )}
          </div>
        </div>

        {user && (
          <button
            className={`btn-fav-hero ${isFav ? 'active' : ''}`}
            onClick={toggleFavourite}
            title={isFav ? 'Remove from Saved Favourites' : 'Save to Favourites'}
          >
            <Heart size={18} fill={isFav ? '#e74c3c' : 'none'} color={isFav ? '#e74c3c' : 'white'} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
        )}
      </div>

      {/* MAIN SPLIT GRID (LEFT 2 COLS, RIGHT 1 COL) */}
      <div className="detail-layout-split">
        {/* LEFT COLUMN: DESCRIPTION & REVIEWS */}
        <div className="detail-main-col">
          {/* ABOUT CARD */}
          <div className="detail-section-card">
            <h2>About {destination.name}</h2>
            <p className="description-lead">{destination.description || 'Experience high-altitude peaks, local hospitality, and wild mountain trails in this iconic destination.'}</p>
            
            <div className="destination-highlights">
              <div className="highlight-box">
                <ShieldCheck size={20} className="icon-green" />
                <div>
                  <strong>Guided Support</strong>
                  <span>Local expert guides available</span>
                </div>
              </div>

              <div className="highlight-box">
                <Thermometer size={20} strokeWidth={1.75} className="icon-gold" aria-hidden="true" />
                <div>
                  <strong>Best Time to Visit</strong>
                  <span>{destination.best_season || 'May through October'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="detail-section-card">
            <h2><MessageSquare size={20} strokeWidth={1.75} aria-hidden="true" /> Traveler Reviews ({destination.reviews?.length || 0})</h2>

            {destination.reviews?.length ? (
              <div className="reviews-list">
                {destination.reviews.map((r) => (
                  <div key={r.id} className="review-card">
                    <div className="review-top-row">
                      <strong>{r.user?.name || 'Mountain Traveler'}</strong>
                      <span className="rating-stars">
                        {Array.from({ length: r.rating }, (_, index) => (
                          <Star key={index} size={14} fill="#e9c46a" color="#e9c46a" />
                        ))}
                      </span>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No reviews written for this destination yet. Be the first to share your experience!</p>
            )}

            {user && (
              <form className="write-review-form" onSubmit={submitReview}>
                <h3>Write a Review for {destination.name}</h3>
                {reviewMsg && <p className="alert-success">{reviewMsg}</p>}
                
                <div className="form-row">
                  <div>
                    <label>Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label>Your Review & Experience</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share details about your trek, guide experience, or mountain scenery..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />

                <button type="submit" className="btn-cta">Post Review</button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TOUR PACKAGES & BOOKING CARDS */}
        <div className="detail-side-col">
          <div className="detail-section-card packages-panel">
            <h2><ImageIcon size={20} strokeWidth={1.75} aria-hidden="true" /> Available Tour Packages</h2>
            <p className="muted">Choose a package to book your trip to {destination.name}:</p>

            {destination.packages?.length ? (
              <div className="packages-stack">
                {destination.packages.map((pkg) => (
                  <div key={pkg.id} className="package-item-card">
                    <div className="pkg-header">
                      <h3>{pkg.title}</h3>
                      <span className="duration-badge"><Clock3 size={13} /> {pkg.duration} Days</span>
                    </div>

                    {pkg.description && <p className="pkg-desc">{pkg.description}</p>}

                    {pkg.included_services && (
                      <div className="included-services-badge">
                        <CheckCircle2 size={14} /> Services: {pkg.included_services}
                      </div>
                    )}

                    <div className="pkg-booking-footer">
                      <div className="price-block">
                        <span className="price-label">Per Person</span>
                        <span className="price-amount">Rs. {Number(pkg.price).toLocaleString()}</span>
                      </div>

                      {user ? (
                        <Link to={`/book/${pkg.id}`} className="btn-cta book-now-btn">
                          Book Package <ArrowRight size={15} />
                        </Link>
                      ) : (
                        <Link to="/login" className="btn-cta book-now-btn">
                          Login to Book <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-packages-card">
                <p className="muted">No packages currently available for this destination.</p>
                <Link to="/packages" className="btn-secondary small" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
                  Explore All Packages
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
