import { useState, useEffect } from 'react';
import { fetchPageContent, fetchCollection } from '../lib/api';
import './About.css';

const defaultTeam = [
  { name: 'Dr. Rahul Sen', role: 'Medical Director', emoji: '👨‍⚕️' },
  { name: 'Dr. Anita Sharma', role: 'Chief Psychiatrist', emoji: '👩‍⚕️' },
  { name: 'Vikram Patel', role: 'Lead Counselor', emoji: '🧑‍💼' },
  { name: 'Meera Das', role: 'Wellness Coordinator', emoji: '🧘‍♀️' },
];

const defaultValues = [
  { icon: '💚', title: 'Compassion', desc: 'We treat every individual with empathy, dignity, and respect throughout their recovery journey.' },
  { icon: '🏆', title: 'Excellence', desc: 'Our commitment to the highest standards of care drives everything we do — from treatment to facilities.' },
  { icon: '🤝', title: 'Integrity', desc: 'Transparency and honesty form the foundation of our relationships with patients and families.' },
  { icon: '🌱', title: 'Holistic Care', desc: 'We address the complete person — body, mind, and spirit — for lasting transformation.' },
];

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [team, setTeam] = useState(defaultTeam);
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    async function load() {
      const data = await fetchPageContent('about');
      if (data?.data) {
        setAboutData(data.data);
        if (data.data.team) setTeam(data.data.team);
        if (data.data.values) setValues(data.data.values);
      }
    }
    load();
  }, []);

  return (
    <div className="about-page" id="about-page">
      {/* Hero Banner */}
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">{aboutData?.hero?.badge || 'About Us'}</span>
          <h1>{aboutData?.hero?.title_before || 'Our Story of '}<span className="text-accent">{aboutData?.hero?.title_accent || 'Healing'}</span></h1>
          <p>{aboutData?.hero?.subtitle || 'Dedicated to transforming lives through compassionate care and evidence-based treatment since our founding.'}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="about__mission-grid">
            <div className="about__mission-card glass-card">
              <div className="about__mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                {aboutData?.mission || 'To provide world-class rehabilitation services that empower individuals to overcome addiction and reclaim their lives, through personalized treatment plans, compassionate care, and a holistic approach to recovery.'}
              </p>
            </div>
            <div className="about__mission-card glass-card">
              <div className="about__mission-icon">🔭</div>
              <h3>Our Vision</h3>
              <p>
                {aboutData?.vision || 'To be the leading rehabilitation centre in Eastern India, recognized for our commitment to excellence, innovation in treatment, and the lasting positive impact we make on individuals, families, and communities.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section about__values">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div key={i} className="value-card glass-card">
                <div className="value-card__icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section about__team">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Meet The Experts</span>
            <h2>Our Team</h2>
            <p>A multidisciplinary team of professionals dedicated to your recovery.</p>
          </div>
          <div className="grid-4">
            {team.map((member, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-card__avatar">{member.emoji}</div>
                <h4>{member.name}</h4>
                <p className="team-card__role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
