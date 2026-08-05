export default function Footer({ name, year, heading, lede, socialLinks }) {
  return (
    <footer id="contact" className="contact">
      <p className="eyebrow">// contact</p>
      <h2>{heading}</h2>
      <p className="contact__lede">{lede}</p>
      <div className="contact__actions">
        {socialLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${i === 0 ? "btn--primary" : "btn--ghost"}`}
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="contact__copyright">© {year} {name}</p>
    </footer>
  );
}