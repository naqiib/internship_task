export default function Header({ title, subtitle, currentUser }) {
  return (
    <header className="header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
      {currentUser && (
        <div className="user-profile-badge">
          <span>Welcome, <strong>{currentUser.name}</strong></span>
        </div>
      )}
    </header>
  );
}