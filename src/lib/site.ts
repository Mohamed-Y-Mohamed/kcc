/**
 * Single source of truth for business details. These were previously repeated
 * across the landing, about, contact and footer files — change the phone number
 * here and it changes everywhere.
 */
export const SITE = {
  name: "KCC",
  fullName: "KCC Cafe, Restaurant & Hotel",
  taglineSo: "Qaxwo, Cunto & Hoteel",
  taglineEn: "Coffee, kitchen and rooms",

  address: {
    street: "Argo Street",
    city: "Golol",
    country: "Somalia",
    full: "Argo Street, Golol, Somalia",
    mapsUrl:
      "https://www.google.com/maps/search/Argo+Street,+Golol,+Somalia/@2.0469,45.3182,15z",
    lat: 2.0469,
    lng: 45.3182,
  },

  phone: {
    display: "+252 61 067 3194",
    e164: "+252610673194",
    whatsapp: "252610673194",
  },

  /**
   * NOTE: the address carried over from the old site was
   * `112@kcccoffee&restaurant.com`, which is not a valid address — `&` cannot
   * appear in a domain name, so mail to it will bounce. It is shown as plain
   * text rather than a mailto link until a working address replaces it.
   */
  email: {
    display: "112@kcccoffee&restaurant.com",
    isValid: false,
  },

  hours: {
    so: "8:00 subaxnimo – 11:00 habeenimo",
    en: "8:00 AM – 11:00 PM",
    daysSo: "Maalin kasta",
    daysEn: "Every day",
  },

  social: [
    { label: "TikTok", href: "https://www.tiktok.com/@kcc.coffee" },
    { label: "Facebook", href: "https://facebook.com/kccrestaurant" },
    { label: "X", href: "https://twitter.com/kccrestaurant" },
  ],
} as const;

export const WHATSAPP_URL = `https://wa.me/${SITE.phone.whatsapp}`;
