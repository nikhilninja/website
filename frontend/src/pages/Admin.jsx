import { useState, useEffect, useRef } from 'react';
import {
  adminLogin,
  fetchPageContent,
  updatePageContent,
  fetchCollection,
  addCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  uploadFile,
  getImageUrl,
} from '../lib/api';
import './Admin.css';

/* ── Section configs ─────────────────────────────────────── */
const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', group: 'Overview' },
  { key: 'home', label: 'Home Page', icon: '🏠', group: 'Pages' },
  { key: 'about', label: 'About Page', icon: '📖', group: 'Pages' },
  { key: 'services', label: 'Services', icon: '🌿', group: 'Collections' },
  { key: 'testimonials', label: 'Testimonials', icon: '💬', group: 'Collections' },
  { key: 'blog-posts', label: 'Blog Posts', icon: '✍️', group: 'Collections' },
  { key: 'faqs', label: 'FAQs', icon: '❓', group: 'Collections' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️', group: 'Collections' },
  { key: 'facilities', label: 'Facilities', icon: '🏛️', group: 'Collections' },
  { key: 'streams', label: 'Live Streams', icon: '📹', group: 'Collections' },
  { key: 'contact-submissions', label: 'Contact Messages', icon: '📩', group: 'Data' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('sarani_admin_auth');
    if (saved === 'true') setAuthed(true);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await adminLogin(password);
    if (result.success) {
      setAuthed(true);
      sessionStorage.setItem('sarani_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem('sarani_admin_auth');
  };

  if (!authed) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login__card">
            <div className="admin-login__logo">
              <img src="/logo.png" alt="Sarani Logo" style={{ height: '80px', width: 'auto', borderRadius: '50%' }} />
            </div>
            <h2>Sarani Admin Panel</h2>
            <p>Enter the admin password to manage your website content</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
              {loginError && <p className="admin-login__error">{loginError}</p>}
              <button type="submit" className="admin-login__btn">
                Unlock Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Group sections for sidebar
  const groups = {};
  sections.forEach(s => {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  });

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <div className="admin-sidebar__brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Sarani Logo" style={{ height: '32px', width: 'auto', borderRadius: '50%' }} />
              SARANI
            </div>
            <div className="admin-sidebar__sub">Admin Panel</div>
          </div>
          <nav className="admin-sidebar__nav">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div className="admin-sidebar__section">{group}</div>
                {items.map(item => (
                  <button
                    key={item.key}
                    className={`admin-sidebar__link ${activeSection === item.key ? 'admin-sidebar__link--active' : ''}`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <span className="admin-sidebar__link-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="admin-sidebar__footer">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-view-site">
              ↗ View Website
            </a>
            <button className="admin-sidebar__logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {activeSection === 'dashboard' && <DashboardSection showToast={showToast} />}
          {activeSection === 'home' && <PageEditor page="home" showToast={showToast} />}
          {activeSection === 'about' && <PageEditor page="about" showToast={showToast} />}
          {activeSection === 'services' && <CollectionEditor name="services" showToast={showToast} fields={serviceFields} />}
          {activeSection === 'testimonials' && <CollectionEditor name="testimonials" showToast={showToast} fields={testimonialFields} />}
          {activeSection === 'blog-posts' && <CollectionEditor name="blog-posts" showToast={showToast} fields={blogFields} />}
          {activeSection === 'faqs' && <CollectionEditor name="faqs" showToast={showToast} fields={faqFields} />}
          {activeSection === 'gallery' && <CollectionEditor name="gallery" showToast={showToast} fields={galleryFields} />}
          {activeSection === 'facilities' && <CollectionEditor name="facilities" showToast={showToast} fields={facilityFields} />}
          {activeSection === 'streams' && <CollectionEditor name="streams" showToast={showToast} fields={streamFields} />}
          {activeSection === 'contact-submissions' && <ContactSubmissions showToast={showToast} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Dashboard
   ══════════════════════════════════════════════════════════════ */
function DashboardSection({ showToast: _showToast }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    async function load() {
      const collections = ['services', 'testimonials', 'blog-posts', 'faqs', 'gallery', 'facilities', 'streams', 'contact-submissions'];
      const results = {};
      for (const name of collections) {
        const data = await fetchCollection(name);
        results[name] = data?.data?.length || 0;
      }
      setCounts(results);
    }
    load();
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your website content</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">🌿</div>
          <div>
            <div className="admin-stat-card__value">{counts.services || 0}</div>
            <div className="admin-stat-card__label">Services</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">💬</div>
          <div>
            <div className="admin-stat-card__value">{counts.testimonials || 0}</div>
            <div className="admin-stat-card__label">Testimonials</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">✍️</div>
          <div>
            <div className="admin-stat-card__value">{counts['blog-posts'] || 0}</div>
            <div className="admin-stat-card__label">Blog Posts</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">❓</div>
          <div>
            <div className="admin-stat-card__value">{counts.faqs || 0}</div>
            <div className="admin-stat-card__label">FAQs</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">🖼️</div>
          <div>
            <div className="admin-stat-card__value">{counts.gallery || 0}</div>
            <div className="admin-stat-card__label">Gallery Images</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">📩</div>
          <div>
            <div className="admin-stat-card__value">{counts['contact-submissions'] || 0}</div>
            <div className="admin-stat-card__label">Contact Messages</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>🚀 Quick Start Guide</h3>
        <p style={{ color: '#8a9ab5', lineHeight: 1.8 }}>
          Welcome to your admin panel! Here's how to manage your website:<br /><br />
          <strong style={{ color: '#2aa691' }}>📝 Edit Page Content:</strong> Click "Home Page" or "About Page" in the sidebar to edit text content like hero titles, descriptions, mission, vision, etc.<br /><br />
          <strong style={{ color: '#2aa691' }}>📋 Manage Collections:</strong> Click Services, Testimonials, Blog Posts, FAQs, Gallery, or Facilities to add, edit, or delete items.<br /><br />
          <strong style={{ color: '#2aa691' }}>📹 CCTV Streams:</strong> Click "Live Streams" to add or configure camera feeds.<br /><br />
          <strong style={{ color: '#2aa691' }}>📩 Contact Messages:</strong> View all messages received through the contact form.<br /><br />
          <strong style={{ color: '#2aa691' }}>↗ View Website:</strong> Click the link at the bottom of the sidebar to see your changes live.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Page Editor (for home.json, about.json)
   ══════════════════════════════════════════════════════════════ */
function PageEditor({ page, showToast }) {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchPageContent(page);
      if (data?.data) setContent(data.data);
    }
    load();
  }, [page]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updatePageContent(page, content);
    if (result.success) {
      showToast('Content saved successfully!');
    } else {
      showToast('Failed to save', 'error');
    }
    setSaving(false);
  };

  const updateField = (path, value) => {
    setContent(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!content) return <div className="admin-empty"><div className="admin-empty__icon">⏳</div><p>Loading...</p></div>;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>{page === 'home' ? '🏠 Home Page' : '📖 About Page'}</h1>
          <p>Edit the text content displayed on the {page} page</p>
        </div>
        <div className="admin-header__actions">
          <a href={page === 'home' ? '/' : '/about'} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--ghost">
            ↗ Preview
          </a>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {page === 'home' && <HomePageFields content={content} updateField={updateField} />}
      {page === 'about' && <AboutPageFields content={content} updateField={updateField} />}
    </div>
  );
}

/* ── Home Page Fields ──────────────────────────────────────── */
function HomePageFields({ content, updateField }) {
  return (
    <>
      <div className="admin-card">
        <h3>🎯 Hero Section</h3>
        <div className="admin-form-group">
          <label>Badge Text</label>
          <input className="admin-input" value={content.hero?.badge || ''} onChange={e => updateField('hero.badge', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Title (before accent)</label>
            <input className="admin-input" value={content.hero?.title_before || ''} onChange={e => updateField('hero.title_before', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Title (accent word)</label>
            <input className="admin-input" value={content.hero?.title_accent || ''} onChange={e => updateField('hero.title_accent', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Title (after accent)</label>
          <input className="admin-input" value={content.hero?.title_after || ''} onChange={e => updateField('hero.title_after', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Subtitle</label>
          <textarea className="admin-textarea" value={content.hero?.subtitle || ''} onChange={e => updateField('hero.subtitle', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Primary Button Text</label>
            <input className="admin-input" value={content.hero?.cta_primary || ''} onChange={e => updateField('hero.cta_primary', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Secondary Button Text</label>
            <input className="admin-input" value={content.hero?.cta_secondary || ''} onChange={e => updateField('hero.cta_secondary', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>👋 Welcome Section</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Subtitle</label>
            <input className="admin-input" value={content.welcome?.subtitle || ''} onChange={e => updateField('welcome.subtitle', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Title</label>
            <input className="admin-input" value={content.welcome?.title || ''} onChange={e => updateField('welcome.title', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea className="admin-textarea" value={content.welcome?.description || ''} onChange={e => updateField('welcome.description', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Features (one per line)</label>
          <textarea
            className="admin-textarea"
            value={(content.welcome?.features || []).join('\n')}
            onChange={e => updateField('welcome.features', e.target.value.split('\n').filter(Boolean))}
            rows={5}
          />
        </div>
      </div>

      <div className="admin-card">
        <h3>📊 Stats</h3>
        {(content.stats || []).map((stat, i) => (
          <div key={i} className="admin-form-row" style={{ marginBottom: '0.75rem' }}>
            <div className="admin-form-group">
              <label>Value (e.g. "500+")</label>
              <input className="admin-input" value={stat.value} onChange={e => {
                const stats = [...content.stats];
                stats[i] = { ...stats[i], value: e.target.value };
                updateField('stats', stats);
              }} />
            </div>
            <div className="admin-form-group">
              <label>Label</label>
              <input className="admin-input" value={stat.label} onChange={e => {
                const stats = [...content.stats];
                stats[i] = { ...stats[i], label: e.target.value };
                updateField('stats', stats);
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3>📣 CTA Section</h3>
        <div className="admin-form-group">
          <label>Title</label>
          <input className="admin-input" value={content.cta?.title || ''} onChange={e => updateField('cta.title', e.target.value)} />
        </div>
        <div className="admin-form-group">
          <label>Description</label>
          <textarea className="admin-textarea" value={content.cta?.description || ''} onChange={e => updateField('cta.description', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Primary Button</label>
            <input className="admin-input" value={content.cta?.cta_primary || ''} onChange={e => updateField('cta.cta_primary', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Phone Number</label>
            <input className="admin-input" value={content.cta?.phone || ''} onChange={e => updateField('cta.phone', e.target.value)} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ── About Page Fields ─────────────────────────────────────── */
function AboutPageFields({ content, updateField }) {
  return (
    <>
      <div className="admin-card">
        <h3>🎯 Hero Section</h3>
        <div className="admin-form-group">
          <label>Badge Text</label>
          <input className="admin-input" value={content.hero?.badge || ''} onChange={e => updateField('hero.badge', e.target.value)} />
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Title (before accent)</label>
            <input className="admin-input" value={content.hero?.title_before || ''} onChange={e => updateField('hero.title_before', e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label>Title (accent word)</label>
            <input className="admin-input" value={content.hero?.title_accent || ''} onChange={e => updateField('hero.title_accent', e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group">
          <label>Subtitle</label>
          <textarea className="admin-textarea" value={content.hero?.subtitle || ''} onChange={e => updateField('hero.subtitle', e.target.value)} />
        </div>
      </div>

      <div className="admin-card">
        <h3>🎯 Mission & Vision</h3>
        <div className="admin-form-group">
          <label>Mission Statement</label>
          <textarea className="admin-textarea" value={content.mission || ''} onChange={e => updateField('mission', e.target.value)} rows={4} />
        </div>
        <div className="admin-form-group">
          <label>Vision Statement</label>
          <textarea className="admin-textarea" value={content.vision || ''} onChange={e => updateField('vision', e.target.value)} rows={4} />
        </div>
      </div>

      <div className="admin-card">
        <h3>💎 Core Values</h3>
        {(content.values || []).map((v, i) => (
          <div key={i} className="admin-item-editor">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Icon (emoji)</label>
                <input className="admin-input" value={v.icon} onChange={e => {
                  const values = [...content.values];
                  values[i] = { ...values[i], icon: e.target.value };
                  updateField('values', values);
                }} />
              </div>
              <div className="admin-form-group">
                <label>Title</label>
                <input className="admin-input" value={v.title} onChange={e => {
                  const values = [...content.values];
                  values[i] = { ...values[i], title: e.target.value };
                  updateField('values', values);
                }} />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea className="admin-textarea" value={v.desc} onChange={e => {
                const values = [...content.values];
                values[i] = { ...values[i], desc: e.target.value };
                updateField('values', values);
              }} rows={2} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3>👥 Team Members</h3>
        {(content.team || []).map((m, i) => (
          <div key={i} className="admin-item-editor">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Name</label>
                <input className="admin-input" value={m.name} onChange={e => {
                  const team = [...content.team];
                  team[i] = { ...team[i], name: e.target.value };
                  updateField('team', team);
                }} />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <input className="admin-input" value={m.role} onChange={e => {
                  const team = [...content.team];
                  team[i] = { ...team[i], role: e.target.value };
                  updateField('team', team);
                }} />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Emoji/Avatar</label>
              <input className="admin-input" value={m.emoji} onChange={e => {
                const team = [...content.team];
                team[i] = { ...team[i], emoji: e.target.value };
                updateField('team', team);
              }} />
            </div>
          </div>
        ))}
        <button className="admin-btn admin-btn--ghost" onClick={() => {
          updateField('team', [...(content.team || []), { name: '', role: '', emoji: '👤', image: null }]);
        }}>
          + Add Team Member
        </button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   Collection Editor (generic for services, testimonials, etc.)
   ══════════════════════════════════════════════════════════════ */
const serviceFields = [
  { key: 'title', label: 'Service Title', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  { key: 'features', label: 'Features (comma-separated)', type: 'text' },
  { key: 'order', label: 'Display Order', type: 'number' },
];

const testimonialFields = [
  { key: 'author_name', label: 'Author Name', type: 'text' },
  { key: 'role', label: 'Role (e.g. Recovered Patient)', type: 'text' },
  { key: 'quote', label: 'Quote', type: 'textarea' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
];

const blogFields = [
  { key: 'title', label: 'Post Title', type: 'text' },
  { key: 'slug', label: 'URL Slug', type: 'text' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Full Content', type: 'textarea' },
  { key: 'author', label: 'Author', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'published_at', label: 'Published Date', type: 'date' },
];

const faqFields = [
  { key: 'question', label: 'Question', type: 'text' },
  { key: 'answer', label: 'Answer', type: 'textarea' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'order', label: 'Display Order', type: 'number' },
];

const galleryFields = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'emoji', label: 'Emoji (fallback)', type: 'text' },
  { key: 'image', label: 'Image', type: 'image' },
];

const facilityFields = [
  { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  { key: 'title', label: 'Facility Name', type: 'text' },
  { key: 'desc', label: 'Description', type: 'textarea' },
];

const streamFields = [
  { key: 'name', label: 'Camera Name', type: 'text' },
  { key: 'stream_path', label: 'Stream Path', type: 'text' },
  { key: 'is_active', label: 'Active', type: 'checkbox' },
];

function CollectionEditor({ name, fields, showToast }) {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const loadItems = async () => {
    const data = await fetchCollection(name);
    if (data?.data) setItems(data.data);
  };

  const handleSave = async () => {
    if (editItem.id) {
      const { id, ...rest } = editItem;
      await updateCollectionItem(name, id, rest);
      showToast('Item updated!');
    } else {
      await addCollectionItem(name, editItem);
      showToast('Item added!');
    }
    setShowModal(false);
    setEditItem(null);
    loadItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await deleteCollectionItem(name, id);
    showToast('Item deleted');
    loadItems();
  };

  const handleImageUpload = async (e, fieldKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadFile(file);
    if (result.url) {
      setEditItem(prev => ({ ...prev, [fieldKey]: result.url }));
      showToast('Image uploaded!');
    }
  };

  const openNew = () => {
    const newItem = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') newItem[f.key] = true;
      else if (f.type === 'number') newItem[f.key] = 0;
      else newItem[f.key] = '';
    });
    setEditItem(newItem);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem({ ...item });
    setShowModal(true);
  };

  const displayLabel = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const titleField = fields.find(f => ['title', 'question', 'name', 'author_name'].includes(f.key));

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>{displayLabel}</h1>
          <p>Manage your {displayLabel.toLowerCase()} — {items.length} items</p>
        </div>
        <div className="admin-header__actions">
          <button className="admin-btn admin-btn--primary" onClick={openNew}>
            + Add New
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📭</div>
          <p>No items yet. Click "Add New" to get started.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                {titleField && <th>{titleField.label}</th>}
                {fields.slice(0, 3).filter(f => f !== titleField).map(f => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ color: '#4a5a75' }}>{item.id}</td>
                  {titleField && <td style={{ color: '#fff', fontWeight: 500 }}>{item[titleField.key]}</td>}
                  {fields.slice(0, 3).filter(f => f !== titleField).map(f => (
                    <td key={f.key} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.type === 'checkbox' ? (item[f.key] ? '✅' : '❌') : String(item[f.key] || '').substring(0, 60)}
                    </td>
                  ))}
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(item.id)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && editItem && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem.id ? 'Edit Item' : 'Add New Item'}</h3>
            {fields.map(field => (
              <div className="admin-form-group" key={field.key}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="admin-textarea"
                    value={editItem[field.key] || ''}
                    onChange={e => setEditItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                    rows={4}
                  />
                ) : field.type === 'checkbox' ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editItem[field.key] || false}
                      onChange={e => setEditItem(prev => ({ ...prev, [field.key]: e.target.checked }))}
                      style={{ width: 18, height: 18, accentColor: '#2aa691' }}
                    />
                    <span style={{ color: '#8a9ab5' }}>{editItem[field.key] ? 'Yes' : 'No'}</span>
                  </label>
                ) : field.type === 'image' ? (
                  <div>
                    {editItem[field.key] && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <img
                          src={getImageUrl(editItem[field.key])}
                          alt="Preview"
                          style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid rgba(42,166,145,0.2)' }}
                        />
                      </div>
                    )}
                    <div className="admin-upload" onClick={() => fileInputRef.current?.click()}>
                      <div className="admin-upload__icon">📤</div>
                      <div className="admin-upload__text">Click to upload an image</div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(e, field.key)}
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    className="admin-input"
                    type={field.type}
                    value={editItem[field.key] || ''}
                    onChange={e => setEditItem(prev => ({
                      ...prev,
                      [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                    }))}
                  />
                )}
              </div>
            ))}
            <div className="admin-modal__actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave}>
                {editItem.id ? '💾 Save Changes' : '➕ Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Contact Submissions Viewer
   ══════════════════════════════════════════════════════════════ */
function ContactSubmissions({ showToast: _showToast }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('contact-submissions');
      if (data?.data) setSubmissions(data.data.reverse());
    }
    load();
  }, []);

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>📩 Contact Messages</h1>
          <p>{submissions.length} messages received</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📭</div>
          <p>No contact submissions yet.</p>
        </div>
      ) : (
        submissions.map(sub => (
          <div key={sub.id} className={`admin-submission ${!sub.read ? 'admin-submission--unread' : ''}`}>
            <div className="admin-submission__header">
              <span className="admin-submission__name">{sub.name}</span>
              <span className="admin-submission__date">
                {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                }) : ''}
              </span>
            </div>
            {sub.subject && <div className="admin-submission__subject">{sub.subject}</div>}
            <div className="admin-submission__message">{sub.message}</div>
            <div className="admin-submission__meta">
              {sub.email && <span>📧 {sub.email}</span>}
              {sub.phone && <span>📞 {sub.phone}</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
