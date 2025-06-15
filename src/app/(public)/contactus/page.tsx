"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Users,
  ArrowRight,
  Star,
  Award,
  Heart,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import "@/app/globals.css"; // or your correct path

const LuxuryContactPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mapRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    partySize: "",
    specialRequests: "",
    occasion: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Restaurant coordinates (Approximate for Somalia)

  // Initialize Interactive Map with multiple fallback options
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current) {
        // Create interactive map with embedded Google Maps
        mapRef.current.innerHTML = `
          <div style="width: 100%; height: 500px; position: relative; border-radius: 24px; overflow: hidden;">
            <!-- Primary Map: Embedded Google Maps -->
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15894.849186839745!2d45.318!3d2.047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMDInNDguOCJOIDQ1wrAxOSczMC4wIkU!5e0!3m2!1sen!2sso!4v1640995200000!5m2!1sen!2sso&q=Argo+Street+Golol+Somalia"
              width="100%"
              height="500"
              style="border: 0; border-radius: 24px; ${
                isDark ? "filter: invert(0.9) hue-rotate(180deg);" : ""
              }"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
            
            <!-- Overlay with restaurant info -->
            <div style="
              position: absolute;
              top: 20px;
              left: 20px;
              background: ${
                isDark ? "rgba(23, 23, 23, 0.95)" : "rgba(255, 255, 255, 0.95)"
              };
              padding: 20px;
              border-radius: 16px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
              backdrop-filter: blur(20px);
              border: 1px solid ${
                isDark ? "rgba(212, 175, 55, 0.3)" : "rgba(212, 175, 55, 0.2)"
              };
              z-index: 10;
              max-width: 300px;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: linear-gradient(135deg, #d4af37, #e5c164);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: ${isDark ? "#ffffff" : "#1c1c1c"};
                    font-family: 'Playfair Display', serif;
                  ">
                    KCC Cafe, Restaurant and Hotel
                  </h3>
                  <p style="
                    margin: 0;
                    font-size: 12px;
                    color: #d4af37;
                    font-weight: 600;
                  ">
                    Argo Street, Golol
                  </p>
                </div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <p style="
                  margin: 0 0 4px 0;
                  font-size: 14px;
                  color: ${isDark ? "#e5e5e5" : "#374151"};
                  font-family: 'Inter', sans-serif;
                ">
                  📍 <strong>Argo Street, Golol, Somalia</strong>
                </p>
                <p style="
                  margin: 0 0 4px 0;
                  font-size: 14px;
                  color: ${isDark ? "#d1d5db" : "#6b7280"};
                  font-family: 'Inter', sans-serif;
                ">
                  🕒 Open: 8:00 AM - 11:00 PM Daily
                </p>
                <p style="
                  margin: 0;
                  font-size: 14px;
                  color: ${isDark ? "#d1d5db" : "#6b7280"};
                  font-family: 'Inter', sans-serif;
                ">
                  📞 +252 61 067 3194
                </p>
              </div>
              
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a 
                  href="https://www.google.com/maps/search/Argo+Street,+Golol,+Somalia/@2.0469,45.3182,15z"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style="
                    background: linear-gradient(135deg, #d4af37, #e5c164);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
                    transition: all 0.3s ease;
                  "
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(212, 175, 55, 0.4)';"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(212, 175, 55, 0.3)';"
                >
                  🗺️ Get Directions
                </a>
                
                <a 
                  href="tel:+252610673194" 
                  style="
                    background: ${
                      isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(28, 28, 28, 0.1)"
                    };
                    color: ${isDark ? "#ffffff" : "#1c1c1c"};
                    padding: 8px 16px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    border: 1px solid ${
                      isDark
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(28, 28, 28, 0.2)"
                    };
                    transition: all 0.3s ease;
                  "
                  onmouseover="this.style.background='${
                    isDark
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(28, 28, 28, 0.2)"
                  }'; this.style.transform='translateY(-2px)';"
                  onmouseout="this.style.background='${
                    isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(28, 28, 28, 0.1)"
                  }'; this.style.transform='translateY(0)';"
                >
                  📞 Call Now
                </a>
              </div>
            </div>
          </div>
        `;
      }
    };

    initializeMap();
  }, [isDark]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.date ||
      !formData.time ||
      !formData.partySize
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        partySize: "",
        specialRequests: "",
        occasion: "",
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      titleSo: "Ciwaanka",
      titleEn: "Address",
      infoSo: "Argo Street, Golol, Somalia",
      infoEn: "Argo Street, Golol, Somalia",
      link: "https://www.google.com/maps/search/Argo+Street,+Golol,+Somalia/@2.0469,45.3182,15z",
    },
    {
      icon: Phone,
      titleSo: "Telefoon",
      titleEn: "Phone",
      infoSo: "+252610673194",
      infoEn: "WhatsApp Available",
      link: "tel:+252610673194",
    },
    {
      icon: Mail,
      titleSo: "Email",
      titleEn: "Email",
      infoSo: "112@kcccoffee&restaurant.com",
      infoEn: "112@kcccoffee&restaurant.com",
      link: "mailto:112@kcccoffee&restaurant.com",
    },
    {
      icon: Clock,
      titleSo: "Saacadaha Furmida",
      titleEn: "Opening Hours",
      infoSo: "8:00 AM - 11:00 PM",
      infoEn: "Daily (Maalin kasta)",
      link: null,
    },
  ];

  const occasions = [
    { value: "birthday", label: "Birthday Celebration", labelSo: "Dhalasho" },
    { value: "anniversary", label: "Anniversary", labelSo: "Xuska Guurka" },
    { value: "business", label: "Business Meeting", labelSo: "Shirkad" },
    { value: "family", label: "Family Gathering", labelSo: "Kullan Qoys" },
    { value: "date", label: "Romantic Dinner", labelSo: "Casho Jacayl" },
    { value: "other", label: "Other", labelSo: "Kale" },
  ];

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ];

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${
        isDark ? "bg-neutral-950" : "bg-stone-50"
      }`}
    >
      <style jsx>
        {`
          .font-serif {
            font-family: "Playfair Display", serif;
          }

          .font-sans {
            font-family: "Inter", sans-serif;
          }

          .luxury-gradient {
            background: ${isDark
              ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)"
              : "linear-gradient(135deg, #1c1c1c 0%, #2c2c2c 50%, #3c3c3c 100%)"};
          }

          .hero-bg {
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }

          .fade-in-up {
            opacity: 0;
            transform: translateY(40px);
            animation: fadeInUp 1s ease forwards;
          }

          .fade-in-up.delay-1 {
            animation-delay: 0.3s;
          }
          .fade-in-up.delay-2 {
            animation-delay: 0.6s;
          }
          .fade-in-up.delay-3 {
            animation-delay: 0.9s;
          }
          .fade-in-up.delay-4 {
            animation-delay: 1.2s;
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .hover-scale {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            will-change: transform;
          }
          .hover-scale:hover {
            transform: scale(1.05);
          }

          .hover-lift {
            transition: all 0.4s ease;
          }
          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: ${isDark
              ? "0 25px 50px rgba(0, 0, 0, 0.5)"
              : "0 25px 50px rgba(0, 0, 0, 0.15)"};
          }

          .text-content {
            transform: none !important;
            transition: opacity 0.8s ease, transform 0.8s ease;
          }

          .luxury-card {
            backdrop-filter: blur(20px);
            background: ${isDark
              ? "rgba(23, 23, 23, 0.95)"
              : "rgba(255, 255, 255, 0.95)"};
            border: 1px solid
              ${isDark ? "rgba(212, 175, 55, 0.3)" : "rgba(212, 175, 55, 0.2)"};
            box-shadow: ${isDark
              ? "0 20px 40px rgba(0, 0, 0, 0.4)"
              : "0 20px 40px rgba(0, 0, 0, 0.1)"};
          }

          .gradient-text {
            background: linear-gradient(
              135deg,
              #d4af37 0%,
              #e5c164 50%,
              #d4af37 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .section-divider {
            height: 1px;
            background: ${isDark
              ? "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent)"
              : "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)"};
          }

          .input-field {
            background: ${isDark
              ? "rgba(38, 38, 38, 0.8)"
              : "rgba(255, 255, 255, 0.9)"};
            border: 1px solid
              ${isDark ? "rgba(212, 175, 55, 0.3)" : "rgba(212, 175, 55, 0.2)"};
            color: ${isDark ? "#f5f5f5" : "#1c1c1c"};
            transition: all 0.3s ease;
          }

          .input-field:focus {
            border-color: #d4af37;
            box-shadow: 0 0 0 3px
              ${isDark ? "rgba(212, 175, 55, 0.2)" : "rgba(212, 175, 55, 0.1)"};
            background: ${isDark
              ? "rgba(38, 38, 38, 0.95)"
              : "rgba(255, 255, 255, 1)"};
          }

          .input-field::placeholder {
            color: ${isDark
              ? "rgba(245, 245, 245, 0.5)"
              : "rgba(28, 28, 28, 0.5)"};
          }

          .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 12px;
            border-radius: 50%;
            background: ${isDark
              ? "rgba(212, 175, 55, 0.9)"
              : "rgba(28, 28, 28, 0.9)"};
            color: ${isDark ? "#1c1c1c" : "#f5f5f5"};
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            display: none;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center luxury-gradient">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 hero-bg"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 lg:px-8">
          <div className="fade-in-up text-content">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="gradient-text">Nagu Soo Booqo</span>
            </h1>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-amber-300 mb-6">
              Visit Us at KCC Cafe, Restaurant and Hotel
            </h2>
          </div>

          <div className="fade-in-up delay-1 text-content">
            <p className="font-sans text-lg text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Soo dhawoow meesha ugu quruxda badan ee Somalia. Nala soo xiriir
              si aad u dalbato miis ama wax kale.
            </p>
            <p className="font-sans text-base text-stone-400 max-w-2xl mx-auto leading-relaxed">
              Welcome to the most beautiful place in Somalia. Contact us to make
              a reservation or for any inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section
        className={`py-20 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-neutral-900 via-amber-950/20 to-orange-950/20"
            : "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`luxury-card rounded-2xl p-8 text-center hover-lift fade-in-up delay-${
                  index + 1
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className={`font-serif text-xl font-semibold mb-2 transition-all duration-700 ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {info.titleSo}
                </h3>
                <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                  {info.titleEn}
                </h4>
                {info.link ? (
                  <a
                    href={info.link}
                    className="block group"
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <p
                      className={`font-sans mb-2 leading-relaxed transition-all duration-700 group-hover:text-amber-600 ${
                        isDark ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {info.infoSo}
                    </p>
                    <p
                      className={`font-sans text-sm leading-relaxed transition-all duration-700 group-hover:text-amber-500 flex items-center justify-center gap-1 ${
                        isDark ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      {info.infoEn}
                      {info.link.startsWith("http") && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </p>
                  </a>
                ) : (
                  <>
                    <p
                      className={`font-sans mb-2 leading-relaxed transition-all duration-700 ${
                        isDark ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      {info.infoSo}
                    </p>
                    <p
                      className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                        isDark ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      {info.infoEn}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Map Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Noo <span className="gradient-text">Kaalay</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-2xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Find Us — Located in the heart of Golol, Somalia
            </p>
          </div>

          <div className="luxury-card rounded-3xl overflow-hidden shadow-2xl hover-lift fade-in-up delay-1">
            <div ref={mapRef} className="w-full h-[500px] bg-gray-100">
              {/* Map will be loaded here */}
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="font-sans text-white">
                    Initializing interactive map...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Integration Info */}
          <div className="mt-8 text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isDark
                  ? "bg-neutral-800 text-stone-300"
                  : "bg-white text-stone-600"
              } shadow-lg`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Ready for Google Maps API integration
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Dalbo <span className="gradient-text">Miis</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-2xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Make a Reservation — Secure your table at Somalia&apos;s premier
              restaurant
            </p>
          </div>

          <div className="luxury-card rounded-3xl p-12 hover-lift fade-in-up delay-1">
            {submitStatus === "success" && (
              <div className="mb-8 p-6 bg-green-500/20 border border-green-500/30 rounded-xl text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-green-400 mb-2">
                  Mahadsanid!
                </h3>
                <p className="font-sans text-green-300">
                  Your reservation request has been submitted. We&apos;ll
                  contact you shortly to confirm.
                </p>
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Magaca Koowaad / First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Magaca Labaad / Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Telefoon / Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                    placeholder="+252 61 067 3194"
                  />
                </div>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Taariikhda / Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                  />
                </div>
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Waqtiga / Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                      isDark ? "text-stone-300" : "text-stone-700"
                    }`}
                  >
                    Dadka Tirada / Party Size *
                  </label>
                  <select
                    name="partySize"
                    value={formData.partySize}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                  >
                    <option value="">Select size</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="7">7 Guests</option>
                    <option value="8">8 Guests</option>
                    <option value="8+">8+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label
                  className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-700"
                  }`}
                >
                  Sababta Booqashada / Occasion
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans"
                >
                  <option value="">Select occasion (optional)</option>
                  {occasions.map((occasion) => (
                    <option key={occasion.value} value={occasion.value}>
                      {occasion.labelSo} / {occasion.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label
                  className={`block font-sans text-sm font-medium mb-3 transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-700"
                  }`}
                >
                  Codsiyada Gaarka ah / Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-4 rounded-xl input-field focus:outline-none font-sans resize-none"
                  placeholder="Any dietary restrictions, allergies, or special arrangements..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-12 py-4 rounded-full font-sans font-semibold transition-all duration-300 hover-scale shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-stone-900 text-white hover:bg-amber-600"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="font-serif">Gudbi Codsiga</span>
                        <span className="mx-2">/</span>
                        <span>Submit Request</span>
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose KCC Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-neutral-900 via-amber-950/20 to-orange-950/20"
            : "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Maxay Kaa <span className="gradient-text">Dhigaysaa</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Why Choose KCC — Experience the finest Somali hospitality in
              Somalia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center fade-in-up delay-1 hover-lift">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-4 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Tayada Heer Sare ah
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Premium Quality
              </h4>
              <p
                className={`font-sans leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Waxaan bixinnaa cunto iyo qahwo heer sare ah oo la diyaariyey
                habka dhaqameed ee Soomaalida.
              </p>
            </div>

            <div className="text-center fade-in-up delay-2 hover-lift">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-4 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Jaww Qoys
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Family Atmosphere
              </h4>
              <p
                className={`font-sans leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Meel nabdoon oo qoys iyo saaxiibo ay ku kulmi karaan wakhti
                fiican oo ay ku qaadan karaan.
              </p>
            </div>

            <div className="text-center fade-in-up delay-3 hover-lift">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-4 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Adeeg Hufan
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Exceptional Service
              </h4>
              <p
                className={`font-sans leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Kooxda shaqaalaheena waa dad xirfad leh oo jecel in ay siiyaan
                adeeg heer sare ah.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryContactPage;
