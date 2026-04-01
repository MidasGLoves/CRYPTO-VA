import React, { useState, useRef, useEffect } from 'react';

function AccordionItem({ title, items, highlight }: { title: string, items: string[], highlight?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="accordion-item">
      <button 
        className={`accordion-header ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="icon">+</span>
      </button>
      <div 
        className="accordion-content"
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        ref={contentRef}
      >
        <div className="accordion-content-inner">
          <ul className="file-list scrollable-list">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
            {highlight && <li className="highlight">{highlight}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MainContent({ onHiddenClick }: { onHiddenClick: () => void }) {
  const [formState, setFormState] = useState<'form' | 'waiting' | 'ready'>('form');
  const [refNo, setRefNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ ref: '' });

  const submitOrder = async () => {
    let isValid = true;
    const newErrors = { ref: '' };

    if (!refNo || !/^\d{13}$/.test(refNo)) {
      newErrors.ref = 'Reference number must be exactly 13 digits.';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refNo })
      });
    } catch (e) {
      console.error(e);
    }

    setFormState('waiting');
    
    setTimeout(() => {
      setFormState('ready');
    }, 2500);
  };

  const startDownload = () => {
    window.location.href = '/api/download';
  };

  return (
    <>
      <header className="hero">
        <div className="badge-custom">The Executive Collection</div>
        <h1>Master Advanced Trading & Virtual Assistance.<br/><span>For Less Than a Cup of Coffee.</span></h1>
        <p>Equip yourself with the exact high-income skills businesses and markets are actively paying for. Download the complete premium bundle instantly.</p>
        <div className="price-tag">₱1</div>
        <div className="price-subtext">One-Time Investment • Lifetime Access</div>
        <button className="btn-custom" style={{ maxWidth: '320px', margin: '0 auto' }} onClick={() => document.getElementById('order')?.scrollIntoView()}>Secure Your Copy</button>
      </header>

      <section className="courses-section">
        <div className="section-header">
          <h2>The Premium Collection</h2>
          <p>Everything you need to start earning online, packaged into 2 comprehensive mastery tracks.</p>
        </div>
        
        <div className="course-grid">
          <div className="course-card">
            <div className="course-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </div>
            <h3>Advanced Crypto Trading</h3>
            <p>Master the markets. Learn technical analysis, candlestick patterns, risk management, and advanced trading strategies.</p>
          </div>
          
          <div className="course-card">
            <div className="course-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M9 16l2 2 4-4"></path>
              </svg>
            </div>
            <h3>Virtual Assistant Mastery</h3>
            <p>The ultimate remote work guide. From beginner basics to scaling an AI-driven VA agency.</p>
          </div>
        </div>
      </section>

      <section className="curriculum-section">
        <div className="section-header">
          <h2>Inside The Archive</h2>
          <p>Interactively explore the exact files, documents, and video modules included in your download.</p>
        </div>

        <div className="accordion-container">
          <AccordionItem 
            title="Advanced Crypto Trading (30+ Premium Guides)"
            items={[
              "10 Essential Chart Patterns Every Pro Trader Should Know",
              "24 Chart Patterns & Candlesticks Cheat Sheet",
              "Advanced Chart Patterns Cheat Sheet",
              "Advanced Technical Analysis for Traders",
              "Advanced Trading Strategies – Chart Patterns & Analysis",
              "Advanced Trading Strategy – Scale-In & Price Action",
              "All Candlestick Patterns PDF – Ultimate Cheat Sheet",
              "Applied Technical Analysis for Advanced Learners",
              "Classical Candlestick Patterns",
              "Crypto Trading Chart Patterns Explained",
              "Crypto Trading and Investing Guide",
              "Cryptocurrency Trading 101",
              "Foundations of Technical Analysis – Computational Algorithms",
              "Generating a Trading Strategy Using Candlestick Patterns",
              "Identifying Chart Patterns with Technical Analysis",
              "Investor's Guide to Cryptocurrencies",
              "Japanese Candlestick Charting Techniques – 2nd Edition",
              "Price Action and Pattern Trading Course",
              "Price Action Trading Guide – Candlesticks & Chart Patterns",
              "Profiting from Technical Analysis and Candlestick Indicators",
              "Revealing Secret Trading Patterns – Advanced Guide",
              "Technical Analysis Course – Candlestick Charts",
              "Technical Analysis – Candles, Patterns & Bloomberg Tools",
              "The Candlestick Course by Steve Nison",
              "Trade Chart Patterns Like the Pros"
            ]}
            highlight="+ 10 More Advanced Trading Documents..."
          />
          <AccordionItem 
            title="Virtual Assistant - Beginner (7 Guides)"
            items={[
              "VA Booklet",
              "How to Become VA",
              "VA Survival Guide",
              "FabJob Sample Guide",
              "VA Skills Entrepreneurship",
              "NATS VA Article",
              "MOD Launch Guide"
            ]}
          />
          <AccordionItem 
            title="Virtual Assistant - Intermediate (7 Guides)"
            items={[
              "OfficeFinder Guide",
              "Belay Ultimate Guide",
              "MOD Marketing VA",
              "Small Business VA Guide",
              "Outsourcing Social Media",
              "Productivity VA Ebook",
              "Definitive Outsourcing Guide"
            ]}
          />
          <AccordionItem 
            title="Virtual Assistant - Advanced (13 Guides)"
            items={[
              "VA Trainers Handbook",
              "Scaling Business VA",
              "Oracle Intelligent VA",
              "RevenueAI Whitepaper",
              "VA Business Plan",
              "Evaluating VA Company",
              "AI Agents Workflow",
              "BCG AI Value Gap",
              "WordStream Agency Capabilities",
              "Agency of the Future",
              "VA Agreement Templates",
              "Enterprise Intelligent Assistants",
              "How to Hire VA Ebook"
            ]}
            highlight="Includes advanced agency scaling and AI workflows."
          />
        </div>
      </section>

      <section className="order-section" id="order">
        <div className="form-container">
          <div className="payment-instructions">
            <h3>How to Claim Your Bundle</h3>
            <p>1. Send exactly <strong>₱1.00</strong> via GCash</p>
            <p>Number: <strong>09770950502</strong></p>
            <p>Name: <strong>J******* J**** C****</strong></p>
          </div>

          {formState === 'form' && (
            <div id="state-form">
              <div className="form-group">
                <label>Reference Number</label>
                <input type="text" maxLength={13} value={refNo} onChange={e => setRefNo(e.target.value)} placeholder="e.g., 1234567890123" />
                {errors.ref && <div className="error-msg" style={{ display: 'block' }}>{errors.ref}</div>}
              </div>
              <button className="btn-custom" disabled={isSubmitting} onClick={submitOrder}>
                {isSubmitting ? 'Processing...' : 'Verify & Download'}
              </button>
            </div>
          )}

          {formState === 'waiting' && (
            <div id="state-waiting">
              <div className="status-box">
                <div className="spinner"></div>
                <h3 style={{ color: 'var(--gold)' }}>Verifying Payment</h3>
                <p>Please do not close this window. Your secure download link is being generated.</p>
                <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Auto-checking...</p>
              </div>
            </div>
          )}

          {formState === 'ready' && (
            <div id="state-ready">
              <div className="status-box" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#fff' }}>Verification Complete</h3>
                <p>Your premium bundle is ready. Click below to start your download.</p>
                <button className="btn-custom btn-download" onClick={startDownload}>Download Bundle Now</button>
                <p style={{ fontSize: '0.75rem', marginTop: '25px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Note: This secure link will expire automatically.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="instructions-section">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem' }}>How to Open Your Files</h2>
          <p>Your premium bundle is delivered as a secure .ZIP archive.</p>
        </div>
        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="instruction-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h4>Desktop / PC</h4>
            <p><strong>Windows:</strong> Right-click the downloaded .zip file and select "Extract All...".<br/><br/><strong>Mac:</strong> Simply double-click the .zip file to automatically extract its contents into a new folder.</p>
          </div>
          <div className="instruction-card">
            <div className="instruction-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h4>Mobile / Tablet</h4>
            <p><strong>iOS (iPhone):</strong> Open the "Files" app, locate the download, and tap it to unzip.<br/><br/><strong>Android:</strong> Open "Files by Google" or your default file manager, tap the .zip file, and select "Extract".</p>
          </div>
        </div>
      </section>

      <footer>
        <p 
          onClick={onHiddenClick} 
          style={{ cursor: 'pointer', display: 'inline-block' }}
        >
          © 2026 Premium Digital Assets. All rights reserved.
        </p>
        <p style={{ marginTop: '8px', fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '2px' }}>Invest in your skills. Invest in your future.</p>
      </footer>
    </>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "The Premium Freelance Bundle | ₱1 Only";
  }, []);

  const [view, setView] = useState('main');
  const [submissions, setSubmissions] = useState<any[]>([]);

  const handleHiddenClick = async () => {
    const pwd = prompt('Enter admin password:');
    if (pwd === 'Somena') {
      try {
        const res = await fetch('/api/verify-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.submissions);
          setView('admin');
        } else {
          alert('Incorrect password');
        }
      } catch (e) {
        alert('Error verifying password');
      }
    } else if (pwd !== null) {
      alert('Incorrect password');
    }
  };

  if (view === 'admin') {
    return (
      <div className="p-8 text-white min-h-screen bg-[#030303]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-[#D4AF37] font-serif">Admin View - Submissions</h1>
            <button onClick={() => setView('main')} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded transition-colors">Back to Site</button>
          </div>
          
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111]">
                  <th className="border-b border-gray-800 p-4 font-medium text-gray-400">Time</th>
                  <th className="border-b border-gray-800 p-4 font-medium text-gray-400">Ref Number</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500">No submissions yet.</td>
                  </tr>
                ) : (
                  submissions.map((sub: any, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="border-b border-gray-800 p-4 text-sm text-gray-300">{new Date(sub.timestamp).toLocaleString()}</td>
                      <td className="border-b border-gray-800 p-4 font-mono text-sm text-[#D4AF37]">{sub.refNo || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return <MainContent onHiddenClick={handleHiddenClick} />;
}
