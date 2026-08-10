import React, { useState } from 'react';

export default function NaqibPortfolioDashboard() {
  const [theme, setTheme] = useState('dark');

  // Naqib's Portfolio State
  const [formData, setFormData] = useState({
    name: 'Naqib',
    title: 'Computer Science Student',
    university: 'Air University, Islamabad',
    semester: '7th Semester',
    company: 'Hindukushsoft Technology',
    role: 'Software Engineer Intern',
    bio: 'CS student passionate about full-stack web development and software engineering. Currently building real-world solutions as an intern.',
    skills: 'React.js, JavaScript, Python, Node.js',
    status: 'Open to Work',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
        <div style={{ ...styles.logo, color: colors.accent }}>👨‍💻 Naqib.dev</div>
        
        <button 
          onClick={toggleTheme} 
          style={{ ...styles.themeBtn, backgroundColor: isDark ? '#334155' : '#e2e8f0', color: colors.textPrimary }}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      {/* MAIN BODY */}
      <div style={styles.mainContent}>
        {/* 2. SIDEBAR */}
        <aside style={{ ...styles.sidebar, backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div style={styles.sidebarItemActive}>👤 Profile Card</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>🎓 Academic Info</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>💼 Internship</div>
          <div style={{ ...styles.sidebarItem, color: colors.textSecondary }}>🚀 Projects</div>
        </aside>

        {/* 3. DASHBOARD WORKSPACE */}
        <main style={styles.workspace}>
          <header style={styles.pageHeader}>
            <h2 style={{ margin: 0, color: colors.textPrimary }}>Portfolio Editor & Live Preview</h2>
            <p style={{ color: colors.textSecondary, marginTop: '0.25rem' }}>
              Air University Islamabad • 7th Semester • Intern @ Hindukushsoft Technology
            </p>
          </header>

          <div style={styles.gridContainer}>
            {/* INPUT FORM PANEL */}
            <div style={{ ...styles.card, backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h3 style={{ ...styles.cardTitle, color: colors.textPrimary }}>Edit Portfolio Details</h3>
              
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>Internship Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ ...styles.label, color: colors.textSecondary }}>Intern Role</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: colors.textSecondary }}>Short Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  style={{ ...styles.input, backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.border, resize: 'vertical' }}
                />
              </div>
            </div>

            {/* LIVE PORTFOLIO PREVIEW CARD */}
            <div style={{ ...styles.card, backgroundColor: colors.previewBg, borderColor: colors.border }}>
              <div style={styles.previewHeader}>
                <h3 style={{ ...styles.cardTitle, color: colors.textPrimary }}>Live Portfolio Preview</h3>
                <span style={styles.liveBadge}>● LIVE CARD</span>
              </div>

              <div style={styles.previewCardBody}>
                {/* Avatar */}
                <div style={styles.avatar}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'N'}
                </div>
                
                <h3 style={{ ...styles.profileName, color: colors.textPrimary }}>{formData.name || 'Naqib'}</h3>
                <p style={{ ...styles.profileRole, color: colors.accent }}>{formData.title}</p>

                {/* Academic Tag */}
                <div style={{ ...styles.tagBox, backgroundColor: colors.cardBg, borderColor: colors.border }}>
                  🎓 <strong>{formData.university}</strong> ({formData.semester})
                </div>

                {/* Internship Tag */}
                <div style={{ ...styles.tagBox, backgroundColor: colors.cardBg, borderColor: colors.border, marginTop: '0.5rem' }}>
                  💼 <strong>{formData.role}</strong> at <span style={{ color: '#10b981', fontWeight: 'bold' }}>{formData.company}</span>
                </div>

                {/* Skills */}
                {formData.skills && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {formData.skills.split(',').map((skill, index) => (
                      <span key={index} style={styles.skillBadge}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio Display */}
                {formData.bio && (
                  <div style={{ ...styles.bioContainer, backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <small style={{ color: colors.textSecondary, fontWeight: 'bold' }}>ABOUT NAQIB</small>
                    <p style={{ ...styles.bioText, color: colors.textPrimary }}>{formData.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 4. FOOTER */}
      <footer style={{ ...styles.footer, backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.textSecondary }}>
        <p>© 2026 Naqib | Air University Islamabad | Intern @ Hindukushsoft Technology</p>
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
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  liveBadge: { backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '12px' },
  previewCardBody: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '1rem' },
  avatar: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' },
  profileName: { margin: 0, fontSize: '1.3rem' },
  profileRole: { margin: '0.2rem 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 'bold' },
  tagBox: { fontSize: '0.82rem', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid', width: '90%' },
  skillBadge: { backgroundColor: '#eeeffe', color: '#4f46e5', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' },
  bioContainer: { marginTop: '1rem', width: '90%', textAlign: 'left', padding: '0.75rem', borderRadius: '6px', border: '1px solid' },
  bioText: { margin: '0.3rem 0 0 0', fontSize: '0.85rem' },
  footer: { textAlign: 'center', padding: '1rem', borderTop: '1px solid', fontSize: '0.85rem' }
};