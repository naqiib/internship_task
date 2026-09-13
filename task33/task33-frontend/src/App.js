import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load items.");
      setItems(result.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      `${item.name} ${item.description || ""}`.toLowerCase().includes(query)
    );
  }, [items, search]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
  };

  const submitRequest = async (url, options, successMessage) => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : result.message;
        throw new Error(validationMessage || "The request could not be completed.");
      }
      resetForm();
      setNotice(successMessage);
      await fetchItems();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter an item name.");
      return;
    }
    submitRequest(
      editId ? `${API_URL}/${editId}` : API_URL,
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      },
      editId ? "Item updated successfully." : "Item added successfully."
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to delete item.");
      if (editId === id) resetForm();
      setNotice("Item deleted successfully.");
      await fetchItems();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Edit item - populate form
  const handleEdit = (item) => {
    setError(null);
    setNotice("");
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description || "");
  };

  return (
    <main className="app-shell">
      <div className="ambient-shape ambient-shape-one" />
      <div className="ambient-shape ambient-shape-two" />
      <div className="workspace">
        <header className="topbar">
          <div className="brand-lockup"><div className="brand-mark">N</div><div><p className="eyebrow">TASK 33 / CRUD WORKSPACE</p><p className="brand-name">Naqib&apos;s item desk</p></div></div>
          <span className="api-status"><span className="status-dot" /> Laravel API connected</span>
        </header>
        <section className="intro">
          <div><p className="eyebrow accent">YOUR COLLECTION, ORGANIZED</p><h1>Keep the little things<br /><em>moving forward.</em></h1><p className="intro-copy">A simple place to capture, update, and clear your work. Built by Naqib with React and Laravel.</p></div>
          <div className="stats" aria-label="Item statistics"><div className="stat-card"><span className="stat-value">{items.length}</span><span className="stat-label">Total items</span></div><div className="stat-card"><span className="stat-value">{visibleItems.length}</span><span className="stat-label">Showing now</span></div></div>
        </section>
        {(error || notice) && <div className={`feedback ${error ? "feedback-error" : "feedback-success"}`} role="status"><span>{error ? "!" : "✓"}</span> {error || notice}<button type="button" className="dismiss-button" onClick={() => { setError(null); setNotice(""); }} aria-label="Dismiss message">×</button></div>}
        <section className="content-grid">
          <div className="panel list-panel">
            <div className="panel-heading"><div><p className="eyebrow">YOUR ITEMS</p><h2>Collection</h2></div><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search items" aria-label="Search items" /></label></div>
            {loading ? <div className="state-message"><span className="loader" /> Loading your collection...</div> : visibleItems.length === 0 ? <div className="state-message empty-state"><span className="empty-icon">○</span><strong>{search ? "No matching items" : "Your collection is empty"}</strong><span>{search ? "Try a different search term." : "Add your first item from the form."}</span></div> : <div className="items-list">{visibleItems.map((item, index) => <article className="item-row" key={item.id}><div className="item-index">{String(index + 1).padStart(2, "0")}</div><div className="item-content"><h3>{item.name}</h3><p>{item.description || "No description added yet."}</p></div><div className="item-actions"><button type="button" className="icon-button" onClick={() => handleEdit(item)} aria-label={`Edit ${item.name}`}>Edit</button><button type="button" className="icon-button danger" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} aria-label={`Delete ${item.name}`}>{deletingId === item.id ? "..." : "Delete"}</button></div></article>)}</div>}
          </div>
          <aside className="panel form-panel">
            <div className="form-heading"><span className="form-symbol">{editId ? "↗" : "+"}</span><div><p className="eyebrow">{editId ? "EDIT MODE" : "NEW ENTRY"}</p><h2>{editId ? "Update item" : "Add an item"}</h2></div></div>
            <form onSubmit={handleSubmit}><label htmlFor="item-name">Name <span>*</span></label><input id="item-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Plan next sprint" maxLength="255" required /><label htmlFor="item-description">Description <small>Optional</small></label><textarea id="item-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context..." rows="5" /><button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : editId ? "Save changes" : "Add to collection"}<span>→</span></button>{editId && <button className="cancel-button" type="button" onClick={resetForm}>Cancel editing</button>}</form>
            <p className="form-note">Changes are saved directly to your Laravel API.</p>
          </aside>
        </section>
        <footer>Task 33 <span>•</span> Designed and built by <strong>Naqib</strong> <span>•</span> React + Laravel</footer>
      </div>
    </main>
  );
}

export default App;