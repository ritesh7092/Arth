import React, { useCallback } from 'react';
import {
  FaBriefcase,
  FaChartPie,
  FaCogs,
  FaDatabase,
  FaReact,
  FaJava,
  FaRobot,
  FaShieldAlt,
  FaEnvelope,
  FaFileExport,
} from 'react-icons/fa';
import { Moon, Sun, Star, Award, ArrowRight, TrendingUp, Zap, Brain } from 'lucide-react';

const AboutPage = () => {
  // Theme state (you can integrate with your theme provider)
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black'
      : 'bg-gradient-to-br from-indigo-50 to-white',
    text: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    strongText: isDarkMode ? 'text-white' : 'text-black',
    cardBg: isDarkMode
      ? 'bg-gray-800/60 backdrop-blur-lg border border-gray-700/50'
      : 'bg-white/70 backdrop-blur-lg border border-gray-200/80',
    shadow: isDarkMode ? 'shadow-2xl' : 'shadow-xl',
    blob1: isDarkMode ? 'bg-indigo-600/30' : 'bg-blue-300/30',
    blob2: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-300/30',
    buttonToggle: isDarkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-md'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-md',
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${themeClasses.bg} transition-colors duration-500`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${themeClasses.buttonToggle} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode ? 'focus:ring-offset-gray-950' : 'focus:ring-offset-white'} focus:ring-blue-500 shadow-md`}
          aria-label="Toggle theme"
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-300" />
          ) : (
            <Moon className="w-6 h-6 text-indigo-700" />
          )}
        </button>
      </div>

      {/* Decorative Blobs */}
      <div className={`absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 ${themeClasses.blob1} rounded-full filter blur-3xl opacity-20 animate-pulse`}></div>
      <div className={`absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 ${themeClasses.blob2} rounded-full filter blur-3xl opacity-20 animate-pulse`} style={{animationDelay: '2s'}}></div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-16 z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${themeClasses.strongText}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]">
              About Arth
            </span>
          </h1>
          <p className={`mt-4 text-lg sm:text-xl lg:text-2xl font-light max-w-2xl mx-auto ${themeClasses.text}`}>
            Master Your Money. Command Your Productivity.
          </p>
          <p className={`mt-2 text-base sm:text-lg font-medium italic max-w-xl mx-auto ${themeClasses.text}`}>
            Where Intelligence Meets Action
          </p>
        </div>

        {/* Platform Overview & Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className={`space-y-6 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-8`}>
            <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText}`}>
              Enterprise-Grade Platform
            </h2>
            <p className={themeClasses.text}>
              <span className="text-[#4facfe] font-bold">Arth</span> is a unified productivity and personal finance management platform 
              that combines advanced financial tracking, intelligent task management, and AI-powered automation into one seamless experience.
            </p>
            <p className={themeClasses.text}>
              Built with modern architecture and designed for scalability, Arth delivers enterprise-grade reliability 
              while maintaining an intuitive user experience. The platform features dedicated dashboards, comprehensive analytics, 
              and intelligent automation capabilities.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Designed & Developed by</span>
              <span className="font-semibold text-[#4facfe]">Ritesh Raj Tiwari</span>
            </div>
          </div>
          
          <div className="flex justify-center relative min-h-[400px]">
            {/* Premium Hero Card */}
            <section className="relative min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#181c2a] to-[#2d3748] rounded-2xl">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#bfa76a] rounded-full filter blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#4facfe] rounded-full filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-[#00f2fe] rounded-full filter blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>

              {/* Glass card */}
              <div className="relative z-10 max-w-xl w-full mx-auto px-6 py-10 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-[#bfa76a]/30 flex flex-col items-center text-center backdrop-blur-xl">
                {/* Premium badge */}
                <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#bfa76a]/10 border border-[#bfa76a]/30 mb-4 shadow-sm">
                  <Star className="w-5 h-5 text-[#bfa76a]" />
                  <span className="font-semibold text-xs tracking-wide text-[#181c2a] dark:text-[#f7fafc]">AI-Powered Intelligence Platform</span>
                  <Award className="w-5 h-5 text-[#bfa76a]" />
                </div>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold mb-2 leading-tight text-[#181c2a] dark:text-white drop-shadow-lg">
                  Automate. Analyze. <span className="text-[#bfa76a]">Advance.</span>
                </h2>
                
                <p className="text-base sm:text-lg font-medium mb-4 text-[#3b3b4f] dark:text-slate-200 max-w-xl mx-auto">
                  Your AI-Powered Productivity & Finance Hub
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                  <button className="bg-[#bfa76a] hover:bg-[#ffd700] text-[#181c2a] font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 text-base border border-[#bfa76a]/40 transform hover:scale-105">
                    <ArrowRight className="w-5 h-5" />
                    Experience Arth
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText} text-center mb-2`}>
            Platform Capabilities
          </h2>
          <p className={`text-center ${themeClasses.text} mb-8 max-w-2xl mx-auto`}>
            Comprehensive features designed for modern productivity and financial intelligence
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="text-3xl text-[#10b981]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Unified Dashboards</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Dedicated dashboards for finance and task management with advanced filtering, sorting, 
                and comprehensive export capabilities (CSV/PDF/Print).
              </p>
            </div>

            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="text-3xl text-[#4facfe]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Conversational AI</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Integrated AI assistant that interprets natural language queries to automate user actions 
                and provide intelligent insights.
              </p>
            </div>

            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <FaChartPie className="text-3xl text-[#f59e0b]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Interactive Analytics</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Real-time analytics with interactive charts (Bar, Pie, Line, Doughnut) for financial trends, 
                category breakdowns, and comprehensive reporting.
              </p>
            </div>

            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <FaEnvelope className="text-3xl text-[#f43f5e]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Smart Reminders</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Automated email notification system for tasks, loan repayments, and critical deadlines 
                to ensure nothing is missed.
              </p>
            </div>

            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <FaShieldAlt className="text-3xl text-[#8b5cf6]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Enterprise Security</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Robust JWT-based authentication and authorization system ensuring secure access 
                to all user data and platform features.
              </p>
            </div>

            <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6 hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="text-3xl text-[#34d399]" />
                <h3 className={`text-lg font-semibold ${themeClasses.strongText}`}>Intelligent Automation</h3>
              </div>
              <p className={`${themeClasses.text} text-sm`}>
                Advanced microservices architecture enabling seamless automation of financial tracking, 
                task scheduling, and report generation.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Excellence */}
        <div className="mb-16">
          <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-8`}>
            <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText} text-center mb-6`}>
              Technical Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className={`text-xl font-semibold ${themeClasses.strongText} mb-3`}>Architecture Highlights</h3>
                <ul className={`space-y-2 ${themeClasses.text}`}>
                  <li>• Scalable microservices architecture</li>
                  <li>• Modern responsive UI with theme support</li>
                  <li>• Real-time data visualization</li>
                  <li>• Enterprise-grade security implementation</li>
                  <li>• Extensible and maintainable codebase</li>
                </ul>
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${themeClasses.strongText} mb-3`}>Technology Stack</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <FaReact className="text-2xl text-[#61dafb]" />
                    <span className={themeClasses.text}>React</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaJava className="text-2xl text-[#f59e0b]" />
                    <span className={themeClasses.text}>Spring Boot</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaDatabase className="text-2xl text-[#0ea5e9]" />
                    <span className={themeClasses.text}>MySQL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCogs className="text-2xl text-[#38bdf8]" />
                    <span className={themeClasses.text}>TailwindCSS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-8 text-center mb-16`}>
          <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText} mb-4`}>
            Our Mission
          </h2>
          <p className={`text-lg ${themeClasses.text} max-w-3xl mx-auto leading-relaxed`}>
            Arth empowers you to master your finances and productivity through intelligent automation, 
            conversational AI, and actionable insights—all in one seamless platform. We revolutionize 
            how you interact with your data, making complex financial and productivity management 
            accessible through natural conversation and smart automation.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold ${themeClasses.strongText}`}>
              Ready to Transform Your Productivity?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Journey
              </button>
              <button className="inline-flex items-center border-2 border-[#4facfe] text-[#4facfe] hover:bg-[#4facfe] hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300">
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage


