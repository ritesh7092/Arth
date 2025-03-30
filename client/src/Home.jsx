import React from 'react';
import { Link } from 'react-router-dom';
import homebg from './assets/bg-theme.png'; // Ensure this path is correct

// Bootstrap & Font Awesome (ensure these packages are installed)
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

// Custom CSS
import './landing.css';

const Home = ({ isAuthenticated, handleLogout }) => {
  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Arth
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${homebg})` }}>
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center">
          <h1 className="display-4">Welcome to Arth</h1>
          <p className="lead">
            Your personal finance and task management platform for a smarter lifestyle.
          </p>
          <p className="mb-4">
            Manage your tasks and finances effortlessly. Join us today and take control of your life!
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg">
              Learn More
            </Link>
            <Link to="/todo/dashboard" className="btn btn-secondary btn-lg">
              Explore Tasks
            </Link>
            <Link to="/finance/dashboard" className="btn btn-secondary btn-lg">
              Explore Finance
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">Our Key Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-item p-4 text-center">
                <i className="fa fa-tasks mb-3"></i>
                <h3>Task Management</h3>
                <p>
                  Organize your tasks with ease and boost your productivity using our dynamic dashboard.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item p-4 text-center">
                <i className="fa fa-chart-line mb-3"></i>
                <h3>Finance Tracking</h3>
                <p>
                  Monitor your expenses and incomes, manage budgets, and get deep financial insights.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item p-4 text-center">
                <i className="fa fa-robot mb-3"></i>
                <h3>Intelligent Assistance</h3>
                <p>
                  Stay ahead with our smart assistant providing personalized tips and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta py-5">
        <div className="container text-center">
          <h2>Get Started with Arth Today!</h2>
          <p>
            Join our platform to streamline your tasks and finances with cutting-edge technology.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-outline-light btn-lg mt-3">
              Register Now
            </Link>
          )}
        </div>
      </section>

      
      

      {/* Scroll-to-top Button */}
      <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default Home;

