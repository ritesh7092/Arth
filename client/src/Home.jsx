// src/Home.jsx
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import homebg from "./assets/bg-theme.png";

// Bootstrap & Font Awesome
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

// Lucide React icons
import { Moon, Sun } from 'lucide-react';

// Custom CSS
import "./landing.css";

// Import your theme hook
import { useTheme } from "./theme/ThemeProvider";

const Home = ({ isAuthenticated, handleLogout }) => {
  const featureRef = useRef(null);
  const whyRef     = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Scroll-to-top button & reveal-on-scroll animations
  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset > 200) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }

      [featureRef, whyRef].forEach(refObj => {
        if (!refObj.current) return;
        const rect = refObj.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - rect.height * 0.2) {
          refObj.current.classList.add("reveal");
        } else {
          refObj.current.classList.remove("reveal");
        }
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // trigger on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-wrapper">
      {/* 1. NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
        <div className="container px-4 d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="text-gradient-logo">Arth</span>
            <small className="ms-2 d-none d-md-inline text-tagline">
              Finance · Tasks · AI
            </small>
          </Link>
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* Theme Toggle */}
            <li className="nav-item mx-1">
              <button
                type="button"
                className="nav-link btn-link-custom theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark'
                  ? <Sun className="w-5 h-5" />
                  : <Moon className="w-5 h-5" />
                }
              </button>
            </li>
            {!isAuthenticated ? (
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
            ) : (
              <li className="nav-item mx-1">
                <button
                  type="button"
                  className="nav-link btn btn-link btn-link-custom d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <i className="fa fa-sign-out me-1" aria-hidden="true"></i>
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section
        className="hero-section d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${homebg})` }}
      >
        <div className="hero-overlay" />
        <div className="container hero-content text-center text-white px-3 px-md-5">
          <h1 className="display-3 fw-bold hero-title">
            Welcome to <span className="text-gradient-logo">Arth</span>
          </h1>
          <p className="lead hero-subtitle mb-3">
            All-in-one platform for <u>Finance</u>, <u>Task Management</u>, &amp;{" "}
            <u>AI Insights</u>
          </p>
          <p className="mb-4 hero-description">
            Streamline your workflow—manage tasks, track budgets, and get AI-driven
            advice. Empower your productivity and financial health.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
            <Link to="/dashboard" className="btn btn-lg cta-btn-primary">
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
              fill="var(--wave-fill-color)"
            />
          </svg>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="features-section py-5" ref={featureRef}>
        <div className="container px-4">
          <h2 className="section-title text-center mb-5">Our Key Features</h2>
          <div className="row g-4 justify-content-center">
            {/* Task Management */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                <div className="icon-circle bg-primary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-tasks fa-2x icon-primary" />
                </div>
                <h3 className="feature-title-advanced mt-4">Task Management</h3>
                <p className="feature-text-advanced">
                  Organize tasks with Kanban boards, set priorities, and track
                  progress in real time.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Drag &amp; drop, due-date reminders)
                </small>
              </div>
            </div>
            {/* Finance Tracking */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                <div className="icon-circle bg-secondary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-money fa-2x icon-secondary" />
                </div>
                <h3 className="feature-title-advanced mt-4">Finance Tracking</h3>
                <p className="feature-text-advanced">
                  Track your spending, set budgets, and view simple charts to stay
                  on top of your finances.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Dashboard, recurring transactions)
                </small>
              </div>
            </div>
            {/* AI Assistance */}
            <div className="col-12 col-md-4">
              <div className="feature-card-advanced position-relative p-4">
                <div className="icon-circle bg-tertiary-shadow d-flex align-items-center justify-content-center">
                  <i className="fa fa-comments fa-2x icon-tertiary" />
                </div>
                <h3 className="feature-title-advanced mt-4">AI Assistance</h3>
                <p className="feature-text-advanced">
                  Chat with an AI-powered assistant to get personalized tips and
                  quick answers about tasks or budget queries.
                </p>
                <small className="text-muted feature-note-advanced">
                  (Smart suggestions, future enhancements)
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY ARTH SECTION */}
      <section className="why-section py-5" ref={whyRef}>
        <div className="container px-4">
          <h2 className="section-title text-center mb-5">Why Choose Arth?</h2>
          <div className="row g-4 justify-content-center text-center">
            <div className="col-12 col-md-3">
              <div className="why-card p-4">
                <i className="fa fa-lock fa-3x mb-3 why-icon" />
                <h4 className="why-title">Secure Authentication</h4>
                <p className="why-text">
                  Built on Spring Security with JWT, ensuring your account and data remain protected.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="why-card p-4">
                <i className="fa fa-comments fa-3x mb-3 why-icon" />
                <h4 className="why-title">AI Chatbot</h4>
                <p className="why-text">
                  Intelligent, AI-driven assistant—coming soon to help manage tasks & finances.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="why-card p-4">
                <i className="fa fa-user fa-3x mb-3 why-icon" />
                <h4 className="why-title">User-Centric Design</h4>
                <p className="why-text">
                  Simple interfaces tailored for you—focus on productivity and financial health.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="why-card p-4">
                <i className="fa fa-rocket fa-3x mb-3 why-icon" />
                <h4 className="why-title">Fast Performance</h4>
                <p className="why-text">
                  Lightweight, optimized pages ensure swift load times and responsiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="cta-section-advanced position-relative text-white py-5">
        <div className="cta-gradient-overlay-advanced" />
        <div className="cta-pattern-overlay" />
        <div className="container px-4 position-relative text-center">
          <h2 className="cta-title-advanced fw-bold mb-3">
            Ready to Elevate Your Workflow?
          </h2>
          <p className="cta-text-advanced mb-5">
            Join now and unify your tasks, finances, and AI insights.
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="btn btn-lg cta-btn-box">
              Register Now
            </Link>
          )}
        </div>
        <div className="cta-slant-edge" />
      </section>

      {/* 6. SCROLL-TO-TOP BUTTON */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <i className="fa fa-arrow-up" />
      </button>
    </div>
  );
};

export default Home;



// import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import homebg from "./assets/bg-theme.png"; // Adjust path as needed

// // Bootstrap & Font Awesome
// import "bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";

// // Lucide React for modern icons (optional, but good for theme toggle)
// import { Moon, Sun } from 'lucide-react'; // Make sure you have lucide-react installed

// // Custom CSS
// import "./landing.css";

// const Home = ({ isAuthenticated, handleLogout }) => {
//   const featureRef = useRef(null);
//   const whyRef = useRef(null);
//   const [isDarkMode, setIsDarkMode] = useState(false); // State for theme

//   // Function to toggle theme
//   const toggleTheme = () => {
//     setIsDarkMode(prevMode => !prevMode);
//   };

//   // Toggle scroll-to-top button & “reveal on scroll” animations
//   useEffect(() => {
//     const onScroll = () => {
//       if (window.pageYOffset > 200) {
//         document.body.classList.add("scrolled");
//       } else {
//         document.body.classList.remove("scrolled");
//       }

//       // Reveal-on-scroll for Features & Why sections
//       [featureRef, whyRef].forEach((refObj) => {
//         if (!refObj.current) return;
//         const rect = refObj.current.getBoundingClientRect();
//         // Add reveal class when 80% of element is visible
//         if (rect.top < window.innerHeight - (rect.height * 0.2)) {
//           refObj.current.classList.add("reveal");
//         } else {
//             refObj.current.classList.remove("reveal"); // Optionally remove on scroll back up
//         }
//       });
//     };

//     window.addEventListener("scroll", onScroll);
//     onScroll(); // trigger on mount
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     // Apply 'dark-theme' class based on state
//     <div className={`home-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
//       {/* =====================
//           1. NAVBAR (No Hamburger)
//           ===================== */}
//       <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
//         <div className="container px-4 d-flex align-items-center justify-content-between">
//           {/* Brand */}
//           <Link to="/" className="navbar-brand d-flex align-items-center">
//             <span className="text-gradient-logo">Arth</span>
//             <small className="ms-2 d-none d-md-inline text-tagline">
//               Finance · Tasks · AI
//             </small>
//           </Link>

//           {/* Always-visible nav links (no collapse) */}
//           <ul className="navbar-nav ms-auto d-flex align-items-center">
//             {/* Theme Toggle Button */}
//             <li className="nav-item mx-1">
//               <button
//                 type="button"
//                 className="nav-link btn-link-custom theme-toggle-btn"
//                 onClick={toggleTheme}
//                 aria-label="Toggle theme"
//               >
//                 {isDarkMode ? (
//                   <Sun className="w-5 h-5" /> // Lucide Sun icon
//                 ) : (
//                   <Moon className="w-5 h-5" /> // Lucide Moon icon
//                 )}
//               </button>
//             </li>

//             {!isAuthenticated ? (
//               <>
//                 <li className="nav-item mx-1">
//                   <Link to="/login" className="nav-link btn-link-custom">
//                     Login
//                   </Link>
//                 </li>
//                 <li className="nav-item mx-1">
//                   <Link to="/signup" className="nav-link btn-link-custom">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item mx-1">
//                 <button
//                   type="button"
//                   className="nav-link btn btn-link btn-link-custom d-flex align-items-center"
//                   onClick={handleLogout}
//                 >
//                   <i className="fa fa-sign-out me-1" aria-hidden="true"></i>
//                   <span>Logout</span>
//                 </button>
//               </li>
//             )}
//           </ul>
//         </div>
//       </nav>

//       {/* =====================
//           2. HERO SECTION
//           ===================== */}
//       <section
//         className="hero-section d-flex align-items-center justify-content-center"
//         style={{ backgroundImage: `url(${homebg})` }}
//       >
//         <div className="hero-overlay"></div>
//         <div className="container hero-content text-center text-white px-3 px-md-5">
//           <h1 className="display-3 fw-bold hero-title">
//             Welcome to <span className="text-gradient-logo">Arth</span>
//           </h1>
//           <p className="lead hero-subtitle mb-3">
//             All-in-one platform for <u>Finance</u>, <u>Task Management</u>, &amp;{" "}
//             <u>AI Insights</u>
//           </p>
//           <p className="mb-4 hero-description">
//             Streamline your workflow—manage tasks, track budgets, and get AI-driven
//             advice. Empower your productivity and financial health.
//           </p>
//           <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
//             <Link to="/dashboard" className="btn btn-lg cta-btn-primary">
//               Get Started
//             </Link>
//             <Link to="/about" className="btn btn-lg cta-btn-outline">
//               Learn More
//             </Link>
//             <Link to="/todo/dashboard" className="btn btn-lg cta-btn-secondary">
//               Explore Tasks
//             </Link>
//             <Link to="/finance/dashboard" className="btn btn-lg cta-btn-secondary">
//               Explore Finance
//             </Link>
//           </div>
//         </div>
//         <div className="hero-wave">
//           <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
//             <path
//               d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
//               fill="var(--section-bg-color)" // Use CSS variable here
//             ></path>
//           </svg>
//         </div>
//       </section>

//       {/* =====================
//     3. FEATURES SECTION
//     ===================== */}
// <section className="features-section py-5" ref={featureRef}>
//   <div className="container px-4">
//     <h2 className="section-title text-center mb-5">Our Key Features</h2>
//     <div className="row g-4 justify-content-center">
//       {/* TASK MANAGEMENT */}
//       <div className="col-12 col-md-4">
//         <div className="feature-card-advanced position-relative p-4">
//           <div className="icon-circle bg-primary-shadow d-flex align-items-center justify-content-center">
//             <i className="fa fa-tasks fa-2x icon-primary" aria-hidden="true"></i>
//           </div>
//           <h3 className="feature-title-advanced mt-4">Task Management</h3>
//           <p className="feature-text-advanced">
//             Organize tasks with Kanban boards, set priorities, and track
//             progress in real time.
//           </p>
//           <small className="text-muted feature-note-advanced">
//             (Drag &amp; drop, due-date reminders)
//           </small>
//         </div>
//       </div>

//       {/* FINANCE TRACKING */}
//       <div className="col-12 col-md-4">
//         <div className="feature-card-advanced position-relative p-4">
//           <div className="icon-circle bg-secondary-shadow d-flex align-items-center justify-content-center">
//             <i className="fa fa-money fa-2x icon-secondary" aria-hidden="true"></i>
//           </div>
//           <h3 className="feature-title-advanced mt-4">Finance Tracking</h3>
//           <p className="feature-text-advanced">
//             Track your spending, set budgets, and view simple charts to stay
//             on top of your finances.
//           </p>
//           <small className="text-muted feature-note-advanced">
//             (Dashboard, recurring transactions)
//           </small>
//         </div>
//       </div>

//       {/* AI ASSISTANCE */}
//       <div className="col-12 col-md-4">
//         <div className="feature-card-advanced position-relative p-4">
//           <div className="icon-circle bg-tertiary-shadow d-flex align-items-center justify-content-center">
//             <i className="fa fa-comments fa-2x icon-tertiary" aria-hidden="true"></i>
//           </div>
//           <h3 className="feature-title-advanced mt-4">AI Assistance</h3>
//           <p className="feature-text-advanced">
//             Chat with an AI-powered assistant to get personalized tips and
//             quick answers about tasks or budget queries.
//           </p>
//           <small className="text-muted feature-note-advanced">
//             (Smart suggestions, future enhancements)
//           </small>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>


//       {/* =====================
//     4. WHY ARTH SECTION
//     ===================== */}
// <section className="why-section py-5" ref={whyRef}>
//   <div className="container px-4">
//     <h2 className="section-title text-center mb-5">Why Choose Arth?</h2>
//     <div className="row g-4 justify-content-center text-center">
//       {/* SECURE AUTHENTICATION */}
//       <div className="col-12 col-md-3">
//         <div className="why-card p-4">
//           <i className="fa fa-lock fa-3x mb-3 why-icon" aria-hidden="true"></i>
//           <h4 className="why-title">Secure Authentication</h4>
//           <p className="why-text">
//             Built on Spring Security with JWT, ensuring your account and data remain protected at every step.
//           </p>
//         </div>
//       </div>

//       {/* AI CHATBOT (COMING SOON) */}
//       <div className="col-12 col-md-3">
//         <div className="why-card p-4">
//           <i className="fa fa-comments fa-3x mb-3 why-icon" aria-hidden="true"></i>
//           <h4 className="why-title">AI Chatbot</h4>
//           <p className="why-text">
//             Get intelligent, AI-driven insights and assistance—currently in development to help you manage tasks and finances with ease.
//           </p>
//         </div>
//       </div>

//       {/* USER-CENTRIC DESIGN */}
//       <div className="col-12 col-md-3">
//         <div className="why-card p-4">
//           <i className="fa fa-user fa-3x mb-3 why-icon" aria-hidden="true"></i>
//           <h4 className="why-title">User-Centric Design</h4>
//           <p className="why-text">
//             Simple interfaces tailored for individuals—focus on your personal productivity and financial health, no teamwork required.
//           </p>
//         </div>
//       </div>

//       {/* FAST PERFORMANCE */}
//       <div className="col-12 col-md-3">
//         <div className="why-card p-4">
//           <i className="fa fa-rocket fa-3x mb-3 why-icon" aria-hidden="true"></i>
//           <h4 className="why-title">Fast Performance</h4>
//           <p className="why-text">
//             Lightweight, optimized pages ensure swift load times so you can manage tasks and track budgets without delay.
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>


//       {/* =====================
//           5. CTA SECTION
//           ===================== */}
//       <section className="cta-section-advanced position-relative text-white py-5">
//         <div className="cta-gradient-overlay-advanced"></div>
//         <div className="cta-pattern-overlay"></div>
//         <div className="container px-4 position-relative text-center">
//           <h2 className="cta-title-advanced fw-bold mb-3">
//             Ready to Elevate Your Workflow?
//           </h2>
//           <p className="cta-text-advanced mb-5">
//             Join now and unify your tasks, finances, and AI insights—designed for
//             individuals.
//           </p>
//           {!isAuthenticated && (
//             <Link to="/signup" className="btn btn-lg cta-btn-box">
//               Register Now
//             </Link>
//           )}
//         </div>
//         {/* Slanted bottom edge */}
//         <div className="cta-slant-edge"></div>
//       </section>

//       {/* =====================
//           6. SCROLL-TO-TOP BUTTON
//           ===================== */}
//       <button
//         className="scroll-to-top"
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         aria-label="Scroll to top"
//       >
//         <i className="fa fa-arrow-up" aria-hidden="true"></i>
//       </button>
//     </div>
//   );
// };

// export default Home;