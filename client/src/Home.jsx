import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Moon, Sun, ArrowRight, Sparkles, Shield, Zap, Users, Star,
  Brain, TrendingUp, Clock, Award, CheckCircle, Play,
  Target, Globe, Rocket, Menu, X, Diamond, ArrowDown,
  Layers, Infinity, Database, BarChart3, MessageSquare,
  Lightbulb, Palette, Code, Heart, Cpu, GitMerge
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// --- SCROLL-REVEAL ECOSYSTEM SECTION ---
const Ecosystem = ({ isDarkMode }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [-120, 60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const capabilities = [
    { icon: Layers, name: "Unified Dashboard" },
    { icon: Shield, name: "Zero-Trust Security" },
    { icon: BarChart3, name: "Real-time Analytics" },
    { icon: Cpu, name: "Advanced AI Core" },
    { icon: GitMerge, name: "Seamless Integrations" },
  ];

  const sectionBg = isDarkMode
    ? "bg-gradient-to-br from-[#181c2a] via-[#1e2235] to-[#2b2250]"
    : "bg-gradient-to-br from-[#f7fafc] via-[#e3e8ee] to-[#fdf6f0]";
  const textColor = isDarkMode ? "text-slate-100" : "text-[#181c2a]";
  const subTextColor = isDarkMode ? "text-slate-300" : "text-[#3b3b4f]";

  return (
    <section
      id="ecosystem"
      ref={ref}
      className={`relative py-20 md:py-32 ${sectionBg} transition-colors duration-500 overflow-hidden`}
    >
      {/* Decorative blurred gradients */}
      <motion.div
        style={{ y: y1 }}
        className="pointer-events-none absolute w-60 h-60 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl top-[-60px] left-1/4 z-0"
      />
      <motion.div
        style={{ y: y2 }}
        className="pointer-events-none absolute w-60 h-60 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl bottom-[-60px] right-1/4 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-[#181c2a] dark:text-[#f7fafc] mb-2"
          >
            <span className="inline-block relative">
              <span className="bg-gradient-to-r from-[#bfa76a] to-[#ffd700] bg-clip-text text-transparent drop-shadow-lg">
                Intelligent Ecosystem
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-2 bg-gradient-to-r from-[#bfa76a]/40 to-[#ffd700]/40 blur-lg rounded-full opacity-60"></span>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto ${subTextColor} font-medium`}
          >
            Every component is engineered with precision, powered by cutting-edge technology to create a seamless flow.
          </motion.p>
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            style={{ rotate }}
            className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 flex items-center justify-center mx-auto my-10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#bfa76a] to-[#ffd700] rounded-full blur-2xl opacity-70 animate-pulse"></div>
            <div className="relative flex items-center justify-center w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-3xl border border-[#bfa76a]/30 shadow-2xl ring-4 ring-[#bfa76a]/20 dark:ring-[#ffd700]/20 animate-spin-slow">
              <Diamond className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-[#bfa76a] dark:text-[#ffd700] drop-shadow-lg" />
            </div>
          </motion.div>
          {/* Capabilities icons */}
          <div className="mt-12 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full max-w-3xl mx-auto">
            {capabilities.map((cap, idx) => (
              <motion.div
                key={cap.name}
                className="flex flex-col items-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white shadow-xl mb-2 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
                  <cap.icon size={28} />
                </div>
                <span className={`font-semibold text-sm ${textColor} text-center group-hover:text-fuchsia-500 transition-colors duration-200`}>
                  {cap.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Home = ({ isAuthenticated = false, handleLogout = () => {} }) => {
  const navigate = useNavigate();

  // Theme management
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'dark';
  });

  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isDarkMode = theme === 'dark';

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Testimonial carousel
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager, TechCorp",
      content: "Arth transformed our workflow completely. The AI insights are incredibly accurate and the interface is simply stunning. Our team productivity increased by 300%.",
      avatar: "SC",
      gradient: "from-pink-500 to-rose-500",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Financial Advisor",
      content: "The financial intelligence features are unmatched. It's like having a personal CFO at your fingertips. Game-changing for our investment decisions.",
      avatar: "MR",
      gradient: "from-blue-500 to-cyan-500",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Startup Founder",
      content: "From task management to financial forecasting, Arth does it all with unprecedented elegance and precision. Absolutely revolutionary!",
      avatar: "ET",
      gradient: "from-purple-500 to-indigo-500",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Creative Director",
      content: "The AI-powered insights have revolutionized how we approach creative projects. Arth understands our workflow better than we do ourselves.",
      avatar: "DK",
      gradient: "from-orange-500 to-amber-500",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // tsParticles config (nice, subtle, modern)
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: ["#60a5fa", "#a855f7", "#f472b6", "#fff"] },
      links: {
        enable: true,
        color: "#fff",
        distance: 140,
        opacity: 0.4,
        width: 1.5,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        outModes: { default: "out" },
      },
      opacity: { value: 0.7 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 5 } },
    },
    detectRetina: true,
  };

  // Theme classes
  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950'
      : 'bg-gradient-to-br from-[#f7fafc] via-[#e3e8ee] to-[#fdf6f0]',
    bgSecondary: isDarkMode
      ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/40'
      : 'bg-white/95 backdrop-blur-xl border-[#e3e8ee]/60',
    bgGlass: isDarkMode
      ? 'bg-slate-800/20 backdrop-blur-2xl border-slate-600/20'
      : 'bg-white/90 backdrop-blur-2xl border-[#e3e8ee]/40',
    textPrimary: isDarkMode ? 'text-slate-100' : 'text-[#232946]',
    textSecondary: isDarkMode ? 'text-slate-300' : 'text-[#3b3b4f]',
    textMuted: isDarkMode ? 'text-slate-400' : 'text-[#7b8194]',
    gradientText: isDarkMode
      ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-[#6a8cff] via-[#fcb69f] to-[#ffb6b9] bg-clip-text text-transparent',
    buttonPrimary: isDarkMode
      ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-xl shadow-blue-500/30'
      : 'bg-gradient-to-r from-[#6a8cff] to-[#ffb6b9] hover:from-[#4f8cff] hover:to-[#fcb69f] text-white shadow-xl shadow-[#fcb69f]/20',
    buttonSecondary: isDarkMode
      ? 'bg-slate-700/50 hover:bg-slate-600/70 text-slate-200 border border-slate-500/30 shadow-lg shadow-slate-800/20'
      : 'bg-white/95 hover:bg-[#f7f7fa] text-[#232946] border border-[#e3e8ee] shadow-lg shadow-[#fcb69f]/10',
    themeToggle: isDarkMode
      ? 'bg-slate-700/60 hover:bg-slate-600/80 text-amber-400 border border-slate-600/40'
      : 'bg-white/90 hover:bg-[#f7f7fa] text-[#fcb69f] border border-[#e3e8ee] shadow-md',
  };

  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const loggedIn = isAuthenticated || !!authToken;

  const features = [
    {
      icon: <Shield size={32} />,
      title: "Intelligent Task Management",
      description: "AI-powered Kanban boards with smart prioritization, automated scheduling, and predictive analytics for maximum productivity. Experience the future of task organization.",
      gradient: isDarkMode 
        ? "from-blue-500 to-purple-600" 
        : "from-blue-600 to-purple-700",
      glowColor: "blue",
      benefits: ["Smart Prioritization", "Auto-scheduling", "Predictive Analytics"]
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Advanced Finance Intelligence", 
      description: "Sophisticated budgeting with real-time analytics, investment tracking, and AI-driven financial forecasting. Make smarter financial decisions with confidence.",
      gradient: isDarkMode 
        ? "from-cyan-500 to-blue-600" 
        : "from-cyan-600 to-blue-700",
      glowColor: "cyan",
      benefits: ["Real-time Analytics", "Investment Tracking", "AI Forecasting"]
    },
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Assistant",
      description: "Conversational AI that learns your patterns, provides personalized insights, and anticipates your needs. Your intelligent productivity companion.",
      gradient: isDarkMode 
        ? "from-pink-500 to-rose-500" 
        : "from-pink-600 to-rose-600",
      glowColor: "pink",
      benefits: ["Pattern Learning", "Personalized Insights", "Predictive Actions"]
    },
    {
      icon: <Zap size={32} />,
      title: "Productivity Automation",
      description: "Automate repetitive tasks, streamline workflows, and focus on what matters most with intelligent automation that adapts to your style.",
      gradient: isDarkMode 
        ? "from-orange-500 to-amber-500" 
        : "from-orange-600 to-amber-600",
      glowColor: "orange",
      benefits: ["Smart Automation", "Workflow Optimization", "Focus Enhancement"]
    },
    {
      icon: <Database size={32} />,
      title: "Unified Data Hub",
      description: "Centralize all your data with seamless integrations, real-time synchronization, and intelligent data relationships across all your tools.",
      gradient: isDarkMode 
        ? "from-violet-500 to-purple-600" 
        : "from-violet-600 to-purple-700",
      glowColor: "violet",
      benefits: ["Data Centralization", "Real-time Sync", "Smart Integrations"]
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Advanced Analytics",
      description: "Deep insights into your productivity patterns, performance metrics, and growth opportunities with beautiful, actionable visualizations.",
      gradient: isDarkMode 
        ? "from-emerald-500 to-teal-600" 
        : "from-emerald-600 to-teal-700",
      glowColor: "emerald",
      benefits: ["Performance Metrics", "Pattern Analysis", "Growth Insights"]
    }
  ];

  const stats = [
    { number: "15M+", label: "Active Users", icon: <Users size={24} />, color: "text-blue-400" },
    { number: "99.99%", label: "Uptime", icon: <Shield size={24} />, color: "text-emerald-400" },
    { number: "2.5M+", label: "Tasks Completed Daily", icon: <CheckCircle size={24} />, color: "text-purple-400" },
    { number: "$5B+", label: "Transactions Tracked", icon: <TrendingUp size={24} />, color: "text-cyan-400" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for individuals getting started with productivity",
      features: [
        "Up to 3 projects",
        "Basic task management",
        "5GB storage",
        "Email support",
        "Mobile app access"
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for professionals and small teams",
      features: [
        "Unlimited projects",
        "Advanced AI features",
        "100GB storage",
        "Priority support",
        "Analytics & insights",
        "Team collaboration",
        "Custom integrations"
      ],
      gradient: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "24/7 phone support",
        "Custom AI training",
        "Advanced security",
        "SSO integration",
        "Dedicated success manager"
      ],
      gradient: "from-orange-500 to-rose-500",
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen font-sans antialiased transition-all duration-500 relative overflow-x-hidden ${themeClasses.bg}`}>
      <style jsx>{`
        .gradient-text, .feature-heading {
          ${isDarkMode
            ? "background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #f472b6 100%);"
            : "background: linear-gradient(90deg, #3b82f6 0%, #6366f1 40%, #f472b6 100%);"
          }
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .feature-heading {
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.01em;
        }
        .hero-bg {
          background: ${isDarkMode
            ? 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 50%, #000000 100%)'
            : 'radial-gradient(ellipse at top, #dbeafe 0%, #e0e7ff 50%, #f8fafc 100%)'
          };
        }
        .glass-card {
          background: ${isDarkMode
            ? 'rgba(30, 41, 59, 0.4)'
            : 'rgba(255,255,255,0.85)'
          };
          backdrop-filter: blur(24px);
          border: 1px solid ${isDarkMode
            ? 'rgba(148, 163, 184, 0.2)'
            : 'rgba(220, 220, 245, 0.5)'
          };
          box-shadow: 0 8px 32px 0 rgba(60,60,120,0.06);
        }
        .glass-card-strong {
          background: ${isDarkMode
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(255,255,255,0.97)'
          };
          backdrop-filter: blur(40px);
          border: 1px solid ${isDarkMode
            ? 'rgba(148, 163, 184, 0.3)'
            : 'rgba(220, 220, 245, 0.7)'
          };
          box-shadow: 0 8px 32px 0 rgba(60,60,120,0.08);
        }
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .parallax-bg {
          transform: translateY(${scrollY * 0.5}px);
        }
        .cursor-glow {
          pointer-events: none;
          position: fixed;
          top: ${mousePosition.y}px;
          left: ${mousePosition.x}px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          z-index: 0;
          transition: opacity 0.3s ease;
        }
        @media (max-width: 640px) {
          .cursor-glow { display: none; }
        }
      `}</style>

      {/* Cursor Glow Effect */}
      <div className="cursor-glow"></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50
        ? `${themeClasses.bgSecondary} navbar-blur shadow-2xl border-b`
        : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center space-x-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 opacity-30 blur-xl group-hover:opacity-50 transition-all duration-500 rounded-full"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-3 rounded-2xl group-hover:scale-110 transition-all duration-300 logo-glow">
                    <Diamond size={28} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black gradient-text tracking-tight">Arth</span>
                  <span className={`text-xs ${themeClasses.textMuted} font-medium tracking-wider`}>PRODUCTIVITY</span>
                </div>
              </a>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-8">
                  <a
                    href="#features"
                    className={`${themeClasses.textPrimary} relative font-semibold text-sm tracking-wide group`}
                  >
                    Features
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  {!loggedIn ? (
                    <>
                      <a href="/register" className={`${themeClasses.textPrimary} hover:gradient-text transition-all duration-300 font-semibold text-sm tracking-wide`}>
                        Register
                      </a>
                      <a href="/login" className={`${themeClasses.buttonPrimary} px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105`}>
                        Login
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className={`${themeClasses.buttonSecondary} px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105`}
                    >
                      Logout
                    </button>
                  )}
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-12 ${themeClasses.themeToggle} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}`}
                    aria-label="Toggle theme"
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                    ) : (
                      <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 ${themeClasses.themeToggle} rounded-xl flex items-center justify-center transition-all duration-300`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${themeClasses.textPrimary} hover:${themeClasses.textSecondary} transition-colors duration-300 p-2`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${themeClasses.bgSecondary} navbar-blur border-t shadow-xl`}>
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a href="#features" className={`block px-4 py-3 ${themeClasses.textPrimary} hover:gradient-text transition-all duration-300 font-semibold rounded-lg`}>Features</a>
              {!loggedIn ? (
                <>
                  <a href="/register" className={`block px-4 py-3 ${themeClasses.textPrimary} hover:gradient-text transition-all duration-300 font-semibold rounded-lg`}>Register</a>
                  <a href="/login" className={`block px-4 py-3 ${themeClasses.buttonPrimary} text-white font-semibold rounded-lg text-center mt-4`}>Login</a>
                </>
              ) : (
                <button onClick={handleLogout} className={`block w-full text-left px-4 py-3 ${themeClasses.textPrimary} hover:gradient-text transition-all duration-300 font-semibold rounded-lg`}>
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* tsParticles background */}
        <Particles
          id="tsparticles-hero"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0 w-full h-full z-0"
        />
        {/* Animated blobs (optional, keep your existing ones) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ...your animated gradient blobs here... */}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Badge */}
          <div className={`inline-flex items-center space-x-3 glass-card px-6 sm:px-8 py-3 sm:py-4 rounded-full mb-8 sm:mb-12 border group hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400" />
            </div>
            <span className={`${themeClasses.textPrimary} font-bold text-xs sm:text-sm tracking-wide`}>Premium Productivity Suite</span>
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-fuchsia-400 animate-pulse" />
          </div>
          {/* Hero Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-2 sm:mb-4 leading-none">
              <span className="gradient-text block">Revolutionize Your</span>
            </h1>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none">
              <span className="gradient-text block typing-animation">Productivity</span>
            </h1>
          </div>
          {/* Hero Subtitle */}
          <p className={`text-base sm:text-xl md:text-2xl ${themeClasses.textSecondary} mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-medium`}>
            The ultimate ecosystem for <span className="gradient-text font-bold">Financial Intelligence</span>,
            <span className="gradient-text font-bold"> Task Mastery</span> & <span className="gradient-text font-bold">AI-Powered Insights</span>
          </p>
          {/* Hero Description */}
          <p className={`text-xs sm:text-base md:text-lg ${themeClasses.textMuted} mb-8 sm:mb-10 max-w-2xl mx-auto`}>
            Arth is your all-in-one platform for mastering productivity, personal finance, and AI-powered insights. Built for students, professionals, and teams who want to achieve more with less effort—securely, beautifully, and intelligently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className={`${themeClasses.buttonPrimary} px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
            >
              <ArrowRight className="w-5 h-5" />
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <Ecosystem isDarkMode={isDarkMode} />

      {/* Stats Section */}
      <section className="w-full py-12 md:py-20 bg-transparent" id="stats">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="flex flex-col items-center justify-center glass-card-strong p-6 rounded-2xl shadow-lg">
            <div className="mb-2 text-blue-400"><Users size={24} /></div>
            <div className="text-3xl md:text-4xl font-extrabold gradient-text">15M+</div>
            <div className={`text-sm md:text-base ${themeClasses.textSecondary} font-semibold mt-1 text-center`}>
              Users Can Be Supported
            </div>
          </div>
          <div className="flex flex-col items-center justify-center glass-card-strong p-6 rounded-2xl shadow-lg">
            <div className="mb-2 text-emerald-400"><Shield size={24} /></div>
            <div className="text-3xl md:text-4xl font-extrabold gradient-text">99.99%</div>
            <div className={`text-sm md:text-base ${themeClasses.textSecondary} font-semibold mt-1 text-center`}>
              Uptime Target
            </div>
          </div>
          <div className="flex flex-col items-center justify-center glass-card-strong p-6 rounded-2xl shadow-lg">
            <div className="mb-2 text-purple-400"><CheckCircle size={24} /></div>
            <div className="text-3xl md:text-4xl font-extrabold gradient-text">2.5M+</div>
            <div className={`text-sm md:text-base ${themeClasses.textSecondary} font-semibold mt-1 text-center`}>
              Daily Tasks Can Be Managed
            </div>
          </div>
          <div className="flex flex-col items-center justify-center glass-card-strong p-6 rounded-2xl shadow-lg">
            <div className="mb-2 text-cyan-400"><TrendingUp size={24} /></div>
            <div className="text-3xl md:text-4xl font-extrabold gradient-text">5B+</div>
            <div className={`text-sm md:text-base ${themeClasses.textSecondary} font-semibold mt-1 text-center`}>
              Transactions Can Be Supported
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="feature-heading text-center mb-6 gradient-text">Revolutionary Features</h2>
          <p className={`text-lg md:text-xl ${themeClasses.textSecondary} text-center mb-14 max-w-2xl mx-auto`}>
            Built for the next generation of achievers. Arth unifies productivity, finance, and intelligence—empowering you to master your goals, money, and growth in one seamless platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Unified Productivity & Task Intelligence */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-blue-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Zap size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">Unified Productivity & Task Intelligence</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Organize, prioritize, and automate your daily tasks with AI-powered Kanban boards, smart reminders, and deep analytics—so you can focus on what matters most.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">AI Prioritization</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Smart Scheduling</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Habit Tracking</li>
              </ul>
            </div>
            {/* 2. Personal Finance Command Center */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-cyan-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                <TrendingUp size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">Personal Finance Command Center</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Track expenses, manage budgets, analyze spending, and forecast your financial future with real-time insights and automation—no spreadsheets required.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Expense Tracking</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Budget Automation</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">AI Forecasts</li>
              </ul>
            </div>
            {/* 3. AI-Powered Personal Assistant */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-pink-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                <Brain size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">AI-Powered Personal Assistant</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Get personalized insights, reminders, and recommendations. Arth’s AI learns your habits and helps you optimize your time, money, and growth—automatically.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Conversational AI</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Personalized Insights</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Growth Suggestions</li>
              </ul>
            </div>
            {/* 4. Secure Data & Privacy First */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-violet-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg">
                <Shield size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">Secure Data & Privacy First</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Your data is encrypted, private, and never sold. Arth uses enterprise-grade security and gives you full control—always.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">End-to-End Encryption</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Zero-Tracking</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Private by Design</li>
              </ul>
            </div>
            {/* 5. Growth Analytics & Insights */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-emerald-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <BarChart3 size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">Growth Analytics & Insights</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Visualize your progress with beautiful dashboards. Get actionable analytics on your habits, finances, and productivity—see your growth, not just your data.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Progress Dashboards</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Actionable Metrics</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Goal Tracking</li>
              </ul>
            </div>
            {/* 6. Seamless Integration & Automation */}
            <div className="glass-card card-hover-effect p-8 rounded-3xl shadow-xl border-t-4 border-b-4 border-transparent hover:border-orange-400 transition-all duration-300">
              <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                <Layers size={32} />
              </div>
              <h3 className="feature-heading gradient-text mb-2">Seamless Integration & Automation</h3>
              <p className={`mb-4 ${themeClasses.textSecondary}`}>
                Connect your favorite tools, automate workflows, and sync data across devices. Arth adapts to your ecosystem—no friction, just flow.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">App Integrations</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Cross-Device Sync</li>
                <li className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold border border-white/20">Workflow Automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>



     
      {/* Features Gallery Section (Animated Screenshots Carousel) */}
      <section id="features-gallery" className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-12">
            See Arth in Action
          </h2>
          <FeaturesCarousel />
        </div>
      </section>



       {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-12">
            What Our Users Say
          </h2>
          
          <div className="relative mb-8">
            <div className="glass-card p-10 rounded-3xl border transition-all duration-500">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonials[currentTestimonial].gradient} flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto`}>
                {testimonials[currentTestimonial].avatar}
              </div>
              
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className={`text-xl font-medium mb-6 ${themeClasses.textPrimary} italic`}>
                "{testimonials[currentTestimonial].content}"
              </p>
              
              <div className="gradient-text font-bold text-lg">
                {testimonials[currentTestimonial].name}
              </div>
              <div className={`${themeClasses.textMuted} text-sm mt-1`}>
                {testimonials[currentTestimonial].role}
              </div>
            </div>
          </div>

        
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card p-12 rounded-3xl border">
             <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-6">Ready to Transform Your Productivity?</h2>
          <p className={`text-lg md:text-xl ${themeClasses.textSecondary} mb-10`}>
            Experince the perfect blend of productivity and financial intelligence, crafted for the modern professional.
             <span className="gradient-text font-bold"> Start your journey with Arth today!</span>
          </p>
          <a
            href="#"
            className={`${themeClasses.buttonPrimary} px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2`}
          >
            <Users className="w-6 h-6" />
            Register
          </a>
          </div>
        </div>
      </section>
      
    </div>
  );
};

function FeaturesCarousel() {
  const gallery = [
    {
      src: "/gallery/profile.png",
      title: "Personalized Profile",
      desc: "Manage your identity, preferences, and see your achievements at a glance."
    },
    {
      src: "/gallery/TaskManagementDashboard.png",
      title: "Task Management Dashboard",
      desc: "Track all your tasks, deadlines, and priorities in one powerful dashboard."
    },
    {
      src: "/gallery/TaskManagementKanbanBoard.png",
      title: "Kanban Board",
      desc: "Visualize and organize your workflow with an intuitive drag-and-drop Kanban board."
    },
    {
      src: "/gallery/CraftNewTask.png",
      title: "Craft New Task",
      desc: "Quickly create and customize tasks with smart suggestions and reminders."
    },
    {
      src: "/gallery/AddFinanceRecord.png",
      title: "Add Finance Record",
      desc: "Easily log expenses, income, and transactions for complete financial clarity."
    },
    {
      src: "/gallery/financedashboard.png",
      title: "Finance Dashboard",
      desc: "Monitor your budgets, balances, and spending trends with real-time analytics."
    },
    {
      src: "/gallery/TransactionanalyticsReportGraphs.png",
      title: "Analytics & Reports",
      desc: "Gain insights from interactive graphs and reports on your financial activity."
    },
    {
      src: "/gallery/TransactionDetailsBorad.png",
      title: "Transaction Details Board",
      desc: "Drill down into every transaction for transparency and control."
    },
    {
      src: "/gallery/homepage.png",
      title: "Welcome Home",
      desc: "A beautiful, unified entry point to all your productivity and finance tools."
    }
  ];

  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const pauseTimeout = React.useRef();

  // Auto-advance every 3.5s, but resume after 10s if paused
  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % gallery.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [gallery.length, current, paused]);

  // Helper to pause and then resume auto-advance after 10s
  const pauseAndResume = () => {
    setPaused(true);
    if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setPaused(false), 10000);
  };

  // Handlers for left/right navigation
  const goLeft = () => {
    pauseAndResume();
    setCurrent((prev) => (prev - 1 + gallery.length) % gallery.length);
  };
  const goRight = () => {
    pauseAndResume();
    setCurrent((prev) => (prev + 1) % gallery.length);
  };
  // Handler for dot navigation
  const goTo = (idx) => {
    pauseAndResume();
    setCurrent(idx);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={goLeft}
          aria-label="Previous Feature"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-slate-200 dark:border-slate-700 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
          style={{ marginLeft: '-1.5rem' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        {/* Card */}
        <div className="glass-card p-6 rounded-3xl border shadow-2xl flex flex-col items-center transition-all duration-700 bg-white/80 dark:bg-slate-900/70">
          <img
            src={gallery[current].src}
            alt={gallery[current].title}
            className="rounded-2xl mb-6 shadow-lg object-cover w-full h-72 transition-all duration-700 border border-slate-200 dark:border-slate-700"
            style={{ objectFit: "cover" }}
          />
          <div className="font-bold text-2xl gradient-text mb-2">{gallery[current].title}</div>
          <p className="text-base text-slate-600 dark:text-slate-300 mb-2">{gallery[current].desc}</p>
        </div>
        {/* Right Arrow */}
        <button
          onClick={goRight}
          aria-label="Next Feature"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 hover:bg-pink-100 dark:hover:bg-pink-900/80 border border-slate-200 dark:border-slate-700 shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
          style={{ marginRight: '-1.5rem' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-500" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center mt-6 flex-wrap gap-2">
        {gallery.map((item, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Show ${item.title}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-gradient-to-r from-blue-400 to-pink-400"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
      {/* Feature quick-jump dropdown (optional, for accessibility) */}
      <div className="mt-4">
        <select
          value={current}
          onChange={e => goTo(Number(e.target.value))}
          className="rounded-lg border px-3 py-1 text-sm shadow bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          aria-label="Jump to feature"
        >
          {gallery.map((item, idx) => (
            <option key={item.title} value={idx}>{item.title}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Home;

