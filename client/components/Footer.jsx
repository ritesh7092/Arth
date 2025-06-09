import React from 'react';
import { Github, Linkedin, Twitter, Globe, ArrowUp } from 'lucide-react';

const Footer = ({ theme = 'dark' }) => {
  const isDarkMode = theme === 'dark';

  const themeClasses = {
    bg: isDarkMode
      ? 'bg-gradient-to-r from-slate-900 to-slate-800'
      : 'bg-gradient-to-r from-slate-50 to-white',
    text: {
      primary: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      secondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
      muted: isDarkMode ? 'text-slate-400' : 'text-slate-500'
    },
    border: isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50',
    link: isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600',
    socialButton: isDarkMode
      ? 'bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white'
      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: <Github size={18} />, href: '#github', label: 'GitHub' },
    { icon: <Linkedin size={18} />, href: '#linkedin', label: 'LinkedIn' },
    { icon: <Twitter size={18} />, href: '#twitter', label: 'Twitter' },
    { icon: <Globe size={18} />, href: '#portfolio', label: 'Portfolio' }
  ];

  return (
    <footer className={`w-full ${themeClasses.bg} border-t ${themeClasses.border}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Arth
                </span>
                <div className={`text-xs ${themeClasses.text.muted} font-medium uppercase tracking-wide`}>
                  Productivity Platform
                </div>
              </div>
            </div>
            <p className={`${themeClasses.text.secondary} text-sm leading-relaxed max-w-xs`}>
              Empowering productivity with seamless finance, tasks, and AI-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${themeClasses.text.primary} font-semibold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className={`${themeClasses.text.secondary} ${themeClasses.link} text-sm transition-colors duration-200`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer & Social */}
          <div className="space-y-4">
            <div>
              <h3 className={`${themeClasses.text.primary} font-semibold mb-2`}>Creator</h3>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Ritesh Raj Tiwari
              </p>
              <p className={`${themeClasses.text.muted} text-sm`}>Full-Stack Developer & Designer</p>
              <p className={`${themeClasses.text.secondary} text-xs leading-relaxed mt-2`}>
                Conceptualized, designed & built entirely from scratch
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-9 h-9 ${themeClasses.socialButton} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t ${themeClasses.border} flex flex-col sm:flex-row justify-between items-center gap-4`}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
            <p className={`${themeClasses.text.muted} text-sm`}>
              © {currentYear} Arth. All rights reserved.
            </p>
            <span className={`${themeClasses.text.muted} text-sm hidden sm:block`}>•</span>
            <p className={`${themeClasses.text.muted} text-sm`}>Made in India 🇮🇳</p>
          </div>
          
          <button
            onClick={scrollToTop}
            className={`w-9 h-9 ${themeClasses.socialButton} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 group`}
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



// import React from 'react';
// import { Github, Linkedin, Twitter, Globe } from 'lucide-react';

// const Footer = ({ theme = 'dark' }) => {
//   const isDarkMode = theme === 'dark';

//   const themeClasses = {
//     bg: isDarkMode
//       ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
//       : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
//     text: isDarkMode ? 'text-slate-300' : 'text-slate-700',
//     border: isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50',
//     link: isDarkMode
//       ? 'hover:text-blue-400'
//       : 'hover:text-blue-600',
//   };

//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className={`w-full ${themeClasses.bg} border-t ${themeClasses.border} py-8 px-4`}>
//       <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//         {/* Branding & Tagline */}
//         <div className="flex flex-col items-center md:items-start">
//           <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
//             Arth
//           </span>
//           <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 mt-1">
//             Productivity Platform
//           </span>
//           <span className={`text-sm mt-2 ${themeClasses.text}`}>
//             Empowering you with seamless finance, productivity, and AI-driven insights.
//           </span>
//         </div>

//         {/* Social Links */}
//         <div className="flex items-center gap-4 mt-4 md:mt-0">
//           <a href="#" aria-label="GitHub" className={`${themeClasses.text} ${themeClasses.link} transition`}>
//             <Github size={20} />
//           </a>
//           <a href="#" aria-label="LinkedIn" className={`${themeClasses.text} ${themeClasses.link} transition`}>
//             <Linkedin size={20} />
//           </a>
//           <a href="#" aria-label="Twitter" className={`${themeClasses.text} ${themeClasses.link} transition`}>
//             <Twitter size={20} />
//           </a>
//           <a href="#" aria-label="Portfolio" className={`${themeClasses.text} ${themeClasses.link} transition`}>
//             <Globe size={20} />
//           </a>
//         </div>
//       </div>

//       {/* Strong Credit */}
//       <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-center">
//         <span className={`${themeClasses.text}`}>
//           © {currentYear} Arth Productivity. All rights reserved.
//         </span>
//         <span className="font-bold text-base text-blue-600 tracking-wide">
//           Vision, design, and development by Ritesh Raj Tiwari with unwavering dedication.
//         </span>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// // import React from 'react';
// // import { 
// //   Diamond, Heart, Github, Linkedin, Twitter, Mail, 
// //   MapPin, Phone, Globe, ExternalLink, ArrowUp
// // } from 'lucide-react';

// // const Footer = ({ theme = 'dark' }) => {
// //   const isDarkMode = theme === 'dark';

// //   // Enhanced theme-aware color system
// //   const themeClasses = {
// //     // Backgrounds
// //     bg: isDarkMode
// //       ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
// //       : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    
// //     bgSecondary: isDarkMode
// //       ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/40'
// //       : 'bg-white/90 backdrop-blur-xl border-slate-200/30',
    
// //     bgGlass: isDarkMode
// //       ? 'bg-slate-800/20 backdrop-blur-2xl border-slate-600/20'
// //       : 'bg-white/70 backdrop-blur-2xl border-slate-200/30',
    
// //     // Text colors
// //     textPrimary: isDarkMode ? 'text-slate-100' : 'text-slate-900',
// //     textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
// //     textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    
// //     // Interactive elements
// //     linkHover: isDarkMode
// //       ? 'hover:text-blue-400 hover:translate-x-1'
// //       : 'hover:text-blue-600 hover:translate-x-1',
    
// //     socialButton: isDarkMode
// //       ? 'bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white border border-slate-600/30'
// //       : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/50 shadow-sm',
    
// //     // Borders
// //     border: isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50',
// //   };

// //   const scrollToTop = () => {
// //     window.scrollTo({
// //       top: 0,
// //       behavior: 'smooth'
// //     });
// //   };

// //   const currentYear = new Date().getFullYear();

// //   return (
// //     <>
// //       <style jsx>{`
// //         .gradient-text {
// //           background: ${isDarkMode 
// //             ? 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #f472b6 100%)'
// //             : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)'
// //           };
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //         }

// //         .footer-bg {
// //           background: ${isDarkMode 
// //             ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
// //             : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
// //           };
// //         }

// //         .glass-card {
// //           background: ${isDarkMode 
// //             ? 'rgba(30, 41, 59, 0.4)'
// //             : 'rgba(255, 255, 255, 0.9)'
// //           };
// //           backdrop-filter: blur(20px);
// //           border: 1px solid ${isDarkMode 
// //             ? 'rgba(148, 163, 184, 0.2)'
// //             : 'rgba(148, 163, 184, 0.3)'
// //           };
// //         }

// //         .logo-glow {
// //           filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
// //         }

// //         .heart-pulse {
// //           animation: heartPulse 2s ease-in-out infinite;
// //         }

// //         @keyframes heartPulse {
// //           0%, 100% { transform: scale(1); }
// //           50% { transform: scale(1.1); }
// //         }

// //         .developer-card {
// //           background: ${isDarkMode 
// //             ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
// //             : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)'
// //           };
// //           backdrop-filter: blur(10px);
// //           border: 1px solid ${isDarkMode 
// //             ? 'rgba(59, 130, 246, 0.3)'
// //             : 'rgba(59, 130, 246, 0.2)'
// //           };
// //         }

// //         .social-glow:hover {
// //           box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.3);
// //         }

// //         .animate-float {
// //           animation: float 6s ease-in-out infinite;
// //         }

// //         @keyframes float {
// //           0%, 100% { transform: translateY(0px); }
// //           50% { transform: translateY(-10px); }
// //         }
// //       `}</style>

// //       <footer className={`footer-bg relative overflow-hidden ${themeClasses.border} border-t`}>
// //         {/* Animated Background Elements */}
// //         <div className="absolute inset-0 overflow-hidden">
// //           <div className={`absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float`}></div>
// //           <div className={`absolute bottom-1/4 right-1/6 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl`} style={{animationDelay: '3s'}}></div>
// //         </div>

// //         <div className="relative z-10">
// //           {/* Main Footer Content */}
// //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
// //             <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-12">
              
// //               {/* Company Info - Enhanced */}
// //               <div className="lg:col-span-2 space-y-8">
// //                 <div className="flex items-center space-x-4 group">
// //                   <div className="relative">
// //                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 opacity-30 blur-xl rounded-full group-hover:opacity-50 transition-all duration-500"></div>
// //                     <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-4 rounded-2xl logo-glow group-hover:scale-110 transition-all duration-300">
// //                       <Diamond size={32} className="text-white" />
// //                     </div>
// //                   </div>
// //                   <div className="flex flex-col">
// //                     <span className="text-4xl font-black gradient-text tracking-tight">Arth</span>
// //                     <span className={`text-sm ${themeClasses.textMuted} font-bold tracking-wider`}>PRODUCTIVITY ECOSYSTEM</span>
// //                   </div>
// //                 </div>
                
// //                 <p className={`${themeClasses.textSecondary} leading-relaxed text-lg max-w-md`}>
// //                   Revolutionizing productivity through intelligent design, cutting-edge AI, and seamless user experiences. 
// //                   Built for professionals who demand excellence.
// //                 </p>

// //                 {/* Contact Info */}
// //                 <div className="space-y-4">
// //                   <div className="flex items-center space-x-3">
// //                     <div className={`w-10 h-10 ${themeClasses.socialButton} rounded-xl flex items-center justify-center transition-all duration-300`}>
// //                       <Mail size={18} />
// //                     </div>
// //                     <span className={`${themeClasses.textSecondary} font-medium`}>hello@arth-productivity.com</span>
// //                   </div>
// //                   <div className="flex items-center space-x-3">
// //                     <div className={`w-10 h-10 ${themeClasses.socialButton} rounded-xl flex items-center justify-center transition-all duration-300`}>
// //                       <Phone size={18} />
// //                     </div>
// //                     <span className={`${themeClasses.textSecondary} font-medium`}>+1 (555) 123-4567</span>
// //                   </div>
// //                   <div className="flex items-center space-x-3">
// //                     <div className={`w-10 h-10 ${themeClasses.socialButton} rounded-xl flex items-center justify-center transition-all duration-300`}>
// //                       <MapPin size={18} />
// //                     </div>
// //                     <span className={`${themeClasses.textSecondary} font-medium`}>San Francisco, CA</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Quick Links */}
// //               <div>
// //                 <h3 className={`${themeClasses.textPrimary} font-black mb-6 text-xl`}>Platform</h3>
// //                 <ul className="space-y-4">
// //                   {[
// //                     { name: 'Features', href: '#features' },
// //                     { name: 'Pricing', href: '#pricing' },
// //                     { name: 'Integrations', href: '#integrations' },
// //                     { name: 'API Documentation', href: '#api' },
// //                     { name: 'Mobile Apps', href: '#mobile' },
// //                     { name: 'Enterprise', href: '#enterprise' }
// //                   ].map((link, index) => (
// //                     <li key={index}>
// //                       <a 
// //                         href={link.href} 
// //                         className={`${themeClasses.textSecondary} ${themeClasses.linkHover} transition-all duration-300 font-medium flex items-center group`}
// //                       >
// //                         <span>{link.name}</span>
// //                         <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //                       </a>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>

// //               {/* Resources */}
// //               <div>
// //                 <h3 className={`${themeClasses.textPrimary} font-black mb-6 text-xl`}>Resources</h3>
// //                 <ul className="space-y-4">
// //                   {[
// //                     { name: 'Help Center', href: '#help' },
// //                     { name: 'Community', href: '#community' },
// //                     { name: 'Blog', href: '#blog' },
// //                     { name: 'Tutorials', href: '#tutorials' },
// //                     { name: 'Webinars', href: '#webinars' },
// //                     { name: 'Status Page', href: '#status' }
// //                   ].map((link, index) => (
// //                     <li key={index}>
// //                       <a 
// //                         href={link.href} 
// //                         className={`${themeClasses.textSecondary} ${themeClasses.linkHover} transition-all duration-300 font-medium flex items-center group`}
// //                       >
// //                         <span>{link.name}</span>
// //                         <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //                       </a>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>

// //               {/* Company */}
// //               <div>
// //                 <h3 className={`${themeClasses.textPrimary} font-black mb-6 text-xl`}>Company</h3>
// //                 <ul className="space-y-4">
// //                   {[
// //                     { name: 'About Us', href: '#about' },
// //                     { name: 'Careers', href: '#careers' },
// //                     { name: 'Press Kit', href: '#press' },
// //                     { name: 'Partners', href: '#partners' },
// //                     { name: 'Privacy Policy', href: '#privacy' },
// //                     { name: 'Terms of Service', href: '#terms' }
// //                   ].map((link, index) => (
// //                     <li key={index}>
// //                       <a 
// //                         href={link.href} 
// //                         className={`${themeClasses.textSecondary} ${themeClasses.linkHover} transition-all duration-300 font-medium flex items-center group`}
// //                       >
// //                         <span>{link.name}</span>
// //                         <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //                       </a>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             </div>

// //             {/* Developer Credit Section - Enhanced */}
// //             <div className="mt-16 pt-12 border-t border-opacity-20 border-slate-500">
// //               <div className="developer-card rounded-3xl p-8 mb-12">
// //                 <div className="flex flex-col md:flex-row items-center justify-between">
// //                   <div className="flex items-center space-x-6 mb-6 md:mb-0">
// //                     <div className="relative">
// //                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur-xl rounded-full"></div>
// //                       <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl">
// //                         RT
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <h4 className={`${themeClasses.textPrimary} text-2xl font-black mb-2`}>
// //                         Crafted with <Heart className="inline w-6 h-6 text-red-500 heart-pulse mx-1" /> by
// //                       </h4>
// //                       <h3 className="text-3xl font-black gradient-text mb-1">Ritesh Raj Tiwari</h3>
// //                       <p className={`${themeClasses.textSecondary} font-semibold text-lg`}>
// //                         Full-Stack Developer & UI/UX Designer
// //                       </p>
// //                       <p className={`${themeClasses.textMuted} text-sm mt-2`}>
// //                         Passionate about creating exceptional digital experiences
// //                       </p>
// //                     </div>
// //                   </div>
                  
// //                   {/* Social Links */}
// //                   <div className="flex items-center space-x-4">
// //                     {[
// //                       { icon: <Github size={20} />, href: '#github', label: 'GitHub' },
// //                       { icon: <Linkedin size={20} />, href: '#linkedin', label: 'LinkedIn' },
// //                       { icon: <Twitter size={20} />, href: '#twitter', label: 'Twitter' },
// //                       { icon: <Globe size={20} />, href: '#portfolio', label: 'Portfolio' }
// //                     ].map((social, index) => (
// //                       <a
// //                         key={index}
// //                         href={social.href}
// //                         className={`w-12 h-12 ${themeClasses.socialButton} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 social-glow group`}
// //                         aria-label={social.label}
// //                       >
// //                         <div className="group-hover:scale-110 transition-transform duration-300">
// //                           {social.icon}
// //                         </div>
// //                       </a>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Bottom Section */}
// //             <div className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t ${themeClasses.border}`}>
// //               <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 mb-6 md:mb-0">
// //                 <p className={`${themeClasses.textMuted} text-sm font-medium`}>
// //                   © {currentYear} Arth Productivity. All rights reserved.
// //                 </p>
// //                 <p className={`${themeClasses.textMuted} text-sm`}>
// //                   Designed & Developed in India 🇮🇳
// //                 </p>
// //               </div>
              
// //               {/* Back to Top Button */}
// //               <button
// //                 onClick={scrollToTop}
// //                 className={`w-12 h-12 ${themeClasses.socialButton} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group`}
// //                 aria-label="Back to top"
// //               >
// //                 <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </footer>
// //     </>
// //   );
// // };

// // export default Footer;




// // // // Footer.jsx
// // // import React from "react";

// // // const Footer = () => {
// // //   return (
// // //     <footer className="relative w-full bg-gradient-to-r from-gray-900 to-black text-gray-300 pt-16 pb-8 overflow-hidden">
// // //       {/* Slanted top edge */}
// // //       <div className="absolute top-0 left-0 w-full h-12 transform -translate-y-full skew-y-2 origin-top-left bg-gradient-to-r from-gray-800 to-gray-900"></div>

// // //       <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-8">
// // //         {/* ===== BRANDING & DESCRIPTION ===== */}
// // //         <div className="flex flex-col items-start space-y-4">
// // //           <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-400">
// // //             Arth
// // //           </h2>
// // //           <p className="text-sm text-gray-400 max-w-sm">
// // //             All-in-one platform for cutting-edge finance, task management, and AI-driven insights—designed to empower individuals with blazing-fast performance and rock-solid security.
// // //           </p>
// // //           <p className="text-xs text-gray-500">
// // //             © 2025 Arth. All rights reserved.
// // //           </p>
// // //         </div>

// // //         {/* ===== QUICK LINKS ===== */}
// // //         <div className="flex flex-col space-y-2">
// // //           <h3 className="text-lg font-semibold text-gray-200">Quick Links</h3>
// // //           <ul className="space-y-1 text-gray-400">
// // //             <li>
// // //               <a href="/about" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
// // //                 Features
// // //               </a>
// // //             </li>
// // //             {/* <li>
// // //               <a href="/pricing" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
// // //                 Pricing
// // //               </a>
// // //             </li> */}
// // //             <li>
// // //               <a href="/about" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
// // //                 About Me
// // //               </a>
// // //             </li>
// // //             {/* <li>
// // //               <a href="/contact" className="text-gray-400 hover:text-white hover:underline transition-colors duration-200">
// // //                 Contact
// // //               </a>
// // //             </li> */}
// // //           </ul>
// // //         </div>

// // //         {/* ===== SOCIAL & CREDITS ===== */}
// // //         <div className="flex flex-col items-start space-y-6">
// // //           <div className="flex flex-col space-y-2">
// // //             <h3 className="text-lg font-semibold text-gray-200">Connect With Me</h3>
// // //             <div className="flex space-x-4">
// // //               <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
// // //                 <i className="fa fa-facebook fa-lg"></i>
// // //               </a>
// // //               <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
// // //                 <i className="fa fa-twitter fa-lg"></i>
// // //               </a>
// // //               <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
// // //                 <i className="fa fa-linkedin fa-lg"></i>
// // //               </a>
// // //               <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
// // //                 <i className="fa fa-github fa-lg"></i>
// // //               </a>
// // //             </div>
// // //           </div>

// // //           {/* ===== HIGHLIGHTED CREDIT ===== */}
// // //           <div className="w-full border-t border-gray-700 pt-4">
// // //             <p className="text-sm text-gray-400">
// // //               {/* You can keep small © text above or omit if desired */}
// // //             </p>
// // //             <p className="mt-2 text-base font-bold text-indigo-400">
// // //               Developed, Owned, and Designed by{" "}
// // //               <span className="text-white">Ritesh Raj Tiwari</span>
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </footer>
// // //   );
// // // };

// // // export default Footer;

