import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/api';
import './Testimonials.css';

const fallbackTestimonials = [
  { id: 1, author_name: 'Rajiv M.', role: 'Recovered Patient', quote: 'Sarani gave me my life back. The compassionate staff and personalized care made all the difference in my recovery journey.', rating: 5 },
  { id: 2, author_name: 'Priya S.', role: 'Family Member', quote: 'We are forever grateful to Sarani. They not only helped our son but healed our entire family through their therapy programs.', rating: 5 },
  { id: 3, author_name: 'Amit K.', role: 'Recovered Patient', quote: 'The serene environment and professional team at Sarani created the perfect setting for healing. Two years sober and counting!', rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('testimonials');
      if (data?.data?.length > 0) {
        setTestimonials(data.data);
      }
    }
    load();
  }, []);

  return (
    <div className="testimonials-page" id="testimonials-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Testimonials</span>
          <h1>Voices of <span className="text-accent">Recovery</span></h1>
          <p>Read the inspiring stories of those who have walked the path to healing at Sarani.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="testimonials-page__grid">
            {testimonials.map(t => (
              <div key={t.id} className="testimonial-page-card glass-card">
                <div className="testimonial-page-card__quote">"</div>
                <p className="testimonial-page-card__text">{t.quote}</p>
                <div className="testimonial-page-card__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="testimonial-page-card__star">★</span>
                  ))}
                </div>
                <div className="testimonial-page-card__author">
                  <div className="testimonial-page-card__avatar">{t.author_name[0]}</div>
                  <div>
                    <strong>{t.author_name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
