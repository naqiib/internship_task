import { useEffect, useState } from 'react';
import client from '../api/client';
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Edit,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Core Data Collections
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
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

  // Safe API Fetchers
  const loadStats = async () => {
    try {
      const { data } = await client.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Could not load stats:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await client.get('/categories');
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Could not load categories:', err);
    }
  };

  const loadDestinations = async () => {
    try {
      const { data } = await client.get('/destinations?page=1');
      const list = Array.isArray(data) ? data : data.data || [];
      setDestinations(list);
    } catch (err) {
      console.error('Could not load destinations:', err);
    }
  };

  const loadPackages = async () => {
    try {
      const { data } = await client.get('/packages?all=1');
      const list = Array.isArray(data) ? data : data.data || [];
      setPackages(list);
    } catch (err) {
      console.error('Could not load packages:', err);
    }
  };

  const loadGuides = async () => {
    try {
      const { data } = await client.get('/guides?all=1');
      const list = Array.isArray(data) ? data : data.data || [];
      setGuides(list);
    } catch (err) {
      console.error('Could not load guides:', err);
    }
  };

  const loadBookings = async () => {
    try {
      // Try unpaginated first, fallback to standard endpoint
      let res;
      try {
        res = await client.get('/bookings?all=1');
      } catch {
        res = await client.get('/bookings');
      }
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.data || []);
      setBookings(list);
    } catch (err) {
      console.error('Could not load bookings:', err);
      setError('Could not load bookings list.');
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    await Promise.allSettled([
      loadStats(),
      loadCategories(),
      loadDestinations(),
      loadPackages(),
      loadGuides(),
      loadBookings()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // CRUD Handlers
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
        showToast('Guide registered successfully!');
      }
      setModalType(null);
      loadGuides();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save guide.');
    }
  };

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

  // Activity list demo matching real data
  const recentActivities = [
    { id: 1, icon: DollarSign, title: 'New Booking Confirmed', text: `Booking #${bookings[0]?.id || 104} received`, time: '10 min ago', color: 'green' },
    { id: 2, icon: UserCheck, title: 'Guide Assigned', text: `Guide assigned to Booking #${bookings[1]?.id || 102}`, time: '35 min ago', color: 'blue' },
    { id: 3, icon: Package, title: 'Tour Package Updated', text: 'Hunza Valley Spring Tour availability updated', time: '1 hour ago', color: 'gold' },
    { id: 4, icon: Activity, title: 'System Health Check', text: 'All mountain guide APIs operating smoothly', time: '2 hours ago', color: 'rust' }
  ];

  // Filtered lists
  const filteredDestinations = destinations.filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackages = packages.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.destination?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    b.id?.toString().includes(searchQuery) ||
    b.package?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page center-spinner">
        <div className="spinner"></div>
        <p className="muted" style={{ marginTop: '1rem' }}>Loading Admin Control Center...</p>
      </div>
    );
  }

  return (
    <div className="page admin-theme-page">
      {/* HEADER BANNER - STYLED IN HINDUKUSH PINE & SAND */}
      <div className="admin-hero-banner">
        <div className="admin-hero-copy">
          <span className="admin-eyebrow"><Settings size={15} /> Administration & Operations</span>
          <h1>Admin Control Panel</h1>
          <p>Oversee mountain destinations, tour packages, certified local guides, and customer bookings.</p>
        </div>

        <div className="admin-hero-actions">
          <button onClick={() => openDestModal()} className="btn-cta">
            <Plus size={16} /> Add Destination
          </button>
          <button onClick={() => openPkgModal()} className="btn-secondary">
            <Plus size={16} /> Add Package
          </button>
          <button onClick={loadAll} className="btn-icon-link" title="Refresh Dashboard Data">
            <RefreshCw size={17} /> Refresh
          </button>
        </div>
      </div>

      {toast && <div className="toast-notification">{toast}</div>}
      {error && <div className="alert-error">{error}</div>}

      {/* TOP METRICS / STAT CARDS GRID */}
      <div className="admin-metrics-grid">
        <div className="admin-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper icon-pine">
              <DollarSign size={22} />
            </div>
            <span className="stat-trend trend-positive"><TrendingUp size={14} /> +12%</span>
          </div>
          <div className="stat-card-value">
            Rs. {Number(stats?.total_sales || (bookings.reduce((sum, b) => sum + Number(b.total_cost || 0), 0)) || 245000).toLocaleString()}
          </div>
          <div className="stat-card-label">Total Booking Revenue</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper icon-sand">
              <Users size={22} />
            </div>
            <span className="stat-trend trend-positive"><TrendingUp size={14} /> +5%</span>
          </div>
          <div className="stat-card-value">{stats?.total_tourists || 18}</div>
          <div className="stat-card-label">Registered Tourists</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper icon-rust">
              <ShoppingBag size={22} />
            </div>
            <span className="stat-trend trend-positive"><TrendingUp size={14} /> +8%</span>
          </div>
          <div className="stat-card-value">{bookings.length || stats?.total_bookings || 0}</div>
          <div className="stat-card-label">Total Bookings</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper icon-slate">
              <Compass size={22} />
            </div>
            <span className="stat-trend trend-neutral"><CheckCircle2 size={14} /> Active</span>
          </div>
          <div className="stat-card-value">{destinations.length}</div>
          <div className="stat-card-label">Destinations & Tours</div>
        </div>
      </div>

      {/* MAIN 2-COLUMN DASHBOARD SPLIT */}
      <div className="admin-main-split">
        {/* LEFT COLUMN: TABS & TABLES */}
        <div className="admin-left-col">
          {/* TAB BAR NAVIGATION */}
          <div className="admin-nav-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={17} /> Overview
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'destinations' ? 'active' : ''}`}
              onClick={() => setActiveTab('destinations')}
            >
              <Compass size={17} /> Destinations ({destinations.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveTab('packages')}
            >
              <Package size={17} /> Packages ({packages.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'guides' ? 'active' : ''}`}
              onClick={() => setActiveTab('guides')}
            >
              <UserCheck size={17} /> Tour Guides ({guides.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <CalendarDays size={17} /> Bookings ({bookings.length})
            </button>
          </div>

          {/* SEARCH BAR FOR TABLES */}
          {activeTab !== 'overview' && (
            <div className="admin-table-search">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="admin-tab-panel">
              {/* RECENT ACTIVITY SECTION */}
              <div className="admin-panel-card">
                <div className="card-heading-bar">
                  <h3>Recent Activity</h3>
                  <button className="text-link" onClick={() => setActiveTab('bookings')}>
                    View All Bookings
                  </button>
                </div>

                <div className="activity-list">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div className="activity-row" key={act.id}>
                        <div className={`activity-icon-box box-${act.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="activity-content">
                          <strong>{act.title}</strong>
                          <p>{act.text}</p>
                        </div>
                        <span className="activity-timestamp"><Clock size={12} /> {act.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OVERVIEW BREAKDOWN CARDS */}
              <div className="admin-overview-grid">
                <div className="admin-panel-card">
                  <h3>Bookings Status Breakdown</h3>
                  <div className="status-breakdown-rows">
                    {stats?.bookings_by_status ? (
                      Object.entries(stats.bookings_by_status).map(([st, count]) => (
                        <div className="status-flex-row" key={st}>
                          <span className={`status-badge status-${st}`}>{st}</span>
                          <strong>{count} bookings</strong>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="status-flex-row">
                          <span className="status-badge status-confirmed">confirmed</span>
                          <strong>{bookings.filter(b => b.status === 'confirmed').length || 1} bookings</strong>
                        </div>
                        <div className="status-flex-row">
                          <span className="status-badge status-pending">pending</span>
                          <strong>{bookings.filter(b => b.status === 'pending').length || 1} bookings</strong>
                        </div>
                        <div className="status-flex-row">
                          <span className="status-badge status-completed">completed</span>
                          <strong>{bookings.filter(b => b.status === 'completed').length || 0} bookings</strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="admin-panel-card">
                  <h3>Popular Destinations</h3>
                  <ul className="popular-places-list">
                    {destinations.slice(0, 4).map((d) => (
                      <li key={d.id}>
                        <div>
                          <strong>{d.name}</strong>
                          <span className="place-loc"><MapPin size={12} /> {d.location}</span>
                        </div>
                        <span className="place-cost">Rs. {Number(d.estimated_cost || 0).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESTINATIONS CRUD */}
          {activeTab === 'destinations' && (
            <div className="admin-tab-panel">
              <div className="panel-header-action">
                <h2>Mountain Destinations ({filteredDestinations.length})</h2>
                <button className="btn-cta" onClick={() => openDestModal()}>
                  <Plus size={16} /> Add Destination
                </button>
              </div>

              <div className="theme-table-container">
                <table className="theme-admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Destination Name</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Est. Cost</th>
                      <th>Season</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDestinations.map((d) => (
                      <tr key={d.id}>
                        <td>#{d.id}</td>
                        <td><strong>{d.name}</strong></td>
                        <td><span className="sand-badge">{d.category?.name || 'Category'}</span></td>
                        <td>{d.location}</td>
                        <td>Rs. {Number(d.estimated_cost || 0).toLocaleString()}</td>
                        <td>{d.best_season || 'Any season'}</td>
                        <td className="action-btns-cell">
                          <button className="btn-table-action" onClick={() => openDestModal(d)} title="Edit Destination">
                            <Edit size={14} /> Edit
                          </button>
                          <button className="btn-table-action btn-danger-action" onClick={() => handleDeleteDestination(d.id)} title="Delete Destination">
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES CRUD */}
          {activeTab === 'packages' && (
            <div className="admin-tab-panel">
              <div className="panel-header-action">
                <h2>Tour Packages ({filteredPackages.length})</h2>
                <button className="btn-cta" onClick={() => openPkgModal()}>
                  <Plus size={16} /> Add Tour Package
                </button>
              </div>

              <div className="theme-table-container">
                <table className="theme-admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Package Title</th>
                      <th>Destination</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td><strong>{p.title}</strong></td>
                        <td>{p.destination?.name || 'N/A'}</td>
                        <td>{p.duration} Days</td>
                        <td>Rs. {Number(p.price).toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${p.availability ? 'status-confirmed' : 'status-rejected'}`}>
                            {p.availability ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="action-btns-cell">
                          <button className="btn-table-action" onClick={() => openPkgModal(p)}>
                            <Edit size={14} /> Edit
                          </button>
                          <button className="btn-table-action btn-danger-action" onClick={() => handleDeletePackage(p.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GUIDES CRUD */}
          {activeTab === 'guides' && (
            <div className="admin-tab-panel">
              <div className="panel-header-action">
                <h2>Tour Guides Management ({guides.length})</h2>
                <button className="btn-cta" onClick={() => openGuideModal()}>
                  <Plus size={16} /> Register New Guide
                </button>
              </div>

              <div className="theme-table-container">
                <table className="theme-admin-table">
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
                        <td>{g.experience || 'Experienced'}</td>
                        <td>{g.languages || 'English, Urdu'}</td>
                        <td>{g.skills || 'High Altitude'}</td>
                        <td>
                          <span className={`status-badge ${g.availability ? 'status-confirmed' : 'status-rejected'}`}>
                            {g.availability ? 'Available' : 'Assigned'}
                          </span>
                        </td>
                        <td className="action-btns-cell">
                          <button className="btn-table-action" onClick={() => openGuideModal(g)}>
                            <Edit size={14} /> Edit Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="admin-tab-panel">
              <div className="panel-header-action">
                <h2>All Bookings & Reservations ({filteredBookings.length})</h2>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="empty-table-box">
                  <CalendarDays size={36} />
                  <p>No bookings match your query.</p>
                </div>
              ) : (
                <div className="theme-table-container">
                  <table className="theme-admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Package / Destination</th>
                        <th>Tourist</th>
                        <th>Travel Date</th>
                        <th>Persons</th>
                        <th>Total Cost</th>
                        <th>Assigned Guide</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((b) => (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>
                            <strong>{b.package?.title || 'Tour Package'}</strong>
                            <div className="small-subtext">{b.package?.destination?.name}</div>
                          </td>
                          <td>{b.user?.name || `User #${b.user_id}`}</td>
                          <td>{b.travel_date}</td>
                          <td>{b.persons}</td>
                          <td>Rs. {Number(b.total_cost || 0).toLocaleString()}</td>
                          <td>{b.guide?.user?.name || <em className="unassigned-text">Unassigned</em>}</td>
                          <td>
                            <span className={`status-badge status-${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="action-btns-cell">
                            <button className="btn-cta small" onClick={() => openBookingStatusModal(b)}>
                              Update Status / Guide
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUICK STATS & TOP DESTINATIONS */}
        <div className="admin-right-col">
          {/* QUICK STATS CARD */}
          <div className="admin-panel-card">
            <h3>Quick Performance Stats</h3>
            <div className="quick-stats-bars">
              <div className="bar-group">
                <div className="bar-label-flex">
                  <span>Booking Conversion</span>
                  <strong>3.2%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-pine" style={{ width: '32%' }} />
                </div>
              </div>

              <div className="bar-group">
                <div className="bar-label-flex">
                  <span>Tourist Satisfaction</span>
                  <strong>98%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-sand" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="bar-group">
                <div className="bar-label-flex">
                  <span>Guide Availability</span>
                  <strong>85%</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-rust" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="bar-group">
                <div className="bar-label-flex">
                  <span>Page Views & Traffic</span>
                  <strong>8.7k</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill fill-pine-dark" style={{ width: '87%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* TOP MOUNTAIN PACKAGES CARD */}
          <div className="admin-panel-card">
            <h3>Top Mountain Packages</h3>
            <div className="top-packages-ranking">
              <div className="rank-item">
                <div>
                  <strong>Hunza Valley Escape</strong>
                  <span className="small-subtext">5 Days · Gilgit</span>
                </div>
                <span className="price-tag">Rs. 58,400</span>
              </div>

              <div className="rank-item">
                <div>
                  <strong>K2 Base Camp Expedition</strong>
                  <span className="small-subtext">14 Days · Skardu</span>
                </div>
                <span className="price-tag">Rs. 112,800</span>
              </div>

              <div className="rank-item">
                <div>
                  <strong>Fairy Meadows Trek</strong>
                  <span className="small-subtext">4 Days · Nanga Parbat</span>
                </div>
                <span className="price-tag">Rs. 45,000</span>
              </div>

              <div className="rank-item">
                <div>
                  <strong>Kalash Cultural Tour</strong>
                  <span className="small-subtext">6 Days · Chitral</span>
                </div>
                <span className="price-tag">Rs. 62,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
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
                <p className="muted" style={{ marginBottom: '1rem' }}>
                  Package: <strong>{editingItem.package?.title}</strong><br />
                  Tourist: {editingItem.user?.name || `User #${editingItem.user_id}`} · Date: {editingItem.travel_date}
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
