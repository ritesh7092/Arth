import React from 'react';
import { Link } from 'react-router-dom';

// Bootstrap & Font Awesome (ensure these packages are installed)
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

// Custom CSS (adjust path if needed)
import './landing.css';

/**
 * Home component renders the landing page.
 * @param {Object} props
 * @param {boolean} props.isAuthenticated - Whether the user is logged in.
 * @param {Function} props.handleLogout - Function to handle user logout.
 */
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
            className="navbar-toggler text-white"
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
                <>
                  {/* <li className="nav-item">
                    <Link to="/todo/dashboard" className="nav-link">
                      Todo Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/finance/dashboard" className="nav-link">
                      Finance Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                      Profile
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <button
                      type="button"
                      className="nav-link btn btn-link text-decoration-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
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
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Arth</h1>
          <p>Your intelligent platform for Task and Finance Management</p>
          <Link to="/todo/dashboard" className="btn btn-primary me-2">
            Explore Tasks
          </Link>
          <Link to="/finance/dashboard" className="btn btn-primary">
            Explore Finance
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Our Key Features</h2>
          <div className="row justify-content-center">
            <div className="col-md-4 feature-item">
              <i className="fa fa-tasks"></i>
              <h3>Task Management</h3>
              <p>
                Organize your tasks with ease and boost your productivity with our
                dynamic dashboard.
              </p>
            </div>
            <div className="col-md-4 feature-item">
              <i className="fa fa-chart-line"></i>
              <h3>Finance Tracking</h3>
              <p>
                Monitor your expenses and incomes, manage budgets, and get financial
                insights.
              </p>
            </div>
            <div className="col-md-4 feature-item">
              <i className="fa fa-robot"></i>
              <h3>Intelligent Assistance</h3>
              <p>
                Stay ahead with our smart assistant that provides tips and insights
                tailored for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <h2>Get Started with Arth Today!</h2>
          <p>
            Join our platform to streamline your tasks and finances with cutting-edge technology.
          </p>
          {/* Optionally display a register button if not authenticated */}
          {!isAuthenticated && (
            <Link to="/register" className="btn">
              Register Now
            </Link>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;

