import { Link } from 'react-router-dom';
import ServiceLink from '../components/ServiceLink';

const features = [
  {
    icon: '◎',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
    title: 'Client Management',
    text: 'Store client profiles with name, email, and phone. Search, edit, and organize your entire client directory in one place.',
  },
  {
    icon: '◉',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    title: 'Consultation Scheduling',
    text: 'Book sessions with date, time, and remarks. Link every consultation to a client and track session history effortlessly.',
  },
  {
    icon: '▶',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop',
    title: 'Recording Storage',
    text: 'Upload audio and video files per consultation. Download, search, and manage all your session recordings securely.',
  },
  {
    icon: '⚙',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Admin Dashboard',
    text: 'View system-wide stats, recent activity, and export data as CSV. Full control from a single admin panel.',
  },
];

const steps = [
  { num: '01', title: 'Add Clients', text: 'Create client profiles with their contact details.' },
  { num: '02', title: 'Schedule Sessions', text: 'Book consultations and add session notes.' },
  { num: '03', title: 'Upload Recordings', text: 'Attach audio or video files to each session.' },
  { num: '04', title: 'Review & Export', text: 'Search records and export data from the admin panel.' },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Professional Consultation Platform</span>
          <h1>
            Manage clients, sessions &amp; recordings — <span>all in one place</span>
          </h1>
          <p>
            ConsultHub helps consultants, coaches, and professionals organize client meetings,
            store session recordings, and keep every consultation detail at their fingertips.
          </p>
          <div className="hero-actions">
            <ServiceLink to="/dashboard" className="btn btn-dark btn-lg">Get Started</ServiceLink>
            <ServiceLink to="/clients" className="btn btn-dark-outline btn-lg">Add Your First Client</ServiceLink>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
            alt="Professional consultation meeting"
            className="hero-image-bg"
          />
          <ServiceLink to="/clients" className="hero-card hero-card-dark hero-card-1">
            <span>◎</span>
            <div>
              <strong>Clients</strong>
              <p>Organized profiles</p>
            </div>
          </ServiceLink>
          <ServiceLink to="/consultations" className="hero-card hero-card-dark hero-card-2">
            <span>◉</span>
            <div>
              <strong>Consultations</strong>
              <p>Scheduled sessions</p>
            </div>
          </ServiceLink>
          <ServiceLink to="/recordings" className="hero-card hero-card-dark hero-card-3">
            <span>▶</span>
            <div>
              <strong>Recordings</strong>
              <p>Secure uploads</p>
            </div>
          </ServiceLink>
        </div>
      </section>

      <section className="home-section" id="features">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2>Everything you need to run consultations</h2>
          <p>Built for professionals who need a simple, reliable way to manage their practice.</p>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <img src={f.image} alt={f.title} className="feature-image" />
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section cream-section" id="how-it-works">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2>Up and running in four simple steps</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section" id="about">
        <div className="about-grid">
          <div className="about-text">
            <span className="section-tag">About ConsultHub</span>
            <h2>Your trusted consultation companion</h2>
            <p>
              ConsultHub was built to solve a common problem — scattered client notes, lost recordings,
              and no central place to manage consultations. Whether you are a therapist, business coach,
              legal consultant, or healthcare professional, ConsultHub keeps your workflow clean and organized.
            </p>
            <p>
              With powerful search, easy file uploads, and a beautiful admin dashboard, you can focus
              on what matters most — your clients.
            </p>
            <ServiceLink to="/dashboard" className="btn btn-primary">Go to Dashboard</ServiceLink>
          </div>
          <div className="about-visual">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=400&fit=crop"
              alt="Team collaboration"
              className="about-image"
            />
            <div className="about-stats">
              <div className="about-stat">
                <strong>100%</strong>
                <span>Free to use</span>
              </div>
              <div className="about-stat">
                <strong>Secure</strong>
                <span>Local data storage</span>
              </div>
              <div className="about-stat">
                <strong>Fast</strong>
                <span>Instant search</span>
              </div>
              <div className="about-stat">
                <strong>Simple</strong>
                <span>Easy interface</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to organize your consultations?</h2>
        <p>Start managing clients, sessions, and recordings today — it only takes a minute.</p>
        <ServiceLink to="/dashboard" className="btn btn-white btn-lg">Launch ConsultHub</ServiceLink>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span>🎙</span>
          <strong>ConsultHub</strong>
        </div>
        <p>Consultation Recording Manager — built with Spring Boot &amp; React</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/consultations">Consultations</Link>
          <Link to="/recordings">Recordings</Link>
        </div>
        <p className="footer-copy">&copy; 2026 ConsultHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
