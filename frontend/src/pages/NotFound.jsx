import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page" id="not-found-page" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '560px', width: '100%', padding: '3.5rem 2rem' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem', background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
          404
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let us guide you back to safety.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            Return to Homepage
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
