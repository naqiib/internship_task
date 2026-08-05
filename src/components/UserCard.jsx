export default function UserCard({ avatar, name, role, email, status = "Offline" }) {
  const isOnline = status.toLowerCase() === "online";

  return (
    <div className="user-card">
      <div className="avatar-wrapper">
        <img src={avatar} alt={`${name}'s avatar`} className="avatar" />
        <span className={`status-indicator ${isOnline ? "online" : "offline"}`} />
      </div>
      <div className="user-info">
        <h3>{name}</h3>
        <p className="role">{role}</p>
        <p className="email">{email}</p>
      </div>
    </div>
  );
}