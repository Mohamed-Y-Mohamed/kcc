"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  MapPin,
  Phone,
  Clock,
  Mail,
  Coffee,
  Utensils,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const LuxuryKCCLanding = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  // High-quality placeholder images
  const galleryImages = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", // Restaurant interior
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80", // Coffee setup
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80", // Food presentation
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80", // Coffee art
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", // Dining area
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", // Restaurant ambiance
  ];

  const features = [
    {
      icon: Coffee,
      titleSo: "Qahwo Casri ah",
      titleEn: "Artisanal Coffee",
      descSo: "Qahwo dhaqameed oo xirfad sare leh la kariyey",
      descEn: "Traditional coffee crafted with modern excellence",
    },
    {
      icon: Utensils,
      titleSo: "Cunto Dhaqameed",
      titleEn: "Heritage Cuisine",
      descSo: "Cuntooyinka dhaqameed oo casri ahaan loo diyaariyey",
      descEn: "Authentic flavors reimagined for the modern palate",
    },
    {
      icon: Award,
      titleSo: "Tayada Sare",
      titleEn: "Premium Quality",
      descSo: "Maacuun sare iyo adeeg hufan",
      descEn: "Uncompromising standards in every detail",
    },
  ];

  const testimonials = [
    {
      nameSo: "Amina Maxamed",
      nameEn: "Amina Mohamed",
      textSo: "Meelkan waa mid aad u qurux badan oo macquul ah",
      textEn: "An absolutely exquisite and sophisticated dining experience",
      position: "Food Critic",
      rating: 5,
    },
    {
      nameSo: "Cabdi Axmed",
      nameEn: "Abdi Ahmed",
      textSo: "Qahwada iyo cuntada labaduba waa kuwo aan weligay dhadhan",
      textEn: "The coffee and cuisine are truly exceptional and memorable",
      position: "Local Business Owner",
      rating: 5,
    },
    {
      nameSo: "Maryam Cali",
      nameEn: "Maryam Ali",
      textSo: "Adeegga iyo jawiga labaduba waa kuwo heer sare ah",
      textEn: "Both service and atmosphere are world-class",
      position: "Interior Designer",
      rating: 5,
    },
  ];

  const menuItems = [
    {
      category: "Coffee & Tea",
      items: [
        {
          nameSo: "Qahwo Soomaali",
          nameEn: "Traditional Somali Coffee",
          descSo: "Qahwo dhaqameed oo xawaash cusub lagu daray",
          descEn: "Heritage coffee blend with aromatic spices",
          price: "$4.50",
        },
        {
          nameSo: "Shaah Xawaash",
          nameEn: "Spiced Tea Blend",
          descSo: "Shaah macaan oo xawaash badan lagu daray",
          descEn: "Premium tea with traditional spice medley",
          price: "$3.50",
        },
      ],
    },
    {
      category: "Signature Dishes",
      items: [
        {
          nameSo: "Bariis iyo Hilib Geel",
          nameEn: "Spiced Rice with Camel",
          descSo: "Bariis xawaash lagu daray iyo hilib geel oo macaan",
          descEn: "Aromatic basmati rice with tender camel meat",
          price: "$18.99",
        },
        {
          nameSo: "Baasto Soomaali",
          nameEn: "Somali Pasta Fusion",
          descSo: "Baasto suugo ah oo xawaash soomaali lagu daray",
          descEn: "House-made pasta with traditional Somali spices",
          price: "$15.99",
        },
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${
        isDark ? "bg-neutral-950" : "bg-stone-50"
      }`}
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap");

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

        .image-overlay {
          background: linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(212, 175, 55, 0.1) 100%
          );
        }

        .glass-effect {
          backdrop-filter: blur(16px);
          background: ${isDark
            ? "rgba(38, 38, 38, 0.8)"
            : "rgba(255, 255, 255, 0.8)"};
          border: 1px solid
            ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
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
      `}</style>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center luxury-gradient"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 hero-bg"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
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

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 lg:px-8">
          <div className="fade-in-up text-content">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-amber-400/30 hover-scale">
                <img
                  src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=200&q=80"
                  alt="KCC Restaurant Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="gradient-text">KCC</span>
              <span className="block text-3xl md:text-5xl font-light text-amber-300 mt-2">
                Restaurant
              </span>
            </h1>
          </div>

          <div className="fade-in-up delay-1 text-content">
            <p className="font-serif text-2xl md:text-3xl text-amber-200 mb-4">
              Qahwo & Cunto Soomaali Ah
            </p>
            <p className="font-sans text-lg text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Where authentic Somali heritage meets contemporary luxury dining
              experience
            </p>
          </div>

          <div className="fade-in-up delay-2 flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-amber-600 text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-amber-500 transition-all duration-300 hover-scale shadow-xl">
              <span className="flex items-center justify-center">
                Explore Menu
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="border-2 border-white text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-white hover:text-stone-900 transition-all duration-300 shadow-xl">
              Make Reservation
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Our <span className="gradient-text">Philosophy</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Maxay Kaa Dhigaysaa Khaaska ah — What Makes Us Extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center fade-in-up delay-${
                  index + 1
                } hover-lift`}
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full luxury-card flex items-center justify-center">
                  <feature.icon className="w-12 h-12 text-amber-600" />
                </div>
                <h3
                  className={`font-serif text-2xl font-semibold mb-3 transition-all duration-700 ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {feature.titleSo}
                </h3>
                <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                  {feature.titleEn}
                </h4>
                <p
                  className={`font-sans mb-3 leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {feature.descSo}
                </p>
                <p
                  className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  {feature.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Video Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-100"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Daawasho <span className="gradient-text">Meeshayada</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Explore Our Place — Experience the authentic atmosphere of KCC
              Restaurant
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl hover-lift fade-in-up delay-1">
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
                preload="metadata"
                controls
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src="/intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center
                      bg-black/20 transition-opacity duration-300
                      pointer-events-none
                      ${isVideoPlaying ? "opacity-0" : "opacity-100"}`}
              >
                <button
                  className="pointer-events-auto w-20 h-20 glass-effect rounded-full flex items-center justify-center shadow-xl hover-scale"
                  onClick={() => {
                    if (!isVideoPlaying) {
                      videoRef.current?.play();
                    } else {
                      videoRef.current?.pause();
                    }
                  }}
                >
                  <Play
                    className={`w-8 h-8 ml-1 transition-all duration-300 ${
                      isDark ? "text-amber-400" : "text-stone-800"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Menu Preview */}
      <section
        id="gallery"
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Our <span className="gradient-text">Gallery</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p className="font-sans text-xl text-stone-300 max-w-3xl mx-auto">
              Sawirrada Meeshayada — Visual Stories from Our Kitchen
            </p>
          </div>

          {/* Main Gallery Display */}
          <div className="relative mb-12 fade-in-up delay-1">
            <div className="relative h-[70vh] rounded-3xl overflow-hidden shadow-2xl hover-lift">
              <img
                src={galleryImages[currentGalleryIndex]}
                alt={`Gallery ${currentGalleryIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 image-overlay"></div>

              <button
                onClick={() =>
                  setCurrentGalleryIndex(
                    (prev) =>
                      (prev - 1 + galleryImages.length) % galleryImages.length
                  )
                }
                className="absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 glass-effect rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() =>
                  setCurrentGalleryIndex(
                    (prev) => (prev + 1) % galleryImages.length
                  )
                }
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 glass-effect rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 fade-in-up delay-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentGalleryIndex(index)}
                className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 hover-scale ${
                  index === currentGalleryIndex
                    ? "ring-4 ring-amber-600 shadow-xl"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Menu Preview */}
      <section
        id="menu"
        className={`py-32 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-neutral-900 via-amber-950/10 to-orange-950/10"
            : "bg-gradient-to-br from-stone-50 via-amber-50/50 to-orange-50/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Signature <span className="gradient-text">Menu</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Cuntadayada Caanka ah — Our Celebrated Culinary Creations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {menuItems.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className={`fade-in-up delay-${categoryIndex + 1}`}
              >
                <h3
                  className={`font-serif text-3xl font-semibold mb-8 text-center transition-all duration-700 ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {category.category}
                </h3>
                <div className="space-y-8">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="luxury-card rounded-2xl p-8 hover-lift"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4
                            className={`font-serif text-xl font-semibold mb-2 transition-all duration-700 ${
                              isDark ? "text-white" : "text-stone-900"
                            }`}
                          >
                            {item.nameSo}
                          </h4>
                          <h5 className="font-sans text-lg text-amber-600 font-medium mb-3">
                            {item.nameEn}
                          </h5>
                        </div>
                        <span className="font-serif text-2xl font-bold text-amber-600 ml-4">
                          {item.price}
                        </span>
                      </div>
                      <p
                        className={`font-sans mb-2 leading-relaxed transition-all duration-700 ${
                          isDark ? "text-stone-300" : "text-stone-600"
                        }`}
                      >
                        {item.descSo}
                      </p>
                      <p
                        className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                          isDark ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        {item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 fade-in-up delay-3">
            <button
              className={`px-12 py-4 rounded-full font-sans font-medium transition-all duration-300 hover-scale shadow-xl ${
                isDark
                  ? "bg-amber-600 text-white hover:bg-amber-500"
                  : "bg-stone-900 text-white hover:bg-amber-600"
              }`}
            >
              View Complete Menu
            </button>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Testimonials */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Guest <span className="gradient-text">Experiences</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Macaamiishayada Waxa ay Dhahaan — Voices of Our Valued Guests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`luxury-card rounded-2xl p-8 hover-lift fade-in-up delay-${
                  index + 1
                }`}
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <blockquote
                  className={`font-serif text-lg mb-6 italic leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-200" : "text-stone-700"
                  }`}
                >
                  "{testimonial.textSo}"
                </blockquote>
                <blockquote
                  className={`font-sans text-sm mb-6 italic leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  "{testimonial.textEn}"
                </blockquote>
                <div>
                  <p
                    className={`font-serif text-lg font-semibold transition-all duration-700 ${
                      isDark ? "text-amber-400" : "text-stone-900"
                    }`}
                  >
                    {testimonial.nameSo}
                  </p>
                  <p className="font-sans text-amber-600 font-medium">
                    {testimonial.nameEn}
                  </p>
                  <p
                    className={`font-sans text-sm mt-1 transition-all duration-700 ${
                      isDark ? "text-stone-400" : "text-stone-500"
                    }`}
                  >
                    {testimonial.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 luxury-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Visit <span className="gradient-text">Us</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p className="font-sans text-xl text-stone-300 max-w-3xl mx-auto">
              Nagu Soo Booqo — We Welcome You to Our Home
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center space-x-4 glass-effect p-8 rounded-2xl hover-lift fade-in-up delay-1">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    className={`font-sans font-medium text-lg mb-1  ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    Ciwaanka / Address
                  </p>
                  <p
                    className={`font-sans  ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Argo Street, Golol, Somalia
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 glass-effect p-8 rounded-2xl hover-lift fade-in-up delay-2">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    className={`font-sans font-medium text-lg mb-1  ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    Whatsapp Telephone / Phone
                  </p>
                  <p
                    className={`font-sans  ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    +252610673194
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 glass-effect p-8 rounded-2xl hover-lift fade-in-up delay-3">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    className={`font-sans font-medium text-lg mb-1  ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    Saacadaha / Hours
                  </p>
                  <p
                    className={`font-sans  ${
                      isDark ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Daily: 8:00 AM - 11:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 glass-effect p-8 rounded-2xl hover-lift fade-in-up delay-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p
                    className={`font-sans font-medium text-lg mb-1  ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    Email Address
                  </p>
                  <p className="font-sans text-gray-500">
                    112@kcccoffee&restaurant.com
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 fade-in-up delay-4">
              <button className="bg-amber-600 text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-amber-500 transition-all duration-300 shadow-xl hover-scale">
                <span className="block font-serif">Dalbo Miis</span>
                <span className="block text-sm opacity-90">
                  Make Reservation
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryKCCLanding;
