import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import kalashValley from '../assets/kalash-valley.jpg';
import northernAreas from '../assets/northern-areas.jpg';

/* ------------------------------------------------------------------ */
/*  Things you will probably want to edit                              */
/* ------------------------------------------------------------------ */

// Photos: swap these for your own files in src/assets
const IMAGES = {
  heroLeft: kalashValley,
  heroRight: northernAreas,
  side: northernAreas,
};

// Map location (any address or place name Google Maps understands)
const MAP_QUERY = 'Hunza Valley, Gilgit-Baltistan, Pakistan';

// Your API route for messages, relative to VITE_API_URL (example: '/contact').
// While this is empty the form only logs the data to the browser console.
const CONTACT_ENDPOINT = '';

/* ------------------------------------------------------------------ */
/*  Dotted world map texture for the hero                              */
/*  Each string is one latitude row (120 columns, hex encoded).        */
/*  A "1" bit means land, so a dot is drawn there.                     */
/* ------------------------------------------------------------------ */
const WORLD_ROWS = [
  '0000192fc7fff80000002003800000',
  '000018bec07ff800000201fff41000',
  '03c003cbf83fe0000c0037ffffff80',
  '87ffffffae3f80007fcff7ffffffff',
  '03ffffffbc1c0600effffffffffffe',
  '07fffff8300c0003dfffffffffff5c',
  '0083fff83a000022cfffffffffe040',
  '0000fffe3f0000209fffffffff80c0',
  '00007fffbf80005ffffffffffff080',
  '00001ffffc00001ffffffffffff000',
  '00001ffffc00001ffd7bffffffd000',
  '00001ffff800005df877ffffff9000',
  '00001fffe000007073fbfffff60000',
  '00001fffe000007097fbfffffa2000',
  '00000fffc000003e00fffffff0c000',
  '000007ff8000007f98fffffff90000',
  '000001f0800000fffef7fffff80000',
  '000000f0000001fffff8fffff00000',
  '00000060400001ffff7f1fdfc00000',
  '00000072080001ffff3e0f1e800000',
  '0000001e000003ffffbc0e1f080000',
  '00000003000003fffff00607000000',
  '000000011d0001fffff80601000000',
  '000000003f0000fffff80000040000',
  '000000003fe00043fff00008300000',
  '000000003fe00001ffe00006e00000',
  '000000007ff80001ffc00002688000',
  '000000007ffe0000ff800002007000',
  '000000007fff0000ff800000c03800',
  '000000003fff0000ff800000000000',
  '000000001ffe0000ffc80000019000',
  '000000000ffe0000ff98000007d800',
  '0000000007fe0000ff1000000ff800',
  '0000000007fc00007f3000003ffc00',
  '000000000ff000007e0000003ffe00',
  '000000000ff000007e0000003ffe00',
  '000000000fe000003c0000001ffe00',
  '000000000fc0000020000000103c00',
  '000000001f80000000000000001c02',
  '000000001e00000000000000000002',
  '000000000c00000000000000000004',
  '000000001c00000000000000000008',
  '000000001800000000000000000000',
  '000000001800000000000000000000',
  '000000000000000000000000000000',
];

const COLS = 120;
const GAP = 10;

const DOTS_PATH = WORLD_ROWS.map((hex, row) => {
  const bits = [...hex].map((h) => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
  let d = '';
  for (let col = 0; col < COLS; col += 1) {
    if (bits[col] === '1') d += `M${col * GAP + GAP / 2} ${row * GAP + GAP / 2}h0`;
  }
  return d;
}).join('');

const MAP_VIEWBOX = `0 0 ${COLS * GAP} ${WORLD_ROWS.length * GAP}`;

const EMPTY_FORM = { firstName: '', lastName: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Contact | Northern Place';
    return () => { document.title = previousTitle; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    setSending(true);
    setStatusText('Sending...');
    try {
      if (CONTACT_ENDPOINT) {
        await client.post(CONTACT_ENDPOINT, form);
      } else {
        console.log('Contact form data (no endpoint set):', form);
      }
      setForm(EMPTY_FORM);
      setStatusText('Thanks, your message has been sent.');
    } catch {
      setStatusText('Your message could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

  return (
    <div className="cu-page">
      {/* 1. Hero */}
      <section className="cu-hero" aria-labelledby="contactTitle">
        <svg className="cu-hero-map" viewBox={MAP_VIEWBOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d={DOTS_PATH} />
        </svg>

        <div className="cu-snap cu-snap-left" aria-hidden="true">
          <span className="cu-snap-img" style={{ backgroundImage: `url(${IMAGES.heroLeft})` }} />
        </div>
        <div className="cu-snap cu-snap-right" aria-hidden="true">
          <span className="cu-snap-img" style={{ backgroundImage: `url(${IMAGES.heroRight})` }} />
        </div>

        <div className="cu-hero-body">
          <h1 id="contactTitle">Contact</h1>
          <p>
            Questions about a tour, a package, or an existing booking?
            Send us a message and our team will get back to you.
          </p>
          <Link className="cu-btn" to="/destinations">Browse tours</Link>
        </div>
      </section>

      {/* 2. Photo + form */}
      <section className="cu-touch" aria-labelledby="touchTitle">
        <div
          className="cu-touch-photo"
          role="img"
          aria-label="Snow-capped peak above a green meadow in Northern Pakistan"
          style={{ backgroundImage: `url(${IMAGES.side})` }}
        />

        <div>
          <h2 id="touchTitle">Feel free to get in touch</h2>
          <p className="cu-touch-lead">
            Tell us where you want to go and when. We will help you pick the right destination and package.
          </p>

          <form className="cu-form" onSubmit={handleSubmit} noValidate>
            <div className="cu-field">
              <input
                type="text" id="firstName" name="firstName" placeholder=" "
                autoComplete="given-name" required value={form.firstName} onChange={handleChange}
              />
              <label htmlFor="firstName">First name</label>
            </div>
            <div className="cu-field">
              <input
                type="text" id="lastName" name="lastName" placeholder=" "
                autoComplete="family-name" required value={form.lastName} onChange={handleChange}
              />
              <label htmlFor="lastName">Last name</label>
            </div>
            <div className="cu-field cu-field-full">
              <input
                type="email" id="email" name="email" placeholder=" "
                autoComplete="email" required value={form.email} onChange={handleChange}
              />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="cu-field cu-field-full">
              <input
                type="text" id="subject" name="subject" placeholder=" "
                required value={form.subject} onChange={handleChange}
              />
              <label htmlFor="subject">Subject</label>
            </div>
            <div className="cu-field cu-field-full">
              <textarea
                id="message" name="message" placeholder=" "
                required value={form.message} onChange={handleChange}
              />
              <label htmlFor="message">Your message</label>
            </div>
            <div className="cu-form-actions">
              <button className="cu-btn" type="submit" disabled={sending}>Send message</button>
              <p className="cu-form-status" role="status" aria-live="polite">{statusText}</p>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Map */}
      <section className="cu-map" aria-label="Our location">
        <iframe
          title="Map showing our office location"
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>
    </div>
  );
}