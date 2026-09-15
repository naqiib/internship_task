import { useEffect, useState } from 'react';
import client from '../api/client';
import { BarChart3, CalendarDays, Compass, Package, RefreshCw, Settings, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Stats & Core Collections
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Common UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Modal Controls
  const [modalType, setModalType] = useState(null); // 'destination' | 'package' | 'guide' | 'bookingStatus'
  const [editingItem, setEditingItem] = useState(null);

  // Forms
  const [destForm, setDestForm] = useState({
    name: '', category_id: '', location: '', description: '', estimated_cost: '', best_season: '', latitude: '', longitude: ''
  });
  const [pkgForm, setPkgForm] = useState({
    destination_id: '', title: '', description: '', duration: 1, price: 0, included_services: '', availability: true
  });
  const [guideForm, setGuideForm] = useState({
    user_id: '', experience: '', languages: '', skills: '', availability: true
  });
  const [bookingStatusForm, setBookingStatusForm] = useState({
    status: 'pending', guide_id: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Load Overview Data
  const loadStats = () => {
    client.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Could not load dashboard stats.'));
  };

  // Load Categories
  const loadCategories = () => {
    client.get('/categories')
      .then(({ data }) => {
        setCategories(data);
        if (data.length && !destForm.category_id) {
          setDestForm((f) => ({ ...f, category_id: data[0].id }));
        }
      })
      .catch(() => {});
  };

  // Load Destinations
  const loadDestinations = () => {
    client.get('/destinations?page=1')
      .then(({ data }) => {
        const list = data.data || data;
        setDestinations(list);
        if (list.length && !pkgForm.destination_id) {
          setPkgForm((f) => ({ ...f, destination_id: list[0].id }));
        }
      })
      .catch(() => setError('Could not load destinations.'));
  };

  // Load Packages
  const loadPackages = () => {
    client.get('/packages?all=1')
      .then(({ data }) => setPackages(data.data || data))
      .catch(() => setError('Could not load tour packages.'));
  };

  // Load Guides
  const loadGuides = () => {
    client.get('/guides?all=1')
      .then(({ data }) => setGuides(data.data || data))
      .catch(() => setError('Could not load guides.'));
  };

  // Load Bookings
  const loadBookings = () => {
    client.get('/bookings')
      .then(({ data }) => setBookings(data.data || data))
      .catch(() => setError('Could not load bookings.'));
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        loadStats(),
        loadCategories(),
        loadDestinations(),
        loadPackages(),
        loadGuides(),
        loadBookings()
      ]);
    } catch {
      setError('Error loading administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ----------------------------------------------------
  // DESTINATION CRUD HANDLERS
  // ----------------------------------------------------
  const openDestModal = (dest = null) => {
    setEditingItem(dest);
    if (dest) {
      setDestForm({
        name: dest.name || '',
        category_id: dest.category_id || (categories[0]?.id || ''),
        location: dest.location || '',
        description: dest.description || '',
        estimated_cost: dest.estimated_cost || '',
        best_season: dest.best_season || '',
        latitude: dest.latitude || '',
        longitude: dest.longitude || ''
      });
    } else {
      setDestForm({
        name: '', category_id: categories[0]?.id || '', location: '', description: '', estimated_cost: '', best_season: '', latitude: '', longitude: ''
      });
    }
    setModalType('destination');
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await client.put(`/destinations/${editingItem.id}`, destForm);
        showToast('Destination updated successfully!');
      } else {
        await client.post('/destinations', destForm);
        showToast('Destination created successfully!');
      }
      setModalType(null);
      loadDestinations();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save destination.');
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await client.delete(`/destinations/${id}`);
      showToast('Destination deleted.');
      loadDestinations();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete destination.');
    }
  };

  // ----------------------------------------------------
  // PACKAGE CRUD HANDLERS
  // ----------------------------------------------------
  const openPkgModal = (pkg = null) => {
    setEditingItem(pkg);
    if (pkg) {
      setPkgForm({
        destination_id: pkg.destination_id || (destinations[0]?.id || ''),
        title: pkg.title || '',
        description: pkg.description || '',
        duration: pkg.duration || 1,
        price: pkg.price || 0,
        included_services: pkg.included_services || '',
        availability: pkg.availability ?? true
      });
    } else {
      setPkgForm({
        destination_id: destinations[0]?.id || '', title: '', description: '', duration: 1, price: 0, included_services: '', availability: true
      });
    }
    setModalType('package');
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await client.put(`/packages/${editingItem.id}`, pkgForm);
        showToast('Tour package updated successfully!');
      } else {
        await client.post('/packages', pkgForm);
        showToast('Tour package created successfully!');
      }
      setModalType(null);
      loadPackages();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package.');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await client.delete(`/packages/${id}`);
      showToast('Package deleted.');
      loadPackages();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete package.');
    }
  };

  // ----------------------------------------------------
  // GUIDE CRUD HANDLERS
  // ----------------------------------------------------
  const openGuideModal = (guide = null) => {
    setEditingItem(guide);
    if (guide) {
      setGuideForm({
        user_id: guide.user_id || '',
        experience: guide.experience || '',
        languages: guide.languages || '',
        skills: guide.skills || '',
        availability: guide.availability ?? true
      });
    } else {
      setGuideForm({
        user_id: '', experience: '', languages: '', skills: '', availability: true
      });
    }
    setModalType('guide');
  };

  const handleSaveGuide = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await client.put(`/guides/${editingItem.id}`, guideForm);
        showToast('Guide profile updated!');
      } else {
        await client.post('/guides', guideForm);
        showToast('Guide created successfully!');
      }
      setModalType(null);
      loadGuides();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save guide.');
    }
  };

  // ----------------------------------------------------
  // BOOKING STATUS & GUIDE ASSIGNMENT
  // ----------------------------------------------------
  const openBookingStatusModal = (booking) => {
    setEditingItem(booking);
    setBookingStatusForm({
      status: booking.status || 'pending',
      guide_id: booking.guide_id || ''
    });
    setModalType('bookingStatus');
  };

  const handleSaveBookingStatus = async (e) => {
    e.preventDefault();
    try {
      await client.patch(`/bookings/${editingItem.id}/status`, {
        status: bookingStatusForm.status,
        guide_id: bookingStatusForm.guide_id || null
      });
      showToast(`Booking #${editingItem.id} updated!`);
      setModalType(null);
      loadBookings();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    }
  };

  if (loading) {
    return (
      <div className="page center-spinner">
        <div className="spinner"></div>
        <p className="muted" style={{ marginTop: '1rem' }}>Loading Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="page admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="title-with-icon"><Settings size={28} aria-hidden="true" /> Admin Control Panel</h1>
          <p className="muted">Manage destinations, tour packages, guides, and bookings</p>
        </div>
        <button onClick={loadAll} className="btn-secondary icon-button"><RefreshCw size={16} aria-hidden="true" /> Refresh Data</button>
      </div>

      {toast && <div className="toast-notification">{toast}</div>}
      {error && <div className="alert-error">{error}</div>}

      {/* ADMIN TABS NAV */}
      <div className="admin-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
          <BarChart3 size={17} aria-hidden="true" /> Overview
        </button>
        <button className={activeTab === 'destinations' ? 'active' : ''} onClick={() => setActiveTab('destinations')}>
          <Compass size={17} aria-hidden="true" /> Destinations ({destinations.length})
        </button>
        <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>
          <Package size={17} aria-hidden="true" /> Tour Packages ({packages.length})
        </button>
        <button className={activeTab === 'guides' ? 'active' : ''} onClick={() => setActiveTab('guides')}>
          <Users size={17} aria-hidden="true" /> Guides ({guides.length})
        </button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
          <CalendarDays size={17} aria-hidden="true" /> Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && stats && (
        <div className="tab-content">
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.total_users}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_tourists}</span>
              <span className="stat-label">Tourists</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_guides}</span>
              <span className="stat-label">Tour Guides</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_destinations}</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_packages}</span>
              <span className="stat-label">Tour Packages</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.total_bookings}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="dashboard-columns">
            <div className="card">
              <h3>Bookings Status Breakdown</h3>
              <div className="status-list">
                {Object.entries(stats.bookings_by_status || {}).map(([st, count]) => (
                  <div key={st} className="status-row">
                    <span className={`status-badge status-${st}`}>{st}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Popular Destinations</h3>
              {stats.popular_destinations?.length ? (
                <ul className="simple-list">
                  {stats.popular_destinations.map((d) => (
                    <li key={d.id}>
                      <strong>{d.name}</strong>
                      <span className="muted"> {d.location}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No popular destination data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESTINATIONS CRUD */}
      {activeTab === 'destinations' && (
        <div className="tab-content">
          <div className="action-bar">
            <h2>Destinations Management</h2>
            <button className="btn-cta" onClick={() => openDestModal()}>+ Add New Destination</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Est. Cost</th>
                <th>Best Season</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((d) => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td><strong>{d.name}</strong></td>
                  <td><span className="badge">{d.category?.name || 'N/A'}</span></td>
                  <td>{d.location}</td>
                  <td>Rs. {Number(d.estimated_cost || 0).toLocaleString()}</td>
                  <td>{d.best_season || 'Any'}</td>
                  <td>
                    <button className="btn-small btn-secondary" onClick={() => openDestModal(d)}>Edit</button>
                    <button className="btn-small btn-danger" onClick={() => handleDeleteDestination(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PACKAGES CRUD */}
      {activeTab === 'packages' && (
        <div className="tab-content">
          <div className="action-bar">
            <h2>Tour Packages Management</h2>
            <button className="btn-cta" onClick={() => openPkgModal()}>+ Add Tour Package</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.destination?.name || 'N/A'}</td>
                  <td>{p.duration} days</td>
                  <td>Rs. {Number(p.price).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${p.availability ? 'status-confirmed' : 'status-rejected'}`}>
                      {p.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small btn-secondary" onClick={() => openPkgModal(p)}>Edit</button>
                    <button className="btn-small btn-danger" onClick={() => handleDeletePackage(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: GUIDES CRUD */}
      {activeTab === 'guides' && (
        <div className="tab-content">
          <div className="action-bar">
            <h2>Tour Guides Management</h2>
            <button className="btn-cta" onClick={() => openGuideModal()}>+ Register New Guide</button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guide Name</th>
                <th>Experience</th>
                <th>Languages</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((g) => (
                <tr key={g.id}>
                  <td>#{g.id}</td>
                  <td><strong>{g.user?.name || `User #${g.user_id}`}</strong></td>
                  <td>{g.experience || 'Not specified'}</td>
                  <td>{g.languages || 'N/A'}</td>
                  <td>{g.skills || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${g.availability ? 'status-confirmed' : 'status-rejected'}`}>
                      {g.availability ? 'Available' : 'Busy'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small btn-secondary" onClick={() => openGuideModal(g)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="tab-content">
          <h2>All Bookings ({bookings.length})</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Package / Destination</th>
                <th>Tourist ID</th>
                <th>Travel Date</th>
                <th>Persons</th>
                <th>Total Cost</th>
                <th>Assigned Guide</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <strong>{b.package?.title}</strong>
                    <div className="muted">{b.package?.destination?.name}</div>
                  </td>
                  <td>User #{b.user_id}</td>
                  <td>{b.travel_date}</td>
                  <td>{b.persons}</td>
                  <td>Rs. {Number(b.total_cost).toLocaleString()}</td>
                  <td>{b.guide?.user?.name || <em className="muted">Unassigned</em>}</td>
                  <td>
                    <span className={`status-badge status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-small btn-cta" onClick={() => openBookingStatusModal(b)}>
                      Update Status / Guide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL OVERLAY */}
      {modalType && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* DESTINATION MODAL */}
            {modalType === 'destination' && (
              <form onSubmit={handleSaveDestination}>
                <h3>{editingItem ? 'Edit Destination' : 'Add New Destination'}</h3>
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={destForm.name}
                  onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                />

                <label>Category</label>
                <select
                  value={destForm.category_id}
                  onChange={(e) => setDestForm({ ...destForm, category_id: e.target.value })}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <label>Location</label>
                <input
                  type="text"
                  required
                  value={destForm.location}
                  onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                />

                <div className="form-row">
                  <div>
                    <label>Est. Cost (Rs.)</label>
                    <input
                      type="number"
                      value={destForm.estimated_cost}
                      onChange={(e) => setDestForm({ ...destForm, estimated_cost: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Best Season</label>
                    <input
                      type="text"
                      placeholder="e.g. May - Oct"
                      value={destForm.best_season}
                      onChange={(e) => setDestForm({ ...destForm, best_season: e.target.value })}
                    />
                  </div>
                </div>

                <label>Description</label>
                <textarea
                  rows="3"
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                />

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                  <button type="submit" className="btn-cta">Save Destination</button>
                </div>
              </form>
            )}

            {/* TOUR PACKAGE MODAL */}
            {modalType === 'package' && (
              <form onSubmit={handleSavePackage}>
                <h3>{editingItem ? 'Edit Tour Package' : 'Add Tour Package'}</h3>
                <label>Destination</label>
                <select
                  value={pkgForm.destination_id}
                  onChange={(e) => setPkgForm({ ...pkgForm, destination_id: e.target.value })}
                  required
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.location})</option>
                  ))}
                </select>

                <label>Package Title</label>
                <input
                  type="text"
                  required
                  value={pkgForm.title}
                  onChange={(e) => setPkgForm({ ...pkgForm, title: e.target.value })}
                />

                <div className="form-row">
                  <div>
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={pkgForm.duration}
                      onChange={(e) => setPkgForm({ ...pkgForm, duration: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label>Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={pkgForm.price}
                      onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <label>Description</label>
                <textarea
                  rows="2"
                  value={pkgForm.description}
                  onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                />

                <label>Included Services</label>
                <input
                  type="text"
                  placeholder="Hotel, Meals, Transport"
                  value={pkgForm.included_services}
                  onChange={(e) => setPkgForm({ ...pkgForm, included_services: e.target.value })}
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={pkgForm.availability}
                    onChange={(e) => setPkgForm({ ...pkgForm, availability: e.target.checked })}
                  />
                  Available for booking
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                  <button type="submit" className="btn-cta">Save Package</button>
                </div>
              </form>
            )}

            {/* GUIDE MODAL */}
            {modalType === 'guide' && (
              <form onSubmit={handleSaveGuide}>
                <h3>{editingItem ? 'Edit Guide Profile' : 'Register Guide'}</h3>
                {!editingItem && (
                  <>
                    <label>User ID</label>
                    <input
                      type="number"
                      required
                      placeholder="User ID of registered guide"
                      value={guideForm.user_id}
                      onChange={(e) => setGuideForm({ ...guideForm, user_id: e.target.value })}
                    />
                  </>
                )}

                <label>Experience</label>
                <input
                  type="text"
                  placeholder="e.g. 5 years in Trekking"
                  value={guideForm.experience}
                  onChange={(e) => setGuideForm({ ...guideForm, experience: e.target.value })}
                />

                <label>Languages</label>
                <input
                  type="text"
                  placeholder="English, Urdu, Khowar"
                  value={guideForm.languages}
                  onChange={(e) => setGuideForm({ ...guideForm, languages: e.target.value })}
                />

                <label>Skills</label>
                <input
                  type="text"
                  placeholder="First Aid, High-altitude climbing"
                  value={guideForm.skills}
                  onChange={(e) => setGuideForm({ ...guideForm, skills: e.target.value })}
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={guideForm.availability}
                    onChange={(e) => setGuideForm({ ...guideForm, availability: e.target.checked })}
                  />
                  Available for assignment
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                  <button type="submit" className="btn-cta">Save Guide Profile</button>
                </div>
              </form>
            )}

            {/* BOOKING STATUS MODAL */}
            {modalType === 'bookingStatus' && editingItem && (
              <form onSubmit={handleSaveBookingStatus}>
                <h3>Update Booking #{editingItem.id}</h3>
                <p className="muted">
                  Package: <strong>{editingItem.package?.title}</strong><br />
                  Tourist ID: User #{editingItem.user_id} · Date: {editingItem.travel_date}
                </p>

                <label>Booking Status</label>
                <select
                  value={bookingStatusForm.status}
                  onChange={(e) => setBookingStatusForm({ ...bookingStatusForm, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <label>Assign Tour Guide</label>
                <select
                  value={bookingStatusForm.guide_id}
                  onChange={(e) => setBookingStatusForm({ ...bookingStatusForm, guide_id: e.target.value })}
                >
                  <option value="">-- No Guide Assigned --</option>
                  {guides.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.user?.name || `Guide #${g.id}`} ({g.experience || 'Guide'})
                    </option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                  <button type="submit" className="btn-cta">Save Booking Update</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
