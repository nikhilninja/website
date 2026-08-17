import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/api';
import './Facilities.css';

const fallbackFacilities = [
  { id: 1, icon: '🛏️', title: 'Premium Accommodation', desc: 'Spacious, well-furnished rooms with modern amenities, private bathrooms, and serene views of our gardens. Designed for comfort and recovery.' },
  { id: 2, icon: '🍽️', title: 'Nutritious Dining', desc: 'Our in-house kitchen prepares balanced, nutritious meals tailored to individual dietary needs. Fresh ingredients sourced locally.' },
  { id: 3, icon: '🧘', title: 'Yoga & Meditation Hall', desc: 'A dedicated space for yoga, meditation, and mindfulness practices. Professionally guided sessions every morning and evening.' },
  { id: 4, icon: '🏋️', title: 'Fitness Center', desc: 'Modern gym equipment for physical rehabilitation and fitness. Supervised exercise programs designed for recovery.' },
  { id: 5, icon: '🌿', title: 'Healing Gardens', desc: 'Beautifully landscaped gardens and walking paths for reflection, relaxation, and nature therapy.' },
  { id: 6, icon: '🛋️', title: 'Therapy Rooms', desc: 'Private, comfortable therapy rooms for individual counseling, group sessions, and family meetings.' },
  { id: 7, icon: '📚', title: 'Library & Learning Center', desc: 'A quiet space for reading, self-study, and personal development. Curated collection of recovery literature.' },
  { id: 8, icon: '🎨', title: 'Art & Music Room', desc: 'Creative therapy spaces for art therapy, music therapy, and other expressive therapeutic activities.' },
  { id: 9, icon: '🏊', title: 'Recreation Area', desc: 'Indoor games, outdoor sports, and recreational activities to support holistic healing and social reintegration.' },
];

export default function Facilities() {
  const [facilities, setFacilities] = useState(fallbackFacilities);

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('facilities');
      if (data?.data?.length > 0) {
        setFacilities(data.data);
      }
    }
    load();
  }, []);

  return (
    <div className="facilities-page" id="facilities-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Our Facilities</span>
          <h1>Luxury <span className="text-accent">Healing</span> Environment</h1>
          <p>World-class facilities designed to support your recovery journey in comfort and tranquility.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="facilities__grid">
            {facilities.map((facility, i) => (
              <div key={facility.id || i} className="facility-card glass-card">
                <div className="facility-card__icon">{facility.icon}</div>
                <h3>{facility.title}</h3>
                <p>{facility.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-card__glow"></div>
            <h2>Want to See Our Facility?</h2>
            <p>Schedule a visit to our centre or browse our gallery for a virtual tour of our spaces.</p>
            <div className="cta-card__actions">
              <a href="/gallery" className="btn btn-accent">View Gallery</a>
              <a href="/contact" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Schedule Visit</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
