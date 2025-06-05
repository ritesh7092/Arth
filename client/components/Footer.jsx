// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-r from-gray-900 to-black text-gray-300 pt-16 pb-8 overflow-hidden">
      {/* Slanted top edge */}
      <div className="absolute top-0 left-0 w-full h-12 transform -translate-y-full skew-y-2 origin-top-left bg-gradient-to-r from-gray-800 to-gray-900"></div>

      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ===== BRANDING & DESCRIPTION ===== */}
        <div className="flex flex-col items-start space-y-4">
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-400">
            Arth
          </h2>
          <p className="text-sm text-gray-400 max-w-sm">
            All-in-one platform for cutting-edge finance, task management, and AI-driven insights—designed to empower individuals with blazing-fast performance and rock-solid security.
          </p>
          <p className="text-xs text-gray-500">
            © 2025 Arth. All rights reserved.
          </p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-gray-200">Quick Links</h3>
          <ul className="space-y-1 text-gray-400">
            <li>
              <a href="/about" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
                Features
              </a>
            </li>
            {/* <li>
              <a href="/pricing" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
                Pricing
              </a>
            </li> */}
            <li>
              <a href="/about" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
                About Me
              </a>
            </li>
            {/* <li>
              <a href="/contact" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
                Contact
              </a>
            </li> */}
          </ul>
        </div>

        {/* ===== SOCIAL & CREDITS ===== */}
        <div className="flex flex-col items-start space-y-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-200">Connect With Me</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <i className="fa fa-linkedin fa-lg"></i>
              </a>
              <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <i className="fa fa-github fa-lg"></i>
              </a>
            </div>
          </div>

          {/* ===== HIGHLIGHTED CREDIT ===== */}
          <div className="w-full border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">
              {/* You can keep small © text above or omit if desired */}
            </p>
            <p className="mt-2 text-base font-bold text-indigo-400">
              Developed, Owned, and Designed by{" "}
              <span className="text-white">Ritesh Raj Tiwari</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

