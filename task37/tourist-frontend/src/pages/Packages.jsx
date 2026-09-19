import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BadgeDollarSign, CheckCircle2, Clock3, Heart, MapPin, Ticket, Users, XCircle } from 'lucide-react';
import kalashValleyImage from '../assets/kalash-mountains.jpg';
import northernAreasImage from '../assets/northern-areas.jpg';
import heroImage from '../assets/hero.png';

const hunzaPackage = {
  id: 'hunza-featured',
  title: 'Hunza Valley Escape',
  destination: { name: 'Hunza Valley' },
  duration: 5,
  price: 35000,
  description: 'A scenic five-day journey through Altit Fort, Attabad Lake, Passu Cones, and the villages of Hunza.',
  included_services: 'Local guide, comfortable car service, hotel stay, breakfast',
};

const packageImages = [northernAreasImage, kalashValleyImage, heroImage];

function getPackageImage(pkg, index) {
  const destination = pkg.destination?.name?.toLowerCase() || '';
  if (destination.includes('hunza') || pkg.title?.toLowerCase().includes('hunza')) return northernAreasImage;
  if (destination.includes('kalash') || pkg.title?.toLowerCase().includes('kalash')) return kalashValleyImage;
  return packageImages[index % packageImages.length];
}

export default function Packages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/packages')
      .then(({ data }) => {
        const apiPackages = data.data || data;
        const hasHunzaPackage = apiPackages.some((pkg) => pkg.title?.toLowerCase().includes('hunza'));
        setPackages(hasHunzaPackage ? apiPackages : [...apiPackages, hunzaPackage]);
      })
      .catch(() => setError('Could not load tour packages. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="packages-heading">
        <div><span className="section-kicker">Curated journeys</span><h1>Choose your escape</h1><p className="muted">Small groups, big landscapes, and everything you need for the road ahead.</p></div>
        <span className="packages-count">{packages.length || 0} experiences</span>
      </div>
      {loading && <p className="muted">Loading packages...</p>}
      {error && <div className="alert-error">{error}</div>}
      <div className="card-grid">
        {!loading && !error && packages.length === 0 && <p className="muted">No packages found.</p>}
        {packages.map((pkg, index) => (
          <article key={pkg.id} className="package-card">
            <div className="package-image-wrap"><img src={getPackageImage(pkg, index)} alt={pkg.destination?.name || pkg.title} /><button className="package-favourite" aria-label={`Save ${pkg.title}`}><Heart size={17} /></button><span className="package-badge">Popular trip</span></div>
            <div className="package-card-body">
              <div className="package-meta"><span><MapPin size={13} strokeWidth={1.75} aria-hidden="true" /> {pkg.destination?.name || 'Northern Pakistan'}</span><span><Clock3 size={13} strokeWidth={1.75} aria-hidden="true" /> {pkg.duration} days</span><span><Users size={13} strokeWidth={1.75} aria-hidden="true" /> Small group</span></div>
              <h3>{pkg.title}</h3>
              <p className="package-description">{pkg.description}</p>
              <div className="package-included-icons"><CheckCircle2 size={14} strokeWidth={1.75} aria-hidden="true" /> Included services <XCircle size={14} strokeWidth={1.75} aria-hidden="true" /> Flexible exclusions</div>
              <div className="package-card-footer"><div><span className="from-label"><BadgeDollarSign size={13} strokeWidth={1.75} aria-hidden="true" /> From</span><strong className="price">Rs. {Number(pkg.price).toLocaleString()}</strong><span className="per-person"> / person</span></div>
            {pkg.id === hunzaPackage.id ? (
              <Link to="/destinations" className="btn-cta small"><Ticket size={15} strokeWidth={1.75} aria-hidden="true" /> Explore Hunza</Link>
            ) : user ? (
              <Link to={`/book/${pkg.id}`} className="btn-cta small"><Ticket size={15} strokeWidth={1.75} aria-hidden="true" /> Book Now</Link>
            ) : (
              <Link to="/login" className="btn-cta small"><Ticket size={15} strokeWidth={1.75} aria-hidden="true" /> Login to Book</Link>
            )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
