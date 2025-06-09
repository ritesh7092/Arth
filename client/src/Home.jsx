import React, { useEffect, useState } from "react";
import { 
  Moon, Sun, ArrowRight, Sparkles, Shield, Zap, Users, Star, 
  Brain, TrendingUp, Clock, Award, CheckCircle, Play,
  Target, Globe, Rocket, Menu, X, Diamond, ArrowDown,
  Layers, Infinity, Database, BarChart3, MessageSquare,
  Lightbulb, Palette, Code, Heart
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Home = ({ isAuthenticated = false, handleLogout = () => {} }) => {
  const navigate = useNavigate();

  // Enhanced theme management with system preference detection
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

  // Enhanced theme toggle with persistence and system detection
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  // Apply theme on mount and changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Enhanced scroll tracking for animations
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.pageYOffset);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Testimonial carousel with smoother transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Pleasant, charming, and highly readable light mode color palette
  const themeClasses = {
    // Backgrounds
    bg: isDarkMode
      ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950'
      : 'bg-gradient-to-br from-[#f7fafc] via-[#e3e8ee] to-[#fdf6f0]', // Soft, warm, and neutral

    bgSecondary: isDarkMode
      ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/40'
      : 'bg-white/95 backdrop-blur-xl border-[#e3e8ee]/60',

    bgGlass: isDarkMode
      ? 'bg-slate-800/20 backdrop-blur-2xl border-slate-600/20'
      : 'bg-white/90 backdrop-blur-2xl border-[#e3e8ee]/40',

    // Text colors
    textPrimary: isDarkMode ? 'text-slate-100' : 'text-[#232946]', // deep blue
    textSecondary: isDarkMode ? 'text-slate-300' : 'text-[#3b3b4f]', // dark gray-blue
    textMuted: isDarkMode ? 'text-slate-400' : 'text-[#7b8194]', // soft gray-blue

    // Gradients for headings and accents
    gradientText: isDarkMode
      ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-[#6a8cff] via-[#fcb69f] to-[#ffb6b9] bg-clip-text text-transparent', // Blue to peach to pink

    // Interactive elements
    buttonPrimary: isDarkMode
      ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-xl shadow-blue-500/30'
      : 'bg-gradient-to-r from-[#6a8cff] to-[#ffb6b9] hover:from-[#4f8cff] hover:to-[#fcb69f] text-white shadow-xl shadow-[#fcb69f]/20',

    buttonSecondary: isDarkMode
      ? 'bg-slate-700/50 hover:bg-slate-600/70 text-slate-200 border border-slate-500/30 shadow-lg shadow-slate-800/20'
      : 'bg-white/95 hover:bg-[#f7f7fa] text-[#232946] border border-[#e3e8ee] shadow-lg shadow-[#fcb69f]/10',

    // Theme toggle
    themeToggle: isDarkMode
      ? 'bg-slate-700/60 hover:bg-slate-600/80 text-amber-400 border border-slate-600/40'
      : 'bg-white/90 hover:bg-[#f7f7fa] text-[#fcb69f] border border-[#e3e8ee] shadow-md',
  };

  // Auth logic for top right
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const loggedIn = isAuthenticated || !!authToken;

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
    <div className={`min-h-screen font-sans antialiased transition-all duration-500 ${themeClasses.bg} relative overflow-x-hidden`}>
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
        /* Enhanced CSS Variables and Styles */
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

        .feature-glow-blue:hover {
          box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.6);
        }
        
        .feature-glow-cyan:hover {
          box-shadow: 0 25px 50px -12px rgba(6, 182, 212, 0.6);
        }
        
        .feature-glow-pink:hover {
          box-shadow: 0 25px 50px -12px rgba(236, 72, 153, 0.6);
        }
        
        .feature-glow-orange:hover {
          box-shadow: 0 25px 50px -12px rgba(249, 115, 22, 0.6);
        }

        .feature-glow-violet:hover {
          box-shadow: 0 25px 50px -12px rgba(139, 92, 246, 0.6);
        }

        .feature-glow-emerald:hover {
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.6);
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 4s;
        }

        .animate-float-slow {
          animation: float 12s ease-in-out infinite 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }

        .testimonial-enter {
          animation: slideIn 0.8s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        .navbar-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .logo-glow {
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
        }

        .cta-glow {
          background: ${isDarkMode 
            ? 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #1e40af 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
          };
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

        .scroll-indicator {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .typing-animation {
          border-right: 2px solid;
          animation: typing 4s steps(40) infinite, blink 0.75s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
        }

        @keyframes typing {
          0%, 50%, 100% { width: 0; }
          10%, 40% { width: 100%; }
        }

        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: currentColor; }
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

        .stats-counter {
          animation: countUp 2s ease-out;
        }

        @keyframes countUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Cursor Glow Effect */}
      <div className="cursor-glow"></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 
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
                  <a href="#features" className={`${themeClasses.textPrimary} hover:gradient-text transition-all duration-300 font-semibold text-sm tracking-wide relative group`}>
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                  {/* <a href="#testimonials" ...>Reviews</a> */}
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float parallax-bg`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed parallax-bg`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-slow`}></div>
          <div className={`absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-orange-500/15 to-rose-500/15 rounded-full blur-2xl animate-float`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Enhanced Hero Badge */}
          <div className={`inline-flex items-center space-x-3 glass-card px-8 py-4 rounded-full mb-12 border group hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
              <Star className="w-4 h-4 text-yellow-300" />
              <Star className="w-3 h-3 text-yellow-200" />
            </div>
            <span className={`${themeClasses.textPrimary} font-bold text-sm tracking-wide`}>World's #1 Productivity Platform</span>
            <Award className="w-5 h-5 text-purple-500" />
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          </div>
          
          {/* Enhanced Hero Title with Typing Effect */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none">
              <span className="gradient-text block">Revolutionize Your</span>
            </h1>
            <h1 className="text-6xl md:text-8xl font-black leading-none">
              <span className="gradient-text block typing-animation">Productivity</span>
            </h1>
          </div>
          
          {/* Enhanced Hero Subtitle */}
          <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-8 max-w-4xl mx-auto leading-relaxed font-medium`}>
            The ultimate ecosystem for <span className="gradient-text font-bold">Financial Intelligence</span>, 
            <span className="gradient-text font-bold"> Task Mastery</span> & <span className="gradient-text font-bold">AI-Powered Insights</span>
          </p>
          
          {/* Enhanced Hero Description */}
          <p className={`text-base md:text-lg ${themeClasses.textMuted} mb-10 max-w-2xl mx-auto`}>
            Arth is your all-in-one platform for mastering productivity, personal finance, and AI-powered insights. Built for students, professionals, and teams who want to achieve more with less effort—securely, beautifully, and intelligently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/dashboard')}
              className={`${themeClasses.buttonPrimary} px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
            >
              <ArrowRight className="w-5 h-5" />
              Get Started Free
            </button>
          </div>
        </div>
      </section>

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

      {/* Testimonials Section (commented out for now) */}
      {/*
      <section id="testimonials" className="w-full py-16 md:py-24 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-8">What Our Users Say</h2>
          <div className="relative">
            <div className="glass-card-strong p-10 rounded-3xl shadow-2xl border flex flex-col items-center transition-all duration-500 testimonial-enter">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonials[currentTestimonial].gradient} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className="flex mb-2">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className={`text-lg md:text-xl font-medium mb-4 ${themeClasses.textPrimary}`}>
                "{testimonials[currentTestimonial].content}"
              </p>
              <div className="font-bold gradient-text">{testimonials[currentTestimonial].name}</div>
              <div className={`text-xs ${themeClasses.textMuted}`}>{testimonials[currentTestimonial].role}</div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-6">Ready to Transform Your Productivity?</h2>
          <p className={`text-lg md:text-xl ${themeClasses.textSecondary} mb-10`}>
            Join thousands of professionals, students, and teams who trust Arth to power their productivity and financial growth.
          </p>
          <a
            href="#"
            className={`${themeClasses.buttonPrimary} px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2`}
          >
            <Users className="w-6 h-6" />
            Start Free Trial
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;





