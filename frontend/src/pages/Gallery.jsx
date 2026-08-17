import { useState, useEffect } from 'react';
import { fetchCollection, getImageUrl } from '../lib/api';
import './Gallery.css';

const fallbackImages = [
  { id: 1, title: 'Healing Gardens', category: 'Facility', emoji: '🌿', image: null },
  { id: 2, title: 'Therapy Room', category: 'Facility', emoji: '🛋️', image: null },
  { id: 3, title: 'Yoga Session', category: 'Activities', emoji: '🧘', image: null },
  { id: 4, title: 'Dining Area', category: 'Facility', emoji: '🍽️', image: null },
  { id: 5, title: 'Group Therapy', category: 'Activities', emoji: '👥', image: null },
  { id: 6, title: 'Meditation Space', category: 'Wellness', emoji: '🕯️', image: null },
  { id: 7, title: 'Patient Room', category: 'Accommodation', emoji: '🛏️', image: null },
  { id: 8, title: 'Fitness Center', category: 'Wellness', emoji: '🏋️', image: null },
  { id: 9, title: 'Art Therapy', category: 'Activities', emoji: '🎨', image: null },
  { id: 10, title: 'Garden Walk', category: 'Facility', emoji: '🌸', image: null },
  { id: 11, title: 'Music Therapy', category: 'Activities', emoji: '🎵', image: null },
  { id: 12, title: 'Swimming Pool', category: 'Wellness', emoji: '🏊', image: null },
];

export default function Gallery() {
  const [images, setImages] = useState(fallbackImages);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('gallery');
      if (data?.data?.length > 0) {
        setImages(data.data);
      }
    }
    load();
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category))];
  const filtered = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="gallery-page" id="gallery-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Gallery</span>
          <h1>Our <span className="text-accent">Spaces</span></h1>
          <p>Take a virtual tour of our luxurious rehabilitation facility and healing environments.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery__filters">
            {categories.map(cat => (
              <button key={cat} className={`blog__filter ${filter === cat ? 'blog__filter--active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery__grid">
            {filtered.map(img => (
              <div key={img.id} className="gallery-item" onClick={() => setLightbox(img)}>
                <div className="gallery-item__image">
                  {img.image ? (
                    <img src={getImageUrl(img.image)} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="gallery-item__placeholder">{img.emoji}</div>
                  )}
                </div>
                <div className="gallery-item__overlay">
                  <h4>{img.title}</h4>
                  <span>{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox__content" onClick={e => e.stopPropagation()}>
            <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            <div className="lightbox__image">
              {lightbox.image ? (
                <img src={getImageUrl(lightbox.image)} alt={lightbox.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              ) : (
                <div className="gallery-item__placeholder" style={{ fontSize: '6rem' }}>{lightbox.emoji}</div>
              )}
            </div>
            <div className="lightbox__info">
              <h3>{lightbox.title}</h3>
              <p>{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
