import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollection } from '../lib/api';
import './BlogPost.css';

const fallbackPosts = [
  {
    id: 1,
    title: 'Understanding Addiction: A Comprehensive Guide',
    slug: 'understanding-addiction',
    excerpt: 'Addiction is a complex brain disorder that affects millions worldwide. Learn about the science behind addiction and how modern treatment approaches are helping people recover.',
    category: 'Education',
    author: 'Dr. Rahul Sen',
    published_at: '2025-07-15',
    content: `Addiction is not a moral failing, a lack of willpower, or a sign of weakness. Modern medical and psychological science conclusively defines addiction as a chronic, relapsing brain disease characterized by compulsive substance seeking and use despite harmful consequences.

### The Neurobiology of Addiction
When a person consumes substances such as alcohol, opioids, or stimulants, the brain releases surges of dopamine into the nucleus accumbens—the primary reward center. Over time, continuous stimulation alters neural pathways, reducing natural dopamine receptor sensitivity. The individual develops tolerance and requires higher quantities simply to feel normal.

### Core Stages of the Addiction Cycle
1. **Binge & Intoxication:** Heightened dopamine release and euphoria.
2. **Withdrawal & Negative Affect:** Emotional and physical distress when the substance leaves the system.
3. **Preoccupation & Anticipation:** Intense cravings and obsession with obtaining the next dose.

### Evidence-Based Treatment Pathways
Modern addiction treatment relies on integrated medical and psychological modalities:
- **Medically Supervised Detoxification:** Safe management of physical withdrawal symptoms.
- **Cognitive Behavioral Therapy (CBT):** Identifying thought triggers and developing coping strategies.
- **Holistic Wellness:** Integrating mindfulness, physical fitness, and balanced nutrition.

Recovery is a continuous process of rebuilding identity, resilience, and personal purpose.`,
  },
  {
    id: 2,
    title: 'The Role of Family in Recovery',
    slug: 'family-in-recovery',
    excerpt: 'Family support plays a crucial role in the recovery process. Discover how families can effectively support their loved ones while maintaining their own well-being.',
    category: 'Family',
    author: 'Dr. Anita Sharma',
    published_at: '2025-07-01',
    content: `Addiction rarely affects just one individual; it is widely recognized in clinical psychiatry as a 'family disease'. Loved ones often experience immense emotional distress, anxiety, broken trust, and burnout.

### Understanding the Difference Between Helping and Enabling
One of the most vital lessons for families is distinguishing compassionate support from enabling behaviors:
- **Enabling:** Covering up mistakes, paying debts caused by substance use, or making excuses for harmful behavior.
- **Support:** Encouraging accountability, attending counseling sessions together, and setting clear, loving boundaries.

### Establishing Healthy Boundaries
Setting boundaries is not punitive; it protects both the family and the recovering individual. Clear expectations regarding household safety, emotional honesty, and sobriety guidelines provide a structured framework where healing can happen.

### The Power of Family Therapy at Sarani
Our guided family therapy sessions provide a safe environment to process resentment, rebuild broken trust, and develop new communication skills that sustain long-term sobriety.`,
  },
  {
    id: 3,
    title: 'Mindfulness and Meditation in Addiction Recovery',
    slug: 'mindfulness-recovery',
    excerpt: 'Mindfulness practices have shown remarkable results in addiction recovery. Explore how meditation can help manage cravings and build emotional resilience.',
    category: 'Wellness',
    author: 'Meera Das',
    published_at: '2025-06-20',
    content: `In the chaotic whirlwind of early recovery, emotions can feel overwhelming. Mindfulness—the practice of maintaining moment-by-moment awareness of our thoughts, feelings, bodily sensations, and surrounding environment—serves as an anchor.

### The Science of Urge Surfing
Cravings operate like ocean waves: they build in intensity, reach a peak, and naturally subside. 'Urge surfing' is a mindfulness technique where individuals observe the sensation of a craving without judgment or reaction, recognizing that cravings are temporary physiological events.

### Daily Mindfulness Routines at Sarani
- **Mindful Breathing (Pranayama):** Calms the nervous system and lowers cortisol.
- **Body Scan Meditation:** Reconnects patients with physical sensations often numbed by substance use.
- **Mindful Walking in Nature:** Engages the senses amidst our landscaped campus gardens.

By fostering self-compassion and emotional regulation, mindfulness empowers patients to respond thoughtfully rather than react impulsively.`,
  },
  {
    id: 4,
    title: 'Breaking the Stigma: Mental Health and Addiction',
    slug: 'breaking-stigma',
    excerpt: 'Mental health stigma remains one of the biggest barriers to seeking treatment. Learn how we can change the conversation around addiction and mental health.',
    category: 'Awareness',
    author: 'Vikram Patel',
    published_at: '2025-06-10',
    content: `Stigma is one of the most destructive obstacles on the road to recovery. Societal misconceptions often label individuals struggling with substance use as irresponsible or criminal, leading to deep shame and reluctance to seek medical help.

### The Reality of Dual Diagnosis
Over 50% of individuals facing substance use disorders also experience co-occurring mental health conditions, such as depression, generalized anxiety disorder, PTSD, or bipolar disorder. Substances are frequently used as self-medication to cope with unaddressed emotional pain.

### How We Can Break the Stigma
- **Change the Language:** Use person-first language (e.g., 'a person with substance use disorder' instead of 'addict').
- **Educate Communities:** Share scientific knowledge about brain chemistry and genetic predispositions.
- **Celebrate Recovery:** Share stories of hope, healing, and transformation to prove that recovery is possible for everyone.`,
  },
  {
    id: 5,
    title: 'Nutrition and Recovery: Healing Your Body',
    slug: 'nutrition-recovery',
    excerpt: 'Proper nutrition is essential for recovery. Learn about the foods and dietary habits that support brain healing and overall physical restoration.',
    category: 'Wellness',
    author: 'Dr. Rahul Sen',
    published_at: '2025-05-25',
    content: `Prolonged substance abuse severely depletes the human body of vital nutrients, vitamins, and minerals. Chronic alcohol intake, for instance, leads to thiamine (Vitamin B1) deficiencies, while stimulants can disrupt gastrointestinal balance and cause severe malnutrition.

### Nutritional Pillars of Physical Healing
1. **Complex Carbohydrates:** Stabilize blood sugar and reduce mood swings and cravings.
2. **Quality Proteins & Amino Acids:** Provide the building blocks for key neurotransmitters like serotonin and dopamine.
3. **Omega-3 Fatty Acids:** Support brain cellular repair and reduce inflammation.
4. **Hydration & Herbal Infusions:** Flush metabolic toxins and maintain energy levels.

At Sarani, our in-house culinary and nutrition team designs personalized meal plans using fresh, locally sourced ingredients to nurture mind, body, and spirit.`,
  },
  {
    id: 6,
    title: 'Life After Rehab: Building a New Normal',
    slug: 'life-after-rehab',
    excerpt: 'Transitioning from rehabilitation to everyday life can be challenging. Here are practical strategies for maintaining sobriety and building a fulfilling life.',
    category: 'Recovery',
    author: 'Vikram Patel',
    published_at: '2025-05-10',
    content: `Completing residential treatment is a monumental milestone, but true long-term recovery is built in the daily choices that follow. Returning to everyday life requires intentionality, patience, and a robust support structure.

### Keys to a Successful Post-Rehab Transition
- **Establish a Daily Routine:** Structure wake times, exercise, work, and relaxation to eliminate idle trigger times.
- **Build a Sober Social Circle:** Engage with support groups, alumni meetings, and friends who respect your commitment to wellness.
- **Identify High-Risk Situations:** Develop concrete exit strategies for social events or high-stress situations.
- **Commit to Ongoing Counseling:** Regular follow-up sessions help navigate early life challenges before they turn into relapses.

Sarani's comprehensive aftercare network ensures that no patient ever walks the recovery journey alone.`,
  },
];

function formatMarkdown(text = '') {
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listType = 'ul';
  let listItems = [];

  const flushList = (keyPrefix) => {
    if (inList && listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(<ol key={`list-${keyPrefix}`}>{listItems}</ol>);
      } else {
        elements.push(<ul key={`list-${keyPrefix}`}>{listItems}</ul>);
      }
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(idx);
      return;
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(<h3 key={idx}>{trimmed.replace('### ', '')}</h3>);
      return;
    }

    // Heading 2: ##
    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(<h2 key={idx}>{trimmed.replace('## ', '')}</h2>);
      return;
    }

    // Unordered List: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList(idx);
        inList = true;
        listType = 'ul';
      }
      const itemContent = trimmed.replace(/^[-*]\s+/, '');
      listItems.push(
        <li key={`li-${idx}`} dangerouslySetInnerHTML={{ __html: parseBold(itemContent) }} />
      );
      return;
    }

    // Ordered List: 1.
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        flushList(idx);
        inList = true;
        listType = 'ol';
      }
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      listItems.push(
        <li key={`li-${idx}`} dangerouslySetInnerHTML={{ __html: parseBold(itemContent) }} />
      );
      return;
    }

    flushList(idx);
    elements.push(
      <p key={idx} dangerouslySetInnerHTML={{ __html: parseBold(trimmed) }} />
    );
  });

  flushList('end');
  return elements;
}

function parseBold(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/'(.*?)'/g, '‘$1’');
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchCollection('blog-posts');
        const list = data?.data?.length > 0 ? data.data : fallbackPosts;
        setAllPosts(list);
        const found = list.find(p => p.slug === slug || String(p.id) === slug);
        setPost(found || null);
      } catch {
        const found = fallbackPosts.find(p => p.slug === slug || String(p.id) === slug);
        setPost(found || null);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <section className="page-hero">
          <div className="page-hero__bg"></div>
          <div className="container">
            <p>Loading article...</p>
          </div>
        </section>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-page">
        <section className="page-hero">
          <div className="page-hero__bg"></div>
          <div className="container">
            <div className="blog-post__not-found glass-card">
              <h2>Article Not Found</h2>
              <p>The article you are looking for might have been moved or updated.</p>
              <Link to="/blog" className="btn btn-primary">
                ← Back to All Articles
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && (p.category === post.category || true))
    .slice(0, 3);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="blog-post-page" id="blog-post-page">
      {/* Post Header Hero */}
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <div className="blog-post__header">
            <Link to="/blog" className="blog-post__back">
              ← Back to All Articles
            </Link>
            <div className="blog-post__meta">
              <span className="blog-post__category">{post.category}</span>
              <span className="blog-post__date">{formattedDate}</span>
            </div>
            <h1 className="blog-post__title">{post.title}</h1>
            <div className="blog-post__author-bar">
              <div className="blog-post__author-avatar">
                {post.author ? post.author.split(' ').pop()?.[0] || 'S' : 'S'}
              </div>
              <div className="blog-post__author-info">
                <div className="blog-post__author-name">{post.author}</div>
                <span className="blog-post__author-sub">Sarani Clinical Editorial Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <article className="blog-post__article">
            {post.excerpt && (
              <div className="blog-post__callout">
                "{post.excerpt}"
              </div>
            )}

            <div className="blog-post__body">
              {formatMarkdown(post.content || post.excerpt || '')}
            </div>

            {/* Author Box */}
            <div className="blog-post__author-box glass-card">
              <div className="blog-post__author-box-avatar">🌿</div>
              <div className="blog-post__author-box-text">
                <h4>Published by Sarani Rehabilitation & Wellness</h4>
                <p>
                  Our medical, psychiatric, and counseling professionals are dedicated to providing
                  compassionate, evidence-based addiction treatment and holistic healing in Kolkata.
                </p>
              </div>
              <Link to="/contact" className="btn btn-accent btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Consult Team
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="blog-post__related">
                <div className="blog-post__related-header">
                  <span className="subtitle">Further Reading</span>
                  <h3>Related Articles</h3>
                </div>
                <div className="blog-post__related-grid">
                  {relatedPosts.map(rel => (
                    <article key={rel.id} className="blog-card glass-card">
                      <div className="blog-card__top">
                        <span className="blog-card__category">{rel.category}</span>
                      </div>
                      <h4 className="blog-card__title" style={{ fontSize: '1.1rem' }}>
                        <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p className="blog-card__excerpt" style={{ fontSize: '0.88rem' }}>
                        {rel.excerpt}
                      </p>
                      <div className="blog-card__footer">
                        <Link to={`/blog/${rel.slug}`} className="blog-card__read-more">
                          Read Article →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
