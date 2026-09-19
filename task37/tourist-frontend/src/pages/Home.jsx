import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Compass,
  MapPin,
  Mountain,
  Search,
  Send,
  ShieldCheck,
  Sun,
  Tent,
  Users,
  X
} from 'lucide-react';
import client from '../api/client';
import kalashValleyImage from '../assets/kalash-valley.jpg';
import northernAreasImage from '../assets/northern-areas.jpg';

const localDestinations = [
  { id: 1, name: 'Hunza Valley', location: 'Gilgit-Baltistan', description: 'Turquoise lakes, apricot orchards, and unforgettable mountain sunsets.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Hunza_Valley_HDR.jpg?utm_source=en.wikivoyage.org&utm_campaign=index&utm_content=original', category: { name: 'Valleys' }, best_season: 'April - October', estimated_cost: 35000 },
  { id: 2, name: 'Kalash Valley', location: 'Chitral, KP', description: 'Colourful traditions, green coniferous valleys, and ancient cultural heritage.', image: kalashValleyImage, category: { name: 'Valleys' }, best_season: 'May - October', estimated_cost: 15000 },
  { id: 3, name: 'Tirich Mir Base Camp', location: 'Chitral, Pakistan', description: 'Dramatic base camp views of the highest peak in the Hindukush range.', image: 'https://hunzaguidespakistan.com/wp-content/uploads/2022/02/Tirich-Mir-Peak-1.jpg', category: { name: 'Mountains' }, best_season: 'June - September', estimated_cost: 25000 },
  { id: 4, name: 'Skardu & Shangrila', location: 'Baltistan', description: 'High-altitude cold deserts, historic forts, and crystal clear lakes.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQwIUa-samgJitTbF4ncqOxDPdPDVcs_rigDELAfk6-adC5MYi9UZPOLc&s=10', category: { name: 'Lakes' }, best_season: 'May - October', estimated_cost: 40000 }
];

const services = [
  { icon: Mountain, title: 'Certified Local Guides', text: 'Meet trusted mountain guides who know every trail, viewpoint, and hidden valley.' },
  { icon: Tent, title: 'Comfortable Camping', text: 'Reliable stays and camp services for smooth nights across mountain passes and valleys.' },
  { icon: Sun, title: '24/7 Trip Support', text: 'From itinerary planning to your safe return, our travel experts have your back.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState(localDestinations);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Search Bar Filter State
  const [filterDestination, setFilterDestination] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterGuests, setFilterGuests] = useState('1');

  useEffect(() => {
    client.get('/destinations')
      .then(({ data }) => {
        const apiDestinations = data.data || data;
        if (Array.isArray(apiDestinations) && apiDestinations.length) {
          setDestinations(apiDestinations.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/destinations?search=${encodeURIComponent(filterDestination)}`);
  };

  return (
    <div className="home-page vitour-home">
      {/* HERO SECTION MATCHING USER SCREENSHOT EXACTLY */}
      <section className="vitour-hero-section">
        <div className="vitour-hero-bg-overlay" style={{ backgroundImage: `linear-gradient(90deg, rgba(13,35,25,0.92) 0%, rgba(13,35,25,0.78) 45%, rgba(13,35,25,0.3) 100%), url(https://miro.medium.com/1*OUCcd3ni50TT14TehrRPFw.jpeg)` }}>
          
          <div className="vitour-hero-container">
            <div className="vitour-hero-content">
              {/* CURSIVE GREEN SUB-HEADING */}
              <span className="cursive-eyebrow"><Mountain size={20} strokeWidth={1.75} aria-hidden="true" /> Explore the world</span>

              {/* MAIN BOLD DISPLAY TITLE */}
              <h1 className="hero-main-heading">
                TOUR TRAVEL &<br />ADVENTURE CAMPING
              </h1>

              {/* SUBTITLE PARAGRAPH */}
              <p className="hero-subparagraph">
                Welcome to Vitour Northern Place! We are a professional and reliable travel company that offers a wide range of mountain tours, trekking expeditions, and cultural escapes across Pakistan.
              </p>

              {/* ACTION BUTTONS */}
              <div className="hero-buttons-row">
                <Link to="/destinations" className="btn-cta vitour-green-btn">
                  LET&apos;S GET STARTED
                </Link>
                <a href="#about" className="hero-who-we-are">
                  Who we are <ArrowRight size={17} className="green-arrow" />
                </a>
              </div>
            </div>

            {/* FLOATING BOOKING BADGE ON RIGHT (Matching Screenshot) */}
            <div className="hero-right-decorative">
              <div className="floating-booking-badge">
                <span>Booking</span>
              </div>
            </div>
          </div>

          {/* FLOATING SEARCH & FILTER BAR (Glassmorphism Overlay at Bottom of Hero) */}
          <div className="vitour-search-filter-wrapper">
            <form className="vitour-filter-bar" onSubmit={handleHeroSearch}>
              <div className="filter-item">
                <label><MapPin size={15} className="filter-icon" /> Destination</label>
                <input
                  type="text"
                  placeholder="Melborn, Australia or Hunza..."
                  value={filterDestination}
                  onChange={(e) => setFilterDestination(e.target.value)}
                />
              </div>

              <div className="filter-divider" />

              <div className="filter-item">
                <label><Compass size={15} className="filter-icon" /> Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="">Booking Type</option>
                  <option value="mountains">Mountain Trek</option>
                  <option value="valleys">Valley Escape</option>
                  <option value="culture">Cultural Tour</option>
                </select>
              </div>

              <div className="filter-divider" />

              <div className="filter-item">
                <label><CalendarDays size={15} className="filter-icon" /> Duration</label>
                <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
                  <option value="">2-4 days tour</option>
                  <option value="3">3 Days Weekend</option>
                  <option value="5">5 Days Expedition</option>
                  <option value="7">7+ Days Journey</option>
                </select>
              </div>

              <div className="filter-divider" />

              <div className="filter-item">
                <label><Users size={15} className="filter-icon" /> Guests</label>
                <select value={filterGuests} onChange={(e) => setFilterGuests(e.target.value)}>
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="4">4+ Group</option>
                </select>
              </div>

              <button type="submit" className="filter-submit-btn" aria-label="Search Tours">
                <Search size={22} />
              </button>
            </form>

            {/* SOCIAL PROOF BAR BELOW FILTER (Matching Screenshot) */}
            <div className="hero-social-proof-bar">
              <div className="avatars-stack">
                <span className="avatar-dot avatar-1"></span>
                <span className="avatar-dot avatar-2"></span>
                <span className="avatar-dot avatar-3"></span>
                <span className="avatar-dot avatar-4"></span>
                <span className="avatar-plus">+</span>
              </div>
              <p className="social-proof-text">
                <strong>2,500 people</strong> booked mountain escapes in last 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="home-section intro-section" id="about">
        <div className="section-kicker">A better way to wander</div>
        <div className="intro-grid">
          <h2>Big mountain views.<br /><span>Thoughtful details.</span></h2>
          <p>Vitour Northern Place connects you with the places that make Pakistan unforgettable. Choose a destination, meet local guides, and leave travel logistics to us.</p>
        </div>
        <div className="stat-row">
          <div><strong>12+</strong><span>mountain escapes</span></div>
          <div><strong>4.9/5</strong><span>traveller rating</span></div>
          <div><strong>24/7</strong><span>trip support</span></div>
        </div>
      </section>

      {/* DESTINATIONS SHOWCASE */}
      <section className="home-section destinations-section" id="destinations">
        <div className="section-heading">
          <div>
            <div className="section-kicker">Pick your horizon</div>
            <h2>Places worth<br /><span>the journey.</span></h2>
          </div>
          <Link to="/destinations" className="outline-link">
            View all places <ArrowRight size={16} />
          </Link>
        </div>

        <div className="destination-showcase">
          {destinations.map((destination, index) => (
            <Link
              to={destination.id ? `/destinations/${destination.id}` : '/destinations'}
              className={`destination-tile tile-${index + 1}`}
              key={destination.id || destination.name}
            >
              <img
                src={destination.image || localDestinations[index]?.image || localDestinations[0].image}
                alt={destination.name}
              />
              <div className="tile-overlay">
                <span>{destination.location || 'Northern Pakistan'}</span>
                <h3>{destination.name}</h3>
                <p>{destination.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="home-section services-section" id="services">
        <div className="section-kicker">Travel, made human</div>
        <h2>More than just a booking.</h2>
        <div className="service-grid">
          {services.map(({ icon: Icon, title, text }) => (
            <article className="service-item" key={title}>
              <div className="service-icon"><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="contact-banner" id="contact">
        <div>
          <div className="section-kicker">Ready when you are</div>
          <h2>Tell us where<br />you want to go.</h2>
        </div>
        <div className="contact-copy">
          <p>Have a question or a custom itinerary? Our team is available to help.</p>
          <button className="btn-cta vitour-green-btn" type="button" onClick={() => { setContactOpen(true); setContactSent(false); }}>
            <Send size={16} /> Contact us
          </button>
        </div>
      </section>

      {/* CONTACT DIALOG */}
      {contactOpen && (
        <div className="contact-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setContactOpen(false)}>
          <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <button className="contact-close" type="button" aria-label="Close contact form" onClick={() => setContactOpen(false)}>
              <X size={18} />
            </button>
            {contactSent ? (
              <div className="contact-success">
                <CheckCircle2 size={42} />
                <h2>Message received.</h2>
                <p>Thanks for reaching out! Our team will contact you shortly.</p>
                <button className="btn-cta vitour-green-btn" type="button" onClick={() => setContactOpen(false)}>Done</button>
              </div>
            ) : (
              <>
                <span className="section-kicker">Vitour Team</span>
                <h2 id="contact-title">Let&apos;s plan your trip.</h2>
                <p className="muted">Share a few details and we&apos;ll help you find the right itinerary.</p>
                <form onSubmit={(event) => { event.preventDefault(); setContactSent(true); }}>
                  <label>Name<input required type="text" placeholder="Your name" /></label>
                  <label>Email<input required type="email" placeholder="you@example.com" /></label>
                  <label>How can we help?<textarea required rows="3" placeholder="Tell us about your trip" /></label>
                  <button className="btn-cta contact-submit vitour-green-btn" type="submit"><Send size={16} /> Send message</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
