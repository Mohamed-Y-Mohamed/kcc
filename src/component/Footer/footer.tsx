"use client";
import React from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-1.183-.11 6.401 6.401 0 0 0-6.4 6.4 6.401 6.401 0 0 0 6.4 6.4 6.401 6.401 0 0 0 6.4-6.4V8.862a8.098 8.098 0 0 0 4.017 1.11v-3.286c-1.06 0-2.062-.411-2.802-1.154" />
        </svg>
      ),
      href: "https://www.tiktok.com/@kcc.coffee",
      label: "TikTok",
    },
    {
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      ),
      href: "https://twitter.com/kccrestaurant",
      label: "Twitter",
    },
    {
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 3.95-.36.1-.74.15-1.13.15-.27 0-.54-.03-.8-.08.54 1.69 2.11 2.95 4 2.98-1.46 1.16-3.31 1.84-5.33 1.84-.35 0-.69-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
      ),
      href: "https://facebook.com/kccrestaurant",
      label: "Facebook",
    },
  ];

  const quickLinks = [
    { href: "#home", label: "Guriga", labelEn: "Home" },
    { href: "#menu", label: "Menu", labelEn: "Menu" },
    { href: "#gallery", label: "Sawirrada", labelEn: "Gallery" },
    { href: "#contact", label: "Xiriir", labelEn: "Contact" },
  ];

  return (
    <>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap");

        .font-serif {
          font-family: "Playfair Display", serif;
        }
        .font-sans {
          font-family: "Inter", sans-serif;
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease forwards;
        }

        .fade-in-up.delay-1 {
          animation-delay: 0.2s;
        }
        .fade-in-up.delay-2 {
          animation-delay: 0.4s;
        }
        .fade-in-up.delay-3 {
          animation-delay: 0.6s;
        }
        .fade-in-up.delay-4 {
          animation-delay: 0.8s;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-lift {
          transition: all 0.4s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }

        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }

        .glass-effect {
          backdrop-filter: blur(16px);
          background: ${isDark
            ? "rgba(38, 38, 38, 0.8)"
            : "rgba(255, 255, 255, 0.1)"};
          border: 1px solid
            ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)"};
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            #d4af37 0%,
            #f4e4bc 50%,
            #d4af37 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pulsing-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .floating-circle {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .social-hover {
          transition: all 0.3s ease;
        }
        .social-hover:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: ${isDark
            ? "0 10px 25px rgba(212, 175, 55, 0.3)"
            : "0 10px 25px rgba(212, 175, 55, 0.2)"};
        }
      `}</style>

      <footer
        className={`relative transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/20"
            : "bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900"
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-amber-400/20 rounded-full floating-circle" />
          <div
            className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full floating-circle"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-12 h-12 border border-amber-300/20 rounded-full floating-circle"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2 fade-in-up">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative hover-scale">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-2xl border-2 border-amber-400/40">
                      <img
                        src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=100&q=80"
                        alt="KCC Restaurant Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full pulsing-dot" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      <span className="gradient-text">KCC</span> Restaurant
                    </h3>
                    <p className="font-sans text-amber-200 text-sm italic">
                      Qahwo & Cunto Soomaali Ah
                    </p>
                  </div>
                </div>

                <p className="font-sans text-amber-100 text-base leading-relaxed mb-8 max-w-md">
                  Soo dhawoow meesha ugu quruxda badan ee ay ku kulanto qoyska
                  iyo asxaabta. Waxaan siinaa qahwo iyo cunto Soomaali ah oo
                  dhadhan macaan leh.
                </p>

                <p className="font-sans text-stone-300 text-sm leading-relaxed mb-8 max-w-md">
                  Welcome to the most beautiful place where family and friends
                  gather. We serve authentic Somali coffee and cuisine with
                  exceptional flavors.
                </p>

                {/* Social Media */}
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full glass-effect social-hover ${
                        isDark
                          ? "text-amber-400 hover:text-amber-300"
                          : "text-amber-200 hover:text-white"
                      }`}
                      aria-label={social.label}
                    >
                      {social.icon()}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="fade-in-up delay-1">
                <h4 className="font-serif text-xl font-semibold text-white mb-8">
                  <span className="gradient-text">Xiriirinta</span> Dhaqso
                </h4>
                <p className="font-sans text-sm text-amber-200/80 mb-6 italic">
                  Quick Links
                </p>

                <ul className="space-y-4">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group flex justify-between items-center py-2 transition-all duration-300 hover-lift"
                      >
                        <span
                          className={`font-serif text-amber-200 group-hover:text-white transition-colors duration-300 ${
                            isDark
                              ? "group-hover:text-amber-300"
                              : "group-hover:text-white"
                          }`}
                        >
                          {link.label}
                        </span>
                        <span className="font-sans text-sm text-stone-400 group-hover:text-stone-300 transition-colors duration-300">
                          {link.labelEn}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="fade-in-up delay-2">
                <h4 className="font-serif text-xl font-semibold text-white mb-8">
                  <span className="gradient-text">Macluumaadka</span> Xiriirka
                </h4>
                <p className="font-sans text-sm text-amber-200/80 mb-6 italic">
                  Contact Information
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 glass-effect p-4 rounded-xl hover-lift">
                    <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-amber-200 text-sm font-medium mb-1">
                        Ciwaanka / Address
                      </p>
                      <p className="font-sans text-amber-100 text-sm">
                        Argo Street,
                      </p>
                      <p className="font-sans text-amber-100 text-sm">
                        Golol, Somalia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 glass-effect p-4 rounded-xl hover-lift">
                    <Phone className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-amber-200 text-sm font-medium mb-1">
                        Telefoon / Phone
                      </p>
                      <p className="font-sans text-amber-100 text-sm">
                        +252610673194
                      </p>
                      <p className="font-sans text-stone-300 text-xs">
                        WhatsApp Available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 glass-effect p-4 rounded-xl hover-lift">
                    <Mail className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-amber-200 text-sm font-medium mb-1">
                        Email
                      </p>
                      <p className="font-sans text-amber-100 text-sm">
                        112@kcccoffee&restaurant.com{" "}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 glass-effect p-4 rounded-xl hover-lift">
                    <Clock className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-amber-200 text-sm font-medium mb-1">
                        Saacadaha Furmida / Hours
                      </p>
                      <p className="font-sans text-amber-100 text-sm">
                        8:00 AM - 11:00 PM
                      </p>
                      <p className="font-sans text-stone-300 text-xs">
                        Maalin kasta / Daily
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-12"></div>

          {/* Bottom Bar */}
          <div
            className={`border-t transition-all duration-700 ${
              isDark ? "border-amber-400/20" : "border-amber-200/40"
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                <div className="text-center md:text-left fade-in-up delay-3">
                  <p className="font-sans text-amber-200 text-sm mb-2">
                    © {currentYear} KCC Restaurant. Dhammaan xuquuqdu way
                    dhowran yihiin.
                  </p>
                  <p className="font-sans text-stone-400 text-xs">
                    All rights reserved. Authentic Somali dining experience.
                  </p>
                </div>

                <div className="flex items-center space-x-6 text-sm fade-in-up delay-4">
                  <a
                    href="#"
                    className="font-sans text-amber-200 hover:text-white transition-colors duration-300 hover-lift"
                  >
                    <span className="block">Shuruudaha Adeegga</span>
                    <span className="block text-xs text-stone-400">
                      Terms of Service
                    </span>
                  </a>
                  <span className="text-amber-400">|</span>
                  <a
                    href="#"
                    className="font-sans text-amber-200 hover:text-white transition-colors duration-300 hover-lift"
                  >
                    <span className="block">Sirta Macluumaadka</span>
                    <span className="block text-xs text-stone-400">
                      Privacy Policy
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
