import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchPageContent, fetchCollection, getImageUrl } from '../lib/api';
import './Home.css';

/* ── Fallback data when API isn't connected ── */
const fallbackServices = [
  { id: 1, title: 'Addiction Treatment', description: 'Personalized treatment plans combining medical care, therapy, and holistic approaches to overcome addiction.', icon: '🌿' },
  { id: 2, title: 'Detoxification', description: 'Safe, medically supervised detox programs to help your body heal in a comfortable environment.', icon: '💧' },
  { id: 3, title: 'Counseling & Therapy', description: 'Individual and group counseling sessions with experienced psychologists and therapists.', icon: '🧠' },
  { id: 4, title: 'Family Therapy', description: 'Healing relationships through guided family sessions, helping loved ones understand and support recovery.', icon: '👨‍👩‍👧' },
  { id: 5, title: 'Aftercare Support', description: 'Ongoing support and relapse prevention programs for lasting recovery and a fulfilling life.', icon: '🤝' },
  { id: 6, title: 'Wellness Programs', description: 'Yoga, meditation, fitness, and nutrition programs for holistic mind-body-spirit healing.', icon: '🧘' },
];

const fallbackTestimonials = [
  { id: 1, author_name: 'Rajiv M.', role: 'Recovered Patient', quote: 'Sarani gave me my life back. The compassionate staff and personalized care made all the difference in my recovery journey.', rating: 5 },
  { id: 2, author_name: 'Priya S.', role: 'Family Member', quote: 'We are forever grateful to Sarani. They not only helped our son but healed our entire family through their therapy programs.', rating: 5 },
  { id: 3, author_name: 'Amit K.', role: 'Recovered Patient', quote: 'The serene environment and professional team at Sarani created the perfect setting for healing. Two years sober and counting!', rating: 5 },
];

const defaultStats = [
  { value: '500+', label: 'Lives Transformed' },
  { value: '15+', label: 'Years of Excellence' },
  { value: '50+', label: 'Expert Staff' },
  { value: '98%', label: 'Recovery Rate' },
];

const defaultContent = {
  hero: {
    badge: 'Centre for Excellence',
    title_before: 'Where ',
    title_accent: 'Care',
    title_after: ' Blossoms',
    subtitle: 'Your Path to Recovery Awaits. Sarani Rehabilitation & Wellness Centre is the perfect place to restart life — find hope, healing, and a brighter future.',
    cta_primary: 'Begin Your Journey',
    cta_secondary: 'Learn More',
  },
  welcome: {
    subtitle: 'Welcome To Sarani',
    title: 'A Place of Hope, Healing & New Beginnings',
    description: "Sarani's Rehabilitation & Wellness Centre is the perfect place to Restart Life — a place where you can find hope, healing and a brighter future. We aim to transform lives impaired and impacted by drug and alcohol abuse or any other kind of addiction.",
    features: [
      'Personalized treatment plans tailored to your unique needs',
      'Multidisciplinary care combining medical and psychological counseling',
      'Luxurious facility with serene, healing environment',
      '24/7 professional support and monitoring',
    ],
  },
  services_section: {
    subtitle: 'What We Offer',
    title: 'Our Services',
    description: 'Comprehensive care designed to address every aspect of recovery — body, mind, and spirit.',
  },
  testimonials_section: {
    subtitle: 'Voices of Recovery',
    title: 'What Our Families Say',
  },
  cta: {
    title: 'Ready to Start Your Recovery Journey?',
    description: 'Take the first step towards a healthier, happier life. Our compassionate team is here to guide you every step of the way.',
    cta_primary: 'Get In Touch',
    cta_secondary: 'Call Now',
    phone: '+917001657578',
  },
};

export default function Home() {
  const [content, setContent] = useState(defaultContent);
  const [stats, setStats] = useState(defaultStats);
  const [services, setServices] = useState(fallbackServices);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      // Fetch page content
      const pageData = await fetchPageContent('home');
      if (pageData?.data) {
        setContent(prev => ({ ...prev, ...pageData.data }));
        if (pageData.data.stats) setStats(pageData.data.stats);
      }

      // Fetch services
      const servicesData = await fetchCollection('services');
      if (servicesData?.data?.length > 0) {
        setServices(servicesData.data.slice(0, 6).map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon || '✦',
        })));
      }

      // Fetch testimonials
      const testimonialsData = await fetchCollection('testimonials');
      if (testimonialsData?.data?.length > 0) {
        setTestimonials(testimonialsData.data);
      }
    }
    loadData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const hero = content.hero || defaultContent.hero;
  const welcome = content.welcome || defaultContent.welcome;
  const servicesSec = content.services_section || defaultContent.services_section;
  const testimonialsSec = content.testimonials_section || defaultContent.testimonials_section;
  const cta = content.cta || defaultContent.cta;

  return (
    <div className="home" id="home-page">
      {/* ── Hero Section ──────────────────────── */}
      <section className="hero" ref={heroRef} id="hero-section">
        <div className="hero__bg">
          <div className="hero__bg-gradient"></div>
          <div className="hero__bg-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="hero__particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}></div>
            ))}
          </div>
        </div>

        <div className="hero__content container">
          <span className="hero__badge animate-fade-in">{hero.badge}</span>
          <h1 className="hero__title animate-fade-in-up">
            {hero.title_before}<span className="hero__title-accent">{hero.title_accent}</span>{hero.title_after}
          </h1>
          <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {hero.subtitle}
          </p>
          <div className="hero__actions animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="btn btn-accent">
              {hero.cta_primary}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/about" className="btn btn-outline">{hero.cta_secondary}</Link>
          </div>
        </div>

        <a href="#welcome-section" className="hero__scroll-indicator" aria-label="Scroll to explore">
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-dot"></div>
          </div>
          <span>Scroll to explore</span>
        </a>
      </section>

      {/* ── Welcome / About Preview ───────────── */}
      <section className="section welcome" id="welcome-section">
        <div className="container">
          <div className="welcome__grid">
            <div className="welcome__image-container">
              <div className="welcome__image-frame">
                {welcome.image ? (
                  <img
                    src={getImageUrl(welcome.image)}
                    alt={welcome.title || 'Sarani Rehabilitation Centre'}
                    className="welcome__image-img"
                  />
                ) : (
                  <div className="welcome__image-placeholder">
                    <div className="welcome__image-icon">🏥</div>
                    <p>Sarani Rehabilitation Centre</p>
                  </div>
                )}
              </div>
              <div className="welcome__image-accent"></div>
            </div>
            <div className="welcome__text">
              <span className="section-header subtitle" style={{ textAlign: 'left' }}>{welcome.subtitle}</span>
              <h2>{welcome.title}</h2>
              <p>{welcome.description}</p>
              <ul className="welcome__features">
                {(welcome.features || []).map((feature, i) => (
                  <li key={i}>
                    <span className="welcome__check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn btn-primary">Discover Our Approach</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────── */}
      <section className="stats-section" id="stats-section">
        <div className="container">
          <div className="stats__grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────── */}
      <section className="section services-preview" id="services-preview">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">{servicesSec.subtitle}</span>
            <h2>{servicesSec.title}</h2>
            <p>{servicesSec.description}</p>
          </div>
          <div className="grid-3">
            {services.map((service, i) => (
              <div key={service.id} className="service-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="services-preview__cta">
            <Link to="/services" className="btn btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────── */}
      <section className="section testimonials" id="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">{testimonialsSec.subtitle}</span>
            <h2>{testimonialsSec.title}</h2>
          </div>
          <div className="testimonials__carousel">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`testimonial-card ${i === currentTestimonial ? 'testimonial-card--active' : ''}`}
              >
                <div className="testimonial-card__quote">"</div>
                <p className="testimonial-card__text">{t.quote}</p>
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="testimonial-card__star">★</span>
                  ))}
                </div>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.author_name[0]}</div>
                  <div>
                    <strong>{t.author_name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonials__dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === currentTestimonial ? 'testimonials__dot--active' : ''}`}
                onClick={() => setCurrentTestimonial(i)}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────── */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-card__glow"></div>
            <h2>{cta.title}</h2>
            <p>{cta.description}</p>
            <div className="cta-card__actions">
              <Link to="/contact" className="btn btn-accent">{cta.cta_primary}</Link>
              <a href={`tel:${cta.phone}`} className="btn btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {cta.cta_secondary}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
