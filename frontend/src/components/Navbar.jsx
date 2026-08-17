import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/services', label: 'Services' },
  { path: '/facilities', label: 'Facilities' },
  { path: '/blog', label: 'Blog' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
  { path: '/live', label: 'Live Feed', accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo" aria-label="Sarani Home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Sarani Logo" className="navbar__logo-image" style={{ height: '50px', width: 'auto', borderRadius: '50%' }} />
          <div className="navbar__logo-text">
            <span className="navbar__brand">SARANI</span>
            <span className="navbar__tagline">Rehabilitation & Wellness</span>
          </div>
        </Link>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="nav-toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''} ${link.accent ? 'navbar__link--accent' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
