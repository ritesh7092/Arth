// Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import homebg from './assets/bg-theme.png'; // Adjust path as needed

// Bootstrap & Font Awesome
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Custom CSS
import './landing.css';

const Home = ({ isAuthenticated, handleLogout }) => {
  // Toggle scroll‐to‐top button visibility
  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset > 200) {
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-wrapper">
      {/* =====================
          1. NAVBAR
         ===================== */}
      <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
        <div className="container px-4">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="text-gradient-logo">Arth</span>
            <small className="ms-2 d-none d-md-inline text-tagline">
              Finance · Tasks · AI
            </small>
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {!isAuthenticated && (
                <>
                  <li className="nav-item mx-1">
                    <Link to="/login" className="nav-link btn-link-custom">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link to="/signup" className="nav-link btn-link-custom">
                      Register
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <li className="nav-item mx-1">
                  <button
                    type="button"
                    className="nav-link btn btn-link btn-link-custom"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* =====================
          2. HERO SECTION
         ===================== */}
      <section
        className="hero-section d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center text-white px-3 px-md-5">
          <h1 className="display-3 fw-bold hero-title">
            Welcome to <span className="text-gradient-logo">Arth</span>
          </h1>
          <p className="lead hero-subtitle mb-3">
            All-in-one platform for <u>Finance</u>, <u>Task Management</u>, &amp; <u>AI Insights</u>
          </p>
          <p className="mb-4 hero-description">
            Streamline your workflow—manage tasks, track budgets, and get AI-driven advice. Empower your productivity and financial health.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
            <Link to="/login" className="btn btn-lg cta-btn-primary">
              Get Started
            </Link>
            <Link to="/about" className="btn btn-lg cta-btn-outline">
              Learn More
            </Link>
            <Link to="/todo/dashboard" className="btn btn-lg cta-btn-secondary">
              Explore Tasks
            </Link>
            <Link to="/finance/dashboard" className="btn btn-lg cta-btn-secondary">
              Explore Finance
            </Link>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
              fill="#f8f9fa"
            ></path>
          </svg>
        </div>
      </section>

      {/* =====================
          3. FEATURES SECTION
         ===================== */}
      <section className="features-section py-5">
        <div className="container px-4">
          <h2 className="section-title text-center mb-5">Our Key Features</h2>
          <div className="row g-4 justify-content-center">
            {/* TASK MANAGEMENT */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                {/* Overlapping Icon Circle */}
                <div className="icon-circle bg-primary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-tasks fa-2x icon-primary"></i>
                </div>
                <h3 className="feature-title-advanced mt-4">Task Management</h3>
                <p className="feature-text-advanced">
                  Organize tasks with Kanban boards, set priorities, and track progress in real time.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Drag &amp; drop, due-date reminders, collaborative editing)
                </small>
              </div>
            </div>

            {/* FINANCE TRACKING */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                <div className="icon-circle bg-secondary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-chart-line fa-2x icon-secondary"></i>
                </div>
                <h3 className="feature-title-advanced mt-4">Finance Tracking</h3>
                <p className="feature-text-advanced">
                  Real-time dashboards, budget alerts, and multi-currency support for global users.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Charts, recurring transactions, exportable reports)
                </small>
              </div>
            </div>

            {/* AI ASSISTANCE */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                <div className="icon-circle bg-tertiary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-robot fa-2x icon-tertiary"></i>
                </div>
                <h3 className="feature-title-advanced mt-4">AI Assistance</h3>
                <p className="feature-text-advanced">
                  Personalized recommendations based on your habits—powered by in-house AI.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Chatbot, predictive insights, tailored tips)
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================
          4. CTA SECTION (Emerald Gradient + Slanted Edge)
         ===================== */}
      <section className="cta-section-advanced position-relative text-white py-5">
        <div className="cta-gradient-overlay-advanced"></div>
        <div className="cta-pattern-overlay"></div>
        <div className="container px-4 position-relative text-center">
          <h2 className="cta-title-advanced fw-bold mb-3">Ready to Elevate Your Workflow?</h2>
          <p className="cta-text-advanced mb-5">
            Join now and unify your tasks, finances, and AI insights—designed for global teams and individuals.
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-lg cta-btn-box">
              Register Now
            </Link>
          )}
        </div>
        {/* Slanted bottom edge */}
        <div className="cta-slant-edge"></div>
      </section>

      {/* =====================
          5. SCROLL‐TO‐TOP BUTTON
         ===================== */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default Home;
