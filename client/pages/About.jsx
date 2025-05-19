import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">About Arth</h1>
            <p className="mt-4 text-lg text-gray-600">Personal Finance and Task Manager</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">My Journey</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                I am Ritesh Raj Tiwari, a Computer Science Engineering student at the Indian Institute of Information Technology (IIIT), Bhagalpur. I built this personal project <strong>Arth</strong> completely on my own—from designing, coding, testing, wireframing, and developing both the front-end and back-end.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Arth is designed to help users efficiently manage their personal finances, set priorities with to-dos, and generate comprehensive reports. The front-end is built using React and TailwindCSS, while the back-end is developed using Spring Boot.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/path/to/your/project-screenshot.png"
                alt="Arth Project Screenshot"
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800">Features & Future Plans</h2>
            <ul className="mt-4 list-disc list-inside text-gray-700">
              <li>Comprehensive Personal Finance Management</li>
              <li>Dynamic Task/Todo Manager with Priority Settings</li>
              <li>Report Generation for Finances and Tasks</li>
              <li>CRUD operations for both Task and Finance modules</li>
              <li>Additional features planned for future releases</li>
            </ul>
          </div>
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Technologies Used</h2>
            <p className="mt-4 text-gray-700">React, TailwindCSS, Spring Boot and Mysql</p>
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="inline-block bg-[#1565C0] hover:bg-[#0D47A1] text-white py-3 px-6 rounded-lg transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

