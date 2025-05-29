"use client";
import React, { useState, useMemo } from "react";
import {
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Heart,
  Star,
  Sparkles,
  Clock,
  MapPin,
  Award,
  Crown,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const LuxuryMenuPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Menu data
  const menuCategories = [
    {
      id: "coffee",
      title: "Qahwo & Cabitaan",
      titleEn: "Coffee & Beverages",
      icon: Coffee,
      description: "Qahwo iyo cabitaan caadi ah oo dhadhan macaan leh",
      descriptionEn: "Authentic coffee and beverages with exceptional flavors",
      items: [
        {
          name: "Qahwo Soomaali",
          nameEn: "Traditional Somali Coffee",
          description:
            "Qahwo caadi ah oo la shiil cardamom, cinnamon iyo sonkor",
          descriptionEn:
            "Traditional coffee brewed with cardamom, cinnamon and sugar",
          price: "$4.50",
          popular: true,
          signature: true,
        },
        {
          name: "Shaah Cadays",
          nameEn: "Spiced Milk Tea",
          description: "Shaah macaan oo leh caano iyo xawaash kala duwan",
          descriptionEn: "Sweet tea with milk and various aromatic spices",
          price: "$3.75",
          popular: true,
        },
        {
          name: "Cappuccino Soomaali",
          nameEn: "Somali Style Cappuccino",
          description:
            "Cappuccino la hagaajiyay hab Soomaaliyeed oo cardamom leh",
          descriptionEn:
            "Cappuccino adapted Somali style with cardamom essence",
          price: "$5.25",
          signature: true,
        },
        {
          name: "Shaah Cadcad",
          nameEn: "Black Tea",
          description: "Shaah madow oo la kariyay xawaash Soomaaliyeed",
          descriptionEn: "Black tea brewed with traditional Somali spices",
          price: "$3.25",
        },
      ],
    },
    {
      id: "mains",
      title: "Cuntada Weyn",
      titleEn: "Main Dishes",
      icon: UtensilsCrossed,
      description: "Cuntada dhaqameedka Soomaaliyeed ee caadiga ah",
      descriptionEn:
        "Traditional Somali dishes prepared with authentic methods",
      items: [
        {
          name: "Bariis Iskukaris",
          nameEn: "Signature Spiced Rice",
          description:
            "Bariis la kariyay xawaash Soomaali ah, hilib ari iyo khudaar",
          descriptionEn:
            "Rice cooked with Somali spices, goat meat and vegetables",
          price: "$16.50",
          popular: true,
          signature: true,
        },
        {
          name: "Hilib Ari oo Dubban",
          nameEn: "Grilled Goat Meat",
          description: "Hilib ari oo si fiican loo dubay xawaash Soomaaliyeed",
          descriptionEn:
            "Perfectly grilled goat meat with traditional Somali spices",
          price: "$19.75",
          signature: true,
        },
        {
          name: "Baasto Soomaali",
          nameEn: "Somali Pasta",
          description: "Baasto la kariyay hilib ari, banaan iyo carrot",
          descriptionEn: "Pasta cooked with goat meat, onions and carrots",
          price: "$14.99",
          popular: true,
        },
        {
          name: "Kalluun Shiilan",
          nameEn: "Grilled Fish",
          description: "Kalluun badeed oo la shilay xawaash iyo basbaas",
          descriptionEn: "Fresh seafish grilled with spices and black pepper",
          price: "$17.50",
        },
        {
          name: "Digaag Curry",
          nameEn: "Chicken Curry",
          description: "Digaag oo lagu kariyay curry Soomaaliyeed iyo bariis",
          descriptionEn: "Chicken cooked in Somali curry served with rice",
          price: "$15.75",
        },
      ],
    },
    {
      id: "appetizers",
      title: "Cuntada Yar",
      titleEn: "Appetizers & Sides",
      icon: ChefHat,
      description: "Cunto yar oo macaan ah si aad u bilaabto cuntooyinka",
      descriptionEn: "Delightful small dishes to begin your culinary journey",
      items: [
        {
          name: "Sambuus Hilib",
          nameEn: "Meat Samosas",
          description: "Sambuus macaan oo buuxa hilib ari iyo basaas",
          descriptionEn: "Delicious samosas filled with goat meat and onions",
          price: "$7.99",
          popular: true,
        },
        {
          name: "Xalwo Soomaali",
          nameEn: "Traditional Halwa",
          description: "Xalwo caadi ah oo la sameeyay sonkor iyo cardamom",
          descriptionEn: "Traditional halwa made with sugar and cardamom",
          price: "$6.50",
          signature: true,
        },
        {
          name: "Anjero iyo Maraq",
          nameEn: "Anjero with Stew",
          description: "Anjero caadi ah oo la cunayo maraq hilib",
          descriptionEn: "Traditional flatbread served with meat stew",
          price: "$9.50",
          popular: true,
        },
        {
          name: "Sambuus Khudaar",
          nameEn: "Vegetable Samosas",
          description: "Sambuus vegetarian ah oo buuxa khudaar kala duwan",
          descriptionEn: "Vegetarian samosas filled with mixed vegetables",
          price: "$6.99",
        },
      ],
    },
    {
      id: "desserts",
      title: "Macmacaan",
      titleEn: "Desserts & Sweets",
      icon: Heart,
      description: "Macmacaan caadi ah oo dhadhan fiican leh",
      descriptionEn: "Traditional sweets with exquisite flavors",
      items: [
        {
          name: "Malawax",
          nameEn: "Sweet Pancakes",
          description: "Malawax macaan oo leh malab iyo butter",
          descriptionEn: "Sweet pancakes with honey and butter",
          price: "$6.50",
          popular: true,
        },
        {
          name: "Basbousa Soomaali",
          nameEn: "Somali Semolina Cake",
          description: "Basbousa macaan oo leh coconut iyo shaaha ros",
          descriptionEn: "Sweet semolina cake with coconut and rose water",
          price: "$7.75",
          signature: true,
        },
        {
          name: "Qumbe",
          nameEn: "Traditional Donuts",
          description: "Qumbe macaan oo la dubay sonkor iyo cinnamon",
          descriptionEn: "Sweet donuts fried with sugar and cinnamon",
          price: "$5.25",
        },
        {
          name: "Fruit Salad Tropical",
          nameEn: "Tropical Fruit Salad",
          description: "Salad miro ah oo leh mango, papaya iyo coconut",
          descriptionEn: "Fresh fruit salad with mango, papaya and coconut",
          price: "$6.25",
        },
      ],
    },
  ];

  const restaurantInfo = {
    name: "Menu Khaas Ah",
    subtitle: "Authentic Somali Cuisine • Dhadhan Caadi Ah",
    location: "123 Heritage Street, Southall, London",
    hours: "8:00 AM - 11:00 PM",
    phone: "+44 20 1234 5678",
  };

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

        .glass-effect {
          backdrop-filter: blur(16px);
          background: ${isDark
            ? "rgba(30, 30, 30, 0.6)"
            : "rgba(237, 234, 222, 0.8)"};
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
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center luxury-gradient">
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
            {/* Logo */}
            <div className="mb-12">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-amber-400/40 hover-scale">
                <img
                  src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=200&q=80"
                  alt="KCC Restaurant Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="gradient-text">Menu</span> Khaas Ah
            </h1>
          </div>

          <div className="fade-in-up delay-1 text-content">
            <p className="font-serif text-2xl md:text-3xl text-amber-200 mb-4">
              Authentic Somali Cuisine
            </p>
            <p className="font-sans text-lg text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Dhadhan Caadi Ah — Experience the authentic flavors of Somalia
            </p>
          </div>

          {/* Restaurant Info */}
          <div className="fade-in-up delay-2 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-amber-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="font-sans">{restaurantInfo.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-sans">{restaurantInfo.hours}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      {menuCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          className={`py-32 transition-all duration-700 ${
            categoryIndex % 2 === 0
              ? isDark
                ? "bg-gradient-to-br from-neutral-900 via-amber-950/20 to-orange-950/20"
                : "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30"
              : isDark
              ? "bg-neutral-950"
              : "bg-stone-50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Category Header */}
            <div className="text-center mb-20 fade-in-up text-content">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full luxury-card flex items-center justify-center shadow-xl hover-scale">
                <category.icon className="w-10 h-10 text-amber-600" />
              </div>

              <h2
                className={`font-serif text-5xl md:text-6xl font-semibold mb-6 transition-all duration-700 ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                <span className="gradient-text">{category.title}</span>
              </h2>

              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>

              <p className="font-sans text-lg text-amber-600 mb-4 font-medium">
                {category.titleEn}
              </p>

              <p
                className={`font-sans text-lg max-w-3xl mx-auto transition-all duration-700 ${
                  isDark ? "text-stone-300" : "text-stone-600"
                }`}
              >
                {category.description}
              </p>

              <p
                className={`font-sans text-base max-w-3xl mx-auto mt-2 transition-all duration-700 ${
                  isDark ? "text-stone-400" : "text-stone-500"
                }`}
              >
                {category.descriptionEn}
              </p>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`luxury-card rounded-2xl p-8 hover-lift fade-in-up delay-${
                    (itemIndex % 4) + 1
                  } group relative overflow-hidden`}
                >
                  {/* Content */}
                  {/* Content */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.signature && (
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Crown className="w-3 h-3" />
                            <span>Signature</span>
                          </div>
                        )}
                        {item.popular && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>Popular</span>
                          </div>
                        )}
                      </div>
                      <h3
                        className={`font-serif text-2xl font-semibold mb-2 transition-all duration-700 ${
                          isDark ? "text-white" : "text-stone-900"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <h4 className="font-sans text-lg text-amber-600 font-medium mb-4">
                        {item.nameEn}
                      </h4>
                    </div>
                    <div className="text-3xl font-serif font-bold text-amber-600 ml-4">
                      {item.price}
                    </div>
                  </div>

                  {/* Decorative Line */}
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-500 ${
                      item.signature
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                        : item.popular
                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                        : "bg-gradient-to-r from-amber-600/20 to-orange-600/20"
                    } opacity-0 group-hover:opacity-100`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          {categoryIndex < menuCategories.length - 1 && (
            <div className="section-divider mx-auto max-w-4xl mt-20"></div>
          )}
        </section>
      ))}

      {/* Call to Action */}
      <section className="py-32 luxury-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center fade-in-up text-content">
            <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-white mb-6">
              Soo Nagu <span className="gradient-text">Booqda</span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-8"></div>

            <p className="font-sans text-xl text-amber-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Kaalay oo dhaqaaq cuntadeenna caadiga ah iyo qahwaha macaan.
              Waxaad ka heli doontaa dhadhan aan la illoobi karin.
            </p>

            <p className="font-sans text-lg text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Come and taste our authentic cuisine and delicious coffee. You
              will experience unforgettable flavors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="glass-effect p-6 rounded-2xl">
                <div className="flex items-center space-x-3 text-gray-200">
                  <MapPin className="w-5 h-5" />
                  <span
                    className={`font-sans ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {restaurantInfo.location}
                  </span>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <span
                    className={`font-sans ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    📞 {restaurantInfo.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button className="bg-amber-600 text-white px-12 py-4 rounded-full font-sans font-medium hover:bg-amber-500 transition-all duration-300 shadow-xl hover-scale">
                <span className="flex items-center justify-center">
                  <span className="font-serif mr-2">Dalbo Miis</span>
                  <span>/</span>
                  <span className="ml-2">Make Reservation</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuxuryMenuPage;
