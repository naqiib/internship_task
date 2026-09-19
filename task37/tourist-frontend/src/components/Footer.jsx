import { Compass, Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import northernPlaceLogo from '../assets/northern-place-logo.jpg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <img className="footer-brand-logo" src={northernPlaceLogo} alt="Northern Place logo" />
              <span>Northern Place</span>
            </Link>
            <p className="footer-description">
              Discover the wild beauty of Northern Pakistan with trusted local guides, hand-crafted mountain itineraries, and personalized travel support.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheck size={18} /> Verified Mountain Expedition Partner
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destinations">Explore Destinations</Link></li>
              <li><Link to="/packages">Tour Packages</Link></li>
              <li><Link to="/favourites">Saved Places</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
            </ul>
          </div>

          {/* Experience & Services */}
          <div className="footer-col">
            <h3>Top Destinations</h3>
            <ul className="footer-links">
              <li><Link to="/destinations">Hunza Valley</Link></li>
              <li><Link to="/destinations">Skardu & Shangrila</Link></li>
              <li><Link to="/destinations">Fairy Meadows</Link></li>
              <li><Link to="/destinations">Kalash Valley</Link></li>
              <li><Link to="/destinations">Naran Kaghan</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h3>Get In Touch</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} className="icon" />
                <span>Main Bazaar Road, Hunza Valley, Gilgit-Baltistan, Pakistan</span>
              </li>
              <li>
                <Phone size={18} className="icon" />
                <span>+92 300 1234567</span>
              </li>
              <li>
                <Mail size={18} className="icon" />
                <span>support@northernplace.pk</span>
              </li>
              <li>
                <Compass size={18} className="icon" />
                <span>24/7 Traveller Support Center</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Northern Place Travel & Tours. All rights reserved.</p>
          <p className="footer-made-with">
            Crafted with <Heart size={14} className="heart-icon" /> for mountain wanderers.
          </p>
        </div>
      </div>
    </footer>
  );
}
