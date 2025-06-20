import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBriefcase,
  FaChartPie,
  FaCogs,
  FaDatabase,
  FaReact,
  FaJava,
} from 'react-icons/fa';
import { useTheme } from '../src/theme/ThemeProvider';
import { Moon, Sun, Star, Award, ArrowRight } from 'lucide-react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const AboutPage = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  // tsParticles config
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

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
      <div className={`absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 ${themeClasses.blob1} rounded-full filter blur-3xl opacity-20 animate-blob`}></div>
      <div className={`absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 ${themeClasses.blob2} rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-16 z-10">
        {/* Cleaner, Sharper Page Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${themeClasses.strongText}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] to-[#00f2fe]">
              About Arth
            </span>
          </h1>
          <p className={`mt-3 text-base sm:text-lg lg:text-xl font-light italic max-w-xl mx-auto ${themeClasses.text}`}>
            A unified platform to manage personal finance and tasks with clarity and ease.
          </p>
        </div>

        {/* Journey & Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className={`space-y-6 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-8 leading-snug`}>
            <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText}`}>My Journey</h2>
            <p className={themeClasses.text}>
              I am <strong>Ritesh Raj Tiwari</strong>, a Computer Science Engineering student at IIIT Bhagalpur. I built this project <span className="text-[#4facfe] font-semibold">Arth</span> end-to-end—designing, coding, testing, and deploying both front-end and back-end.
            </p>
            <p className={themeClasses.text}>
              <span className="text-[#4facfe]">Arth</span> helps you manage personal finances, set and prioritize tasks, and generate detailed reports. The front-end uses React and TailwindCSS, and the back-end is powered by Spring Boot and MySQL.
            </p>
          </div>
          <div className="flex justify-center relative min-h-[400px]">
            {/* Classic Premium Hero Card */}
            <section className="relative min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-[#181c2a] rounded-2xl">
              {/* Subtle particles background */}
              <Particles
                id="tsparticles-hero"
                init={particlesInit}
                options={{
                  fullScreen: { enable: false },
                  background: { color: { value: "transparent" } },
                  fpsLimit: 60,
                  particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: ["#FFD700", "#fff", "#bfa76a"] },
                    links: {
                      enable: true,
                      color: "#bfa76a",
                      distance: 120,
                      opacity: 0.2,
                      width: 1,
                    },
                    move: {
                      enable: true,
                      speed: 0.7,
                      direction: "none",
                      outModes: { default: "out" },
                    },
                    opacity: { value: 0.4 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 2.5 } },
                  },
                  detectRetina: true,
                }}
                className="absolute inset-0 w-full h-full z-0"
              />

              {/* Glass card */}
              <div className="relative z-10 max-w-xl w-full mx-auto px-6 py-10 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-[#bfa76a]/30 flex flex-col items-center text-center backdrop-blur-xl">
                {/* Premium badge */}
                <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#bfa76a]/10 border border-[#bfa76a]/30 mb-4 shadow-sm">
                  <Star className="w-5 h-5 text-[#bfa76a]" />
                  <span className="font-semibold text-xs tracking-wide text-[#181c2a] dark:text-[#f7fafc]">Premium Productivity Suite</span>
                  <Award className="w-5 h-5 text-[#bfa76a]" />
                </div>
                {/* Classic serif heading */}
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold mb-2 leading-tight text-[#181c2a] dark:text-white drop-shadow-lg">
                  Achieve More, <span className="text-[#bfa76a]">Effortlessly</span>
                </h2>
                {/* Subtitle */}
                <p className="text-base sm:text-lg font-medium mb-2 text-[#3b3b4f] dark:text-slate-200 max-w-xl mx-auto">
                  The classic platform for <span className="text-[#bfa76a] font-semibold">Financial Mastery</span> & <span className="text-[#bfa76a] font-semibold">Productivity Excellence</span>.
                </p>
                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#bfa76a] hover:bg-[#ffd700] text-[#181c2a] font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 text-base border border-[#bfa76a]/40"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Get Started
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Features & Future Plans */}
        <div className="mb-16">
          <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText} text-center mb-8`}>
            Features & Future Plans
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <li className={`flex items-start space-x-4 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6`}>
              <FaChartPie className="text-3xl text-[#10b981]" />
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.strongText}`}>Personal Finance Management</h3>
                <p className={`${themeClasses.text} text-sm sm:text-base`}>Track income, expenses, budgets, and generate financial insights.</p>
              </div>
            </li>
            <li className={`flex items-start space-x-4 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6`}>
              <FaCogs className="text-3xl text-[#f59e0b]" />
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.strongText}`}>Dynamic Task Manager</h3>
                <p className={`${themeClasses.text} text-sm sm:text-base`}>Create, prioritize, and organize to-dos with deadlines and reminders.</p>
              </div>
            </li>
            <li className={`flex items-start space-x-4 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6`}>
              <FaDatabase className="text-3xl text-[#f43f5e]" />
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.strongText}`}>Comprehensive Reports</h3>
                <p className={`${themeClasses.text} text-sm sm:text-base`}>Generate detailed reports for finances and tasks, fully exportable.</p>
              </div>
            </li>
            <li className={`flex items-start space-x-4 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6`}>
              <FaBriefcase className="text-3xl text-[#4facfe]" />
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.strongText}`}>CRUD Operations</h3>
                <p className={`${themeClasses.text} text-sm sm:text-base`}>Full create/read/update/delete functionality for tasks and finance modules.</p>
              </div>
            </li>
            <li className={`flex items-start space-x-4 ${themeClasses.cardBg} rounded-2xl ${themeClasses.shadow} p-6`}>
              <FaCogs className="text-3xl text-[#34d399]" />
              <div>
                <h3 className={`text-lg sm:text-xl font-semibold ${themeClasses.strongText}`}>Future Features</h3>
                <p className={`${themeClasses.text} text-sm sm:text-base`}>Planning AI-powered insights, multi-currency support, and mobile app integration.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Technologies Used */}
        <div className="mb-16 text-center">
          <h2 className={`text-2xl sm:text-3xl font-semibold ${themeClasses.strongText} mb-6`}>Technologies & Tools</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center space-y-2">
              <FaReact className="text-5xl text-[#61dafb]" />
              <span className={themeClasses.text}>React</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FaCogs className="text-5xl text-[#38bdf8]" />
              <span className={themeClasses.text}>TailwindCSS</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FaJava className="text-5xl text-[#f59e0b]" />
              <span className={themeClasses.text}>Spring Boot</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <FaDatabase className="text-5xl text-[#0ea5e9]" />
              <span className={themeClasses.text}>MySQL</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <Link
            to="/contact"
            className="inline-flex items-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#3b82f6] hover:to-[#0ea5e9] text-white font-semibold py-3 px-7 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            Contact Me
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
