import React, { useState } from 'react';

export default function ProfileDashboard() {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState('dark');

  const [formData, setFormData] = useState({
    name: '',
    role: 'Frontend Developer',
    status: 'Active',
    bio: '',
    email: '',
    subscribeToNewsletter: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Dynamic Theme Palette
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    cardBg: isDark ? '#1e293b' : '#ffffff',
    previewBg: isDark ? '#111827' : '#f1f5f9',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    inputBg: isDark ? '#0f172a' : '#ffffff',
    accent: '#6366f1',
  };

  return (
    <div style={{ ...styles.appContainer, backgroundColor: colors.bg, color: colors.textPrimary }}>
      {/* 1. TOP NAVBAR */}
      <nav style={{ ...styles.navbar, backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div style={{ ...styles.logo, color: colors.accent }}>⚡ DevDashboard</div>
        
        {/* THEME TOGGLE BUTTON */}
        <button 
          onClick={toggleTheme} 
          style={{ ...styles.themeBtn, backgroundColor: isDark ? '#334155' : '#e2e8f0', color: colors.textPrimary }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      {/* MAIN BODY (SIDEBAR + CONTENT) */}
      <div style={styles.mainContent}>
        {/* 2. SIDEBAR */}
        <aside style={{ ...styles.sidebar, backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div style={styles.sidebarItemActive}>👤 User Profile</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>📊 Analytics</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>⚙️ Preferences</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>🔒 Security</div>
        </aside>

        {/* 3. DASHBOARD WORKSPACE */}
        <main style={styles.workspace}>
          <header style={styles.pageHeader}>
            <h2 style={{ margin: 0, color: colors.textPrimary }}>Manage Profile</h2>
            <p style={{ color: colors.textSecondary, marginTop: '0.25rem' }}>
              Update your personal information and toggle light/dark modes.
            </p>
          </header>

          <div style={styles.gridContainer}>
            {/* INPUT FORM PANEL */}
            <div style={{ ...styles.card, backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h3 style={{ ...styles.cardTitle, color: colors.textPrimary }}>Edit Information</h3>
              
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ali Khan"
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ali@example.com"
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>Role</label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Fullstack Engineer">Fullstack Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>Availability</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  >
                    <option value="Active">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Write a short summary..."
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border, resize: 'vertical' }}
                />
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="newsletter"
                  name="subscribeToNewsletter"
                  checked={formData.subscribeToNewsletter}
                  onChange={handleChange}
                />
                <label htmlFor="newsletter" style={{ ...styles.checkboxLabel, color: colors.textSecondary }}>
                  Subscribe to email notifications
                </label>
              </div>
            </div>

            {/* LIVE PREVIEW CARD */}
            <div style={{ ...styles.card, backgroundColor: colors.previewBg, borderColor: colors.border }}>
              <div style={styles.previewHeader}>
                <h3 style={{ ...styles.cardTitle, color: colors.textPrimary }}>Live Card Preview</h3>
                <span style={styles.liveBadge}>● LIVE</span>
              </div>

              <div style={styles.previewCardBody}>
                <div style={styles.avatar}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
                
                <h3 style={{ ...styles.profileName, color: colors.textPrimary }}>{formData.name || 'Your Name Here'}</h3>
                <p style={{ ...styles.profileRole, color: colors.textSecondary }}>{formData.role}</p>
                <p style={{ ...styles.profileEmail, color: colors.textSecondary }}>{formData.email || 'email@domain.com'}</p>

                <span style={formData.status === 'Active' ? styles.statusActive : styles.statusOffline}>
                  {formData.status}
                </span>

                {formData.bio && (
                  <div style={{ ...styles.bioContainer, backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <small style={{ color: colors.textSecondary, fontWeight: 'bold' }}>ABOUT</small>
                    <p style={{ ...styles.bioText, color: colors.textPrimary }}>{formData.bio}</p>
                  </div>
                )}

                {formData.subscribeToNewsletter && (
                  <div style={styles.newsletterBadge}>
                    🔔 Subscribed to updates
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 4. FOOTER */}
      <footer style={{ ...styles.footer, backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textSecondary }}>
        <p>© 2026 DevDashboard App. Theme Mode: <strong>{theme.toUpperCase()}</strong></p>
      </footer>
    </div>
  );
}

// INLINE STYLES
const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid' },
  logo: { fontSize: '1.25rem', fontWeight: 'bold' },
  themeBtn: { border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: '0.2s' },
  mainContent: { display: 'flex', flex: 1 },
  sidebar: { width: '220px', borderRight: '1px solid', padding: '1.5rem 1rem' },
  sidebarItem: { padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '0.5rem', cursor: 'pointer' },
  sidebarItemActive: { padding: '0.75rem 1rem', borderRadius: '6px', backgroundColor: '#6366f1', color: '#ffffff', fontWeight: 'bold', marginBottom: '0.5rem', cursor: 'pointer' },
  workspace: { flex: 1, padding: '2rem' },
  pageHeader: { marginBottom: '1.5rem' },
  gridContainer: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  card: { flex: 1, minWidth: '320px', borderRadius: '12px', padding: '1.5rem', border: '1px solid', transition: 'all 0.3s ease' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' },
  formGroup: { marginBottom: '1rem' },
  formRow: { display: 'flex', marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  checkboxGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' },
  checkboxLabel: { fontSize: '0.85rem', cursor: 'pointer' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: { backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '12px' },
  previewCardBody: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '1rem' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' },
  profileName: { margin: 0, fontSize: '1.2rem' },
  profileRole: { margin: '0.2rem 0', fontSize: '0.9rem' },
  profileEmail: { margin: '0 0 0.75rem 0', fontSize: '0.8rem' },
  statusActive: { padding: '0.2rem 0.6rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' },
  statusOffline: { padding: '0.2rem 0.6rem', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' },
  bioContainer: { marginTop: '1rem', width: '100%', textAlign: 'left', padding: '0.75rem', borderRadius: '6px', border: '1px solid' },
  bioText: { margin: '0.3rem 0 0 0', fontSize: '0.85rem' },
  newsletterBadge: { marginTop: '1rem', fontSize: '0.8rem', color: '#818cf8', backgroundColor: '#312e81', padding: '0.4rem 0.8rem', borderRadius: '6px' },
  footer: { textAlign: 'center', padding: '1rem', borderTop: '1px solid', fontSize: '0.85rem' }
};