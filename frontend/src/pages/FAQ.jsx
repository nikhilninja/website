import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/api';
import './FAQ.css';

const fallbackFAQs = [
  { id: 1, question: 'What types of addictions do you treat?', answer: 'We treat a wide range of addictions including alcohol, drugs (heroin, cocaine, cannabis, prescription drugs), behavioral addictions (gambling, internet, gaming), and co-occurring mental health disorders.', category: 'Treatment' },
  { id: 2, question: 'How long does treatment typically last?', answer: 'Treatment duration varies based on individual needs. Our programs range from 30 to 90 days for residential treatment. We create personalized treatment plans based on assessment results, and some patients benefit from extended care.', category: 'Treatment' },
  { id: 3, question: 'Is the treatment confidential?', answer: 'Absolutely. We maintain strict confidentiality for all patients. Your privacy is protected by law, and we take extra measures to ensure your treatment remains private. Medical records are kept secure and shared only with your consent.', category: 'Privacy' },
  { id: 4, question: 'Can family members visit during treatment?', answer: 'Yes, we encourage family involvement in the recovery process. We have designated visiting hours and also offer family therapy sessions. Family visits are scheduled to support the patient\'s treatment goals.', category: 'Family' },
  { id: 5, question: 'What is included in the treatment cost?', answer: 'Our treatment packages include accommodation, meals, medical care, therapy sessions, recreational activities, yoga and wellness programs, and aftercare planning. We strive to provide transparent pricing with no hidden costs.', category: 'Financial' },
  { id: 6, question: 'Do you accept insurance?', answer: 'We work with several insurance providers. Our admissions team can help verify your insurance coverage and explain available financing options. We believe that financial constraints should not be a barrier to recovery.', category: 'Financial' },
  { id: 7, question: 'What happens after treatment is complete?', answer: 'We provide a comprehensive aftercare program including regular follow-up sessions, alumni support groups, crisis hotline access, and relapse prevention planning. Recovery is a lifelong journey, and we\'re here for the long term.', category: 'Aftercare' },
  { id: 8, question: 'How do I know if I or a loved one needs treatment?', answer: 'If substance use is causing problems in daily life, relationships, work, health, or finances, it may be time to seek help. We offer free confidential assessments. Call us at +91 7001657578 for a no-obligation consultation.', category: 'General' },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(fallbackFAQs);
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      const data = await fetchCollection('faqs');
      if (data?.data?.length > 0) {
        setFaqs(data.data);
      }
    }
    load();
  }, []);

  const categories = ['All', ...new Set(faqs.map(f => f.category))];
  const filtered = filter === 'All' ? faqs : faqs.filter(f => f.category === filter);

  return (
    <div className="faq-page" id="faq-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <span className="page-hero__badge">FAQ</span>
          <h1>Frequently Asked <span className="text-accent">Questions</span></h1>
          <p>Find answers to common questions about our treatment programs and facilities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq__filters">
            {categories.map(cat => (
              <button key={cat} className={`blog__filter ${filter === cat ? 'blog__filter--active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div className="faq__list">
            {filtered.map(faq => (
              <div key={faq.id} className={`faq-item ${openId === faq.id ? 'faq-item--open' : ''}`}>
                <button className="faq-item__question" onClick={() => setOpenId(openId === faq.id ? null : faq.id)}>
                  <span>{faq.question}</span>
                  <span className="faq-item__icon">{openId === faq.id ? '−' : '+'}</span>
                </button>
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
