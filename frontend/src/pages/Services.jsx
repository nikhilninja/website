import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/api';
import './Services.css';

const fallbackServices = [
  { id: 1, title: 'Addiction Treatment', description: 'Comprehensive treatment programs for substance abuse, behavioral addictions, and co-occurring disorders. Our evidence-based approach combines medical intervention with psychological support.', icon: '🌿', features: 'Individual Assessment, Custom Treatment Plans, 12-Step Program' },
  { id: 2, title: 'Medical Detoxification', description: 'Safe, medically supervised detoxification in a comfortable environment. Our medical team monitors patients 24/7 to manage withdrawal symptoms effectively.', icon: '💧', features: '24/7 Medical Monitoring, Medication-Assisted Treatment, Comfortable Environment' },
  { id: 3, title: 'Psychological Counseling', description: 'Individual and group counseling sessions with experienced psychologists. We use CBT, DBT, and motivational interviewing techniques.', icon: '🧠', features: 'Cognitive Behavioral Therapy, Group Sessions, One-on-One Counseling' },
  { id: 4, title: 'Family Therapy', description: 'Rebuilding relationships through guided family therapy sessions. We help families understand addiction and develop healthy communication patterns.', icon: '👨‍👩‍👧', features: 'Family Education, Joint Sessions, Communication Skills' },
  { id: 5, title: 'Aftercare & Relapse Prevention', description: 'Continuing support after treatment completion. Our aftercare program includes regular check-ins, support groups, and crisis intervention.', icon: '🤝', features: 'Alumni Network, Follow-Up Sessions, Crisis Support Line' },
  { id: 6, title: 'Yoga & Wellness', description: 'Holistic wellness programs including yoga, meditation, fitness training, and nutritional guidance for complete mind-body-spirit healing.', icon: '🧘', features: 'Daily Yoga Classes, Meditation Practice, Nutrition Planning' },
  { id: 7, title: 'Psychiatric Evaluation', description: 'Comprehensive psychiatric assessments to identify and treat co-occurring mental health conditions alongside addiction treatment.', icon: '🏥', features: 'Dual Diagnosis, Medication Management, Mental Health Screening' },
  { id: 8, title: 'Life Skills Training', description: 'Equipping patients with essential life skills including vocational training, financial management, and social reintegration support.', icon: '📚', features: 'Vocational Training, Social Skills, Career Guidance' },
];

export default function Services() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('services');
      if (data?.data?.length > 0) {
        setServices(data.data);
      }
    }
    load();
  }, []);

  return (
    <div className="services-page" id="services-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Our Services</span>
          <h1>Comprehensive <span className="text-accent">Care</span></h1>
          <p>Evidence-based treatment programs designed to address every aspect of recovery and wellness.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-list">
            {services.map((service, i) => {
              const featuresList = typeof service.features === 'string'
                ? service.features.split(',').map(f => f.trim())
                : (service.features || []);
              return (
                <div key={service.id} className={`service-detail ${i % 2 !== 0 ? 'service-detail--reverse' : ''}`}>
                  <div className="service-detail__content">
                    <div className="service-detail__number">{String(i + 1).padStart(2, '0')}</div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    {featuresList.length > 0 && (
                      <ul className="service-detail__features">
                        {featuresList.map((f, j) => (
                          <li key={j}><span className="welcome__check">✓</span> {f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="service-detail__visual glass-card">
                    <div className="service-detail__icon">{service.icon}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
