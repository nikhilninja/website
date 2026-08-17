import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollection } from '../lib/api';
import './Blog.css';

const fallbackPosts = [
  { id: 1, title: 'Understanding Addiction: A Comprehensive Guide', excerpt: 'Addiction is a complex brain disorder that affects millions worldwide. Learn about the science behind addiction and how modern treatment approaches are helping people recover.', slug: 'understanding-addiction', published_at: '2025-07-15', author: 'Dr. Rahul Sen', category: 'Education' },
  { id: 2, title: 'The Role of Family in Recovery', excerpt: 'Family support plays a crucial role in the recovery process. Discover how families can effectively support their loved ones while maintaining their own well-being.', slug: 'family-in-recovery', published_at: '2025-07-01', author: 'Dr. Anita Sharma', category: 'Family' },
  { id: 3, title: 'Mindfulness and Meditation in Addiction Recovery', excerpt: 'Mindfulness practices have shown remarkable results in addiction recovery. Explore how meditation can help manage cravings and build emotional resilience.', slug: 'mindfulness-recovery', published_at: '2025-06-20', author: 'Meera Das', category: 'Wellness' },
  { id: 4, title: 'Breaking the Stigma: Mental Health and Addiction', excerpt: 'Mental health stigma remains one of the biggest barriers to seeking treatment. Learn how we can change the conversation around addiction and mental health.', slug: 'breaking-stigma', published_at: '2025-06-10', author: 'Vikram Patel', category: 'Awareness' },
  { id: 5, title: 'Nutrition and Recovery: Healing Your Body', excerpt: 'Proper nutrition is essential for recovery. Learn about the foods and dietary habits that support brain healing and overall physical restoration.', slug: 'nutrition-recovery', published_at: '2025-05-25', author: 'Dr. Rahul Sen', category: 'Wellness' },
  { id: 6, title: 'Life After Rehab: Building a New Normal', excerpt: 'Transitioning from rehabilitation to everyday life can be challenging. Here are practical strategies for maintaining sobriety and building a fulfilling life.', slug: 'life-after-rehab', published_at: '2025-05-10', author: 'Vikram Patel', category: 'Recovery' },
];

export default function Blog() {
  const [posts, setPosts] = useState(fallbackPosts);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('blog-posts');
      if (data?.data?.length > 0) {
        setPosts(data.data);
      }
    }
    load();
  }, []);

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  return (
    <div className="blog-page" id="blog-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">Our Blog</span>
          <h1>Insights & <span className="text-accent">Resources</span></h1>
          <p>Expert articles on addiction, recovery, mental health, and wellness.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog__filters">
            {categories.map(cat => (
              <button key={cat} className={`blog__filter ${filter === cat ? 'blog__filter--active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="blog__grid">
            {filtered.map(post => (
              <article key={post.id} className="blog-card glass-card">
                <div className="blog-card__top">
                  <span className="blog-card__category">{post.category}</span>
                  <span className="blog-card__date">
                    {new Date(post.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="blog-card__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <div className="blog-card__footer">
                  <span className="blog-card__author">By {post.author}</span>
                  <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
