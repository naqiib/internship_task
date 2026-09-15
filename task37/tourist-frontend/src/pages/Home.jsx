import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, CheckCircle2, Compass, Headphones, Mountain, Send, ShieldCheck, X } from 'lucide-react';
import client from '../api/client';
import kalashValleyImage from '../assets/kalash-mountains.jpg';
import northernAreasImage from '../assets/northern-areas.jpg';

const localDestinations = [
  { name: 'Hunza Valley', location: 'Gilgit-Baltistan', description: 'Turquoise lakes, apricot orchards, and unforgettable mountain sunsets.', image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=900&q=85' },
  { name: 'Skardu', location: 'Baltistan', description: 'A dramatic gateway to high-altitude lakes, forts, and wild landscapes.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85' },
  { name: 'Fairy Meadows', location: 'Nanga Parbat', description: 'Sleep beneath the stars with one of Pakistan\'s most iconic peaks nearby.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Kalash Valley', location: 'Chitral, Khyber Pakhtunkhwa', description: 'Colourful traditions, green valleys, and a culture unlike anywhere else.', image: kalashValleyImage },
];

const services = [
  { icon: Compass, title: 'Local Guides', text: 'Meet trusted guides who know every trail, viewpoint, and hidden story.' },
  { icon: Car, title: 'Comfortable Transport', text: 'Reliable car service for smooth transfers across valleys and mountain roads.' },
  { icon: ShieldCheck, title: 'Trip Support', text: 'From your first question to your return journey, we have your back.' },
];

export default function Home() {
  const [destinations, setDestinations] = useState(localDestinations);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    client.get('/destinations')
      .then(({ data }) => {
        const apiDestinations = data.data || data;
        if (Array.isArray(apiDestinations) && apiDestinations.length) setDestinations([...apiDestinations.slice(0, 3), localDestinations[3]]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 38, 29, .9) 0%, rgba(12, 38, 29, .62) 45%, rgba(12, 38, 29, .18) 100%), url(${northernAreasImage})` }}>
        <div className="hero-copy">
          <span className="eyebrow"><Mountain size={15} /> Explore beyond the ordinary</span>
          <h1>Let&apos;s tour<br /><em>with us.</em></h1>
          <p>Find the wild beauty of Northern Pakistan, thoughtfully planned by people who call these mountains home.</p>
          <div className="hero-actions"><Link to="/destinations" className="btn-cta">Explore destinations <ArrowRight size={17} /></Link><a href="#services" className="hero-text-link">See our services <ArrowRight size={15} /></a></div>
          <div className="hero-note"><Headphones size={17} /> Personal help before, during, and after your trip</div>
        </div>
        <div className="hero-stamp"><Mountain size={25} /><span>TRAVEL<br />NORTH</span></div>
      </section>

      <section className="home-section intro-section" id="about">
        <div className="section-kicker">A better way to wander</div>
        <div className="intro-grid"><h2>Big views.<br /><span>Small details.</span></h2><p>Northern Place connects you with the places that make Pakistan unforgettable. Choose a destination, meet the right people, and leave the logistics to us.</p></div>
        <div className="stat-row"><div><strong>12+</strong><span>mountain escapes</span></div><div><strong>4.9/5</strong><span>traveller rating</span></div><div><strong>24/7</strong><span>trip support</span></div></div>
      </section>

      <section className="home-section destinations-section" id="destinations">
        <div className="section-heading"><div><div className="section-kicker">Pick your horizon</div><h2>Places worth<br /><span>the long way.</span></h2></div><Link to="/destinations" className="outline-link">View all places <ArrowRight size={16} /></Link></div>
        <div className="destination-showcase">{destinations.map((destination, index) => <Link to={destination.id ? `/destinations/${destination.id}` : '/destinations'} className={`destination-tile tile-${index + 1}`} key={destination.id || destination.name}><img src={destination.image || localDestinations[index]?.image || localDestinations[0].image} alt={destination.name} /><div className="tile-overlay"><span>{destination.location || 'Northern Pakistan'}</span><h3>{destination.name}</h3><p>{destination.description}</p></div></Link>)}</div>
      </section>

      <section className="home-section services-section" id="services">
        <div className="section-kicker">Travel, made human</div><h2>More than a booking.</h2>
        <div className="service-grid">{services.map(({ icon: Icon, title, text }) => <article className="service-item" key={title}><div className="service-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="contact-banner" id="contact"><div><div className="section-kicker">Ready when you are</div><h2>Tell us where<br />you want to go.</h2></div><div className="contact-copy"><p>Have a question or a dream itinerary? Our travel team would love to hear it.</p><button className="btn-cta" type="button" onClick={() => { setContactOpen(true); setContactSent(false); }}><Send size={16} /> Contact us</button></div></section>
      {contactOpen && <div className="contact-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setContactOpen(false)}><div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title"><button className="contact-close" type="button" aria-label="Close contact form" onClick={() => setContactOpen(false)}><X size={18} /></button>{contactSent ? <div className="contact-success"><CheckCircle2 size={42} /><h2>Message received.</h2><p>Thanks for reaching out. Our travel team will get back to you soon.</p><button className="btn-cta" type="button" onClick={() => setContactOpen(false)}>Done</button></div> : <><span className="section-kicker">Northern Place team</span><h2 id="contact-title">Let&apos;s plan your escape.</h2><p className="muted">Share a few details and we&apos;ll help you find the right route.</p><form onSubmit={(event) => { event.preventDefault(); setContactSent(true); }}><label>Name<input required type="text" placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@example.com" /></label><label>How can we help?<textarea required rows="3" placeholder="Tell us about your trip" /></label><button className="btn-cta contact-submit" type="submit"><Send size={16} /> Send message</button></form></>}</div></div>}
    </div>
  );
}
