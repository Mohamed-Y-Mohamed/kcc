"use client";
import React, { useState } from "react";
import {
  Heart,
  Award,
  Users,
  Crown,
  Coffee,
  ChefHat,
  Star,
  Globe,
  Clock,
  Sparkles,
  Map,
  Target,
  Eye,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const LuxuryAboutPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const values = [
    {
      icon: Heart,
      titleSo: "Dhaqamada",
      titleEn: "Heritage",
      descSo: "Waxaan ku faanaa dhaqamada iyo hidaha Soomaaliyeed",
      descEn: "We pride ourselves on Somali culture and traditions",
    },
    {
      icon: Award,
      titleSo: "Tayada",
      titleEn: "Quality",
      descSo: "Waxaan bixinnaa cunto iyo adeeg heer sare ah",
      descEn: "We provide high-quality food and exceptional service",
    },
    {
      icon: Users,
      titleSo: "Bulshada",
      titleEn: "Community",
      descSo: "Waxaan abuuraa meel ay bulshadu ku kulanto",
      descEn: "We create a place where the community comes together",
    },
    {
      icon: Globe,
      titleSo: "Caalamka",
      titleEn: "Global",
      descSo: "Waxaan la wadaagnaa dhaqamadeenna adduunka",
      descEn: "We share our culture with the world",
    },
  ];

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-all duration-700 ease-in-out ${
        isDark ? "bg-neutral-950" : "bg-stone-50"
      }`}
    >
      <style jsx>
        {`
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

          .timeline-line {
            background: ${isDark
              ? "linear-gradient(to bottom, rgba(212, 175, 55, 0.5), rgba(212, 175, 55, 0.1))"
              : "linear-gradient(to bottom, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))"};
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center luxury-gradient">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 hero-bg"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80")`,
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

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 lg:px-8">
          <div className="fade-in-up text-content">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
              Ku Aqoon <span className="gradient-text">KCC</span>
            </h1>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-amber-300 mb-6">
              Discover KCC Restaurant
            </h2>
          </div>

          <div className="fade-in-up delay-1 text-content">
            <p className="font-sans text-lg text-stone-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Meel cusub oo qurux badan halkaas oo dhaqamada Soomaaliyeed iyo
              dhadhanada asalka ah la wadaago. Soo dhawoow KCC Restaurant.
            </p>
            <p className="font-sans text-base text-stone-400 max-w-3xl mx-auto leading-relaxed">
              A beautiful new place where Somali culture and authentic flavors
              are shared. Welcome to KCC Restaurant.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-neutral-900 via-amber-950/20 to-orange-950/20"
            : "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-up">
              <h2
                className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Ujeedkayaga <span className="gradient-text">Weyn</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mb-8"></div>

              <div className="space-y-6">
                <p
                  className={`font-sans text-lg leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  KCC Restaurant waa meel cusub oo London ku taala, halkaas oo
                  aan ku wadaagno dhaqamada quruxda badan ee cuntada
                  Soomaaliyeed. Waxaan u dedaalnaa in aan abuurno khibrad cunto
                  oo dhabta ah.
                </p>

                <p
                  className={`font-sans text-base leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  KCC Restaurant is a new place in London where we share the
                  beautiful culture of Somali cuisine. We strive to create an
                  authentic culinary experience that honors our heritage while
                  welcoming everyone to taste our traditions.
                </p>

                <p
                  className={`font-sans text-lg leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Rabitaankeenna waa in aan noqonno meesha ugu fiican ee London
                  oo loogu tago cuntada Soomaaliyeed ee dhabta ah iyo qahwada
                  macaan.
                </p>
              </div>
            </div>

            <div className="fade-in-up delay-1">
              <div className="luxury-card rounded-3xl p-8 hover-lift">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                    alt="KCC Restaurant Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote
                  className={`font-serif text-xl italic mb-4 transition-all duration-700 ${
                    isDark ? "text-amber-300" : "text-amber-700"
                  }`}
                >
                  "Cuntada waa luuqad aan erayo lahayn oo dadka ku midaysa"
                </blockquote>
                <p
                  className={`font-sans text-sm transition-all duration-700 ${
                    isDark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  "Food is a language without words that unites people"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Our Values Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 fade-in-up text-content">
            <h2
              className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              Qiyamkayaga <span className="gradient-text">Muhiimka ah</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Our Core Values — The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`luxury-card rounded-2xl p-8 text-center hover-lift fade-in-up delay-${
                  index + 1
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className={`font-serif text-2xl font-semibold mb-3 transition-all duration-700 ${
                    isDark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {value.titleSo}
                </h3>
                <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                  {value.titleEn}
                </h4>
                <p
                  className={`font-sans mb-3 leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {value.descSo}
                </p>
                <p
                  className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  {value.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Our Cuisine Section */}
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
              Cuntadayada <span className="gradient-text">Caadiga ah</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>
            <p
              className={`font-sans text-xl max-w-3xl mx-auto transition-all duration-700 ${
                isDark ? "text-stone-300" : "text-stone-600"
              }`}
            >
              Our Authentic Cuisine — Traditional flavors prepared with modern
              excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="luxury-card rounded-3xl p-8 text-center hover-lift fade-in-up delay-1">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Coffee className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-3 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Qahwada Dhaqameed
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Traditional Coffee
              </h4>
              <p
                className={`font-sans mb-3 leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Qahwo Soomaaliyeed oo la kariyay hab dhaqameed oo cardamom iyo
                xawaash lagu daray.
              </p>
              <p
                className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-400" : "text-stone-500"
                }`}
              >
                Traditional Somali coffee brewed with authentic methods using
                cardamom and aromatic spices.
              </p>
            </div>

            <div className="luxury-card rounded-3xl p-8 text-center hover-lift fade-in-up delay-2">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-3 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Xawaashka Asalka ah
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Authentic Spices
              </h4>
              <p
                className={`font-sans mb-3 leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Waxaan isticmaalnaa xawaash dhabta ah oo ka yimid Soomaaliya si
                aan ugu darsano dhadhan asalka ah.
              </p>
              <p
                className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-400" : "text-stone-500"
                }`}
              >
                We use authentic spices imported from Somalia to ensure the
                original taste in every dish.
              </p>
            </div>

            <div className="luxury-card rounded-3xl p-8 text-center hover-lift fade-in-up delay-3">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-3 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Karinta Jacaylka leh
              </h3>
              <h4 className="font-sans text-lg text-amber-600 mb-4 font-medium">
                Cooked with Love
              </h4>
              <p
                className={`font-sans mb-3 leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                Cunto kastaa waxaan ku karinaa jacayl iyo feejignaan si ay u
                noqoto mid aad u macaan.
              </p>
              <p
                className={`font-sans text-sm leading-relaxed transition-all duration-700 ${
                  isDark ? "text-stone-400" : "text-stone-500"
                }`}
              >
                Every dish is prepared with love and care to ensure it becomes
                exceptionally delicious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-4xl"></div>

      {/* Our Vision Section */}
      <section
        className={`py-32 transition-all duration-700 ${
          isDark ? "bg-neutral-950" : "bg-stone-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-up delay-1">
              <div className="luxury-card rounded-3xl p-8 hover-lift">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                    alt="Traditional Somali Spices"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h4
                    className={`font-serif text-xl font-semibold mb-3 transition-all duration-700 ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    Meel la dhaqameedka ku kulmo
                  </h4>
                  <p className={`font-sans text-amber-600 mb-3`}>
                    Where tradition meets excellence
                  </p>
                </div>
              </div>
            </div>

            <div className="fade-in-up">
              <h2
                className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Aragtideenna <span className="gradient-text">Mustaqbalka</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mb-8"></div>

              <div className="space-y-6">
                <p
                  className={`font-sans text-lg leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  Aragtidayadu waa in aan noqonno meesha ugu caansan London ee
                  cuntada Soomaaliyeed. Waxaan rabnaa in qof kasta oo naga cunay
                  uu dareemo dhaqamadeenna quruxda badan.
                </p>

                <p
                  className={`font-sans text-base leading-relaxed transition-all duration-700 ${
                    isDark ? "text-stone-400" : "text-stone-500"
                  }`}
                >
                  Our vision is to become the most renowned place in London for
                  Somali cuisine. We want everyone who dines with us to
                  experience the beauty of our culture through authentic flavors
                  and warm hospitality.
                </p>

                <div className="flex items-start space-x-4 p-6 luxury-card rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4
                      className={`font-serif text-lg font-semibold mb-2 transition-all duration-700 ${
                        isDark ? "text-white" : "text-stone-900"
                      }`}
                    >
                      Yoolkayaga
                    </h4>
                    <p
                      className={`font-sans text-sm transition-all duration-700 ${
                        isDark ? "text-stone-300" : "text-stone-600"
                      }`}
                    >
                      In aan dhaqamada Soomaaliyeed ku faafino London oo dhan /
                      To spread Somali culture throughout London
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 luxury-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center fade-in-up text-content">
            <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Nala <span className="gradient-text">Wadaag</span> Sheekadiina
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>

            <p className="font-sans text-xl text-amber-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Kaalay oo ku biir sheekadiina. Waxaan ku martiqaadaynaa meel ay
              dhaqamadu ku kulanto casriga.
            </p>

            <p className="font-sans text-lg text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Come and join our story. We welcome you to a place where tradition
              meets modernity.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-amber-600 text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-amber-500 transition-all duration-300 shadow-xl hover-scale">
                <span className="flex items-center justify-center">
                  <span className="font-serif mr-2">Dalbo Miis</span>
                  <span>/</span>
                  <span className="ml-2">Reserve Table</span>
                </span>
              </button>

              <button className="border-2 border-white text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-white hover:text-stone-900 transition-all duration-300">
                <span className="flex items-center justify-center">
                  <span className="font-serif mr-2">Eeg Menu-ga</span>
                  <span>/</span>
                  <span className="ml-2">View Menu</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryAboutPage;
