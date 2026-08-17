import { useState } from 'react';
import { submitContactForm } from '../lib/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitContactForm(form);
    if (result.success) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      setStatus('error');
    }
    setLoading(false);
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="contact-page" id="contact-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Get In Touch</span>
          <h1>Contact <span className="text-accent">Us</span></h1>
          <p>We're here to help. Reach out for a free, confidential consultation.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact__grid">
            {/* Contact Info */}
            <div className="contact__info">
              <h2>Let's Start Your Recovery</h2>
              <p>Our admissions team is available 24/7 to answer your questions and help you take the first step towards recovery.</p>

              <div className="contact__cards">
                <div className="contact__card glass-card">
                  <div className="contact__card-icon">📞</div>
                  <div>
                    <h4>Call Us</h4>
                    <a href="tel:+917001657578">+91 7001657578</a>
                  </div>
                </div>

                <div className="contact__card glass-card">
                  <div className="contact__card-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:info@saranirehab.com">info@saranirehab.com</a>
                  </div>
                </div>

                <div className="contact__card glass-card">
                  <div className="contact__card-icon">📍</div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>Sarani Rehabilitation Centre</p>
                  </div>
                </div>

                <div className="contact__card glass-card">
                  <div className="contact__card-icon">💬</div>
                  <div>
                    <h4>WhatsApp</h4>
                    <a href="https://wa.me/917001657578" target="_blank" rel="noopener noreferrer">Chat Now</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="contact__form glass-card" onSubmit={handleSubmit} id="contact-form">
              <h3>Send Us a Message</h3>
              
              {status === 'success' && (
                <div className="contact__alert contact__alert--success">
                  ✓ Thank you! We'll get back to you within 24 hours.
                </div>
              )}
              {status === 'error' && (
                <div className="contact__alert contact__alert--error">
                  Something went wrong. Please try calling us directly.
                </div>
              )}

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </div>
                <div className="contact__field">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
              </div>

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                </div>
                <div className="contact__field">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="message">Message *</label>
                <textarea id="message" rows="5" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your situation..."></textarea>
              </div>

              <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
