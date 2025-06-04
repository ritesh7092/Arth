// AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaChartPie,
  FaCogs,
  FaDatabase,
  FaReact,
  FaJava,
} from 'react-icons/fa';


const AboutPage = () => {
  return (
    <>
      {/* Inline CSS for animations & responsive blob sizes */}
      <style>{`
        @keyframes underlineGrow {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-underline {
          display: inline-block;
          border-bottom: 4px solid #4facfe;
          animation: underlineGrow 1s ease-out forwards;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a192f] to-[#020c1b] relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-[#3b82f680] rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-[#9333ea80] rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Main Content */}
        <main className="flex-grow container mx-auto max-w-4xl px-4 py-16 z-10">
          {/* Cleaner, Sharper Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white pb-2">
              <span className="animate-underline">About Arth</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg lg:text-xl text-gray-300 font-light italic max-w-xl mx-auto">
              A unified platform to manage personal finance and tasks with clarity and ease.
            </p>
          </div>

          {/* Journey & Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 leading-snug">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">My Journey</h2>
              <p className="text-gray-300">
                I am <strong>Ritesh Raj Tiwari</strong>, a Computer Science Engineering student at IIIT Bhagalpur. I built this project <span className="text-[#4facfe] font-semibold">Arth</span> end-to-end—designing, coding, testing, and deploying both front-end and back-end.
              </p>
              <p className="text-gray-300">
                <span className="text-[#4facfe]">Arth</span> helps you manage personal finances, set and prioritize tasks, and generate detailed reports. The front-end uses React and TailwindCSS, and the back-end is powered by Spring Boot and MySQL.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="bg-[rgba(255,255,255,0.05)] rounded-xl shadow-2xl overflow-hidden transform transition hover:scale-105">
                <img
                  src="/path/to/your/project-screenshot.png"
                  alt="Arth Project Screenshot"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Features & Future Plans */}
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-8">
              Features & Future Plans
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <li className="flex items-start space-x-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
                <FaChartPie className="text-3xl text-[#10b981]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Personal Finance Management</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Track income, expenses, budgets, and generate financial insights.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
                <FaCogs className="text-3xl text-[#f59e0b]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Dynamic Task Manager</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Create, prioritize, and organize to-dos with deadlines and reminders.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
                <FaDatabase className="text-3xl text-[#f43f5e]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Comprehensive Reports</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Generate detailed reports for finances and tasks, fully exportable.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
                <FaBriefcase className="text-3xl text-[#4facfe]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">CRUD Operations</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Full create/read/update/delete functionality for tasks and finance modules.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl p-6">
                <FaCogs className="text-3xl text-[#34d399]" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Future Features</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Planning AI-powered insights, multi-currency support, and mobile app integration.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Technologies Used */}
          <div className="mb-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Technologies & Tools</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center space-y-2">
                <FaReact className="text-5xl text-[#61dafb]" />
                <span className="text-gray-300">React</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaCogs className="text-5xl text-[#38bdf8]" />
                <span className="text-gray-300">TailwindCSS</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaJava className="text-5xl text-[#f59e0b]" />
                <span className="text-gray-300">Spring Boot</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaDatabase className="text-5xl text-[#0ea5e9]" />
                <span className="text-gray-300">MySQL</span>
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
    </>
  );
};

export default AboutPage;

