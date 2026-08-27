import { collection, getDocs, limit, query, writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Starter content, carried across from the old hard-coded pages so a fresh
 * Firestore project isn't a blank site. Everything here is editable in the
 * dashboard afterwards — this only ever runs on empty collections.
 */

const CATEGORIES = [
  { key: "coffee", nameSo: "Qaxwo & Cabitaan", nameEn: "Coffee & drinks", order: 1 },
  { key: "mains", nameSo: "Cuntada Weyn", nameEn: "Main dishes", order: 2 },
  { key: "small", nameSo: "Cuntada Yar", nameEn: "Small plates & sweets", order: 3 },
];

const ITEMS: {
  cat: string;
  nameSo: string;
  nameEn: string;
  descriptionSo: string;
  descriptionEn: string;
  price: number;
  popular?: boolean;
  signature?: boolean;
}[] = [
  {
    cat: "coffee",
    nameSo: "Qaxwo Soomaali",
    nameEn: "Traditional Somali coffee",
    descriptionSo: "Bun la shiilay guriga, hayl iyo qorfe lagu daray.",
    descriptionEn: "House-roasted beans brewed with cardamom and cinnamon.",
    price: 4.5,
    popular: true,
    signature: true,
  },
  {
    cat: "coffee",
    nameSo: "Shaah Cadays",
    nameEn: "Spiced milk tea",
    descriptionSo: "Shaah macaan oo caano iyo xawaash leh.",
    descriptionEn: "Sweet tea with milk and warm spices.",
    price: 3.75,
    popular: true,
  },
  {
    cat: "coffee",
    nameSo: "Cappuccino Soomaali",
    nameEn: "Somali-style cappuccino",
    descriptionSo: "Cappuccino hayl lagu daray.",
    descriptionEn: "Cappuccino pulled with a cardamom finish.",
    price: 5.25,
    signature: true,
  },
  {
    cat: "coffee",
    nameSo: "Shaah Cadcad",
    nameEn: "Black tea",
    descriptionSo: "Shaah madow oo xawaash Soomaali ah lagu kariyay.",
    descriptionEn: "Black tea brewed with Somali spices.",
    price: 3.25,
  },
  {
    cat: "mains",
    nameSo: "Bariis Iskukaris",
    nameEn: "Signature spiced rice",
    descriptionSo: "Bariis xawaash leh, hilib ari iyo khudaar.",
    descriptionEn: "Spiced rice with goat meat and vegetables.",
    price: 16.5,
    popular: true,
    signature: true,
  },
  {
    cat: "mains",
    nameSo: "Hilib Ari oo Dubban",
    nameEn: "Grilled goat",
    descriptionSo: "Hilib ari si tartiib ah loo dubay.",
    descriptionEn: "Goat grilled slowly over coals.",
    price: 19.75,
    signature: true,
  },
  {
    cat: "mains",
    nameSo: "Baasto Soomaali",
    nameEn: "Somali pasta",
    descriptionSo: "Baasto hilib ari, basal iyo karooto leh.",
    descriptionEn: "Pasta with goat, onion and carrot.",
    price: 14.99,
    popular: true,
  },
  {
    cat: "mains",
    nameSo: "Kalluun Shiilan",
    nameEn: "Grilled fish",
    descriptionSo: "Kalluun badeed oo xawaash iyo basbaas leh.",
    descriptionEn: "Sea fish grilled with spice and pepper.",
    price: 17.5,
  },
  {
    cat: "mains",
    nameSo: "Digaag Curry",
    nameEn: "Chicken curry",
    descriptionSo: "Digaag curry Soomaaliyeed lagu kariyay, bariis la siiyo.",
    descriptionEn: "Chicken in Somali curry, served with rice.",
    price: 15.75,
  },
  {
    cat: "small",
    nameSo: "Sambuus Hilib",
    nameEn: "Meat samosas",
    descriptionSo: "Sambuus hilib ari iyo basal, subax kasta la sameeyo.",
    descriptionEn: "Goat and onion samosas, folded fresh each morning.",
    price: 7.99,
    popular: true,
  },
  {
    cat: "small",
    nameSo: "Anjero iyo Maraq",
    nameEn: "Anjero with stew",
    descriptionSo: "Anjero cusub oo maraq hilib lagu cuno.",
    descriptionEn: "Fresh anjero served with meat stew.",
    price: 9.5,
    popular: true,
  },
  {
    cat: "small",
    nameSo: "Sambuus Khudaar",
    nameEn: "Vegetable samosas",
    descriptionSo: "Sambuus khudaar kala duwan leh.",
    descriptionEn: "Samosas filled with mixed vegetables.",
    price: 6.99,
  },
  {
    cat: "small",
    nameSo: "Xalwo Soomaali",
    nameEn: "Somali halwa",
    descriptionSo: "Xalwo caadi ah oo sonkor iyo hayl leh.",
    descriptionEn: "Traditional halwa with sugar and cardamom.",
    price: 6.5,
    signature: true,
  },
];

const ROOMS = [
  {
    nameSo: "Qol Keli ah",
    nameEn: "Single room",
    descriptionSo:
      "Qol yar oo nadiif ah, sariir keli ah, musqul gaar ah iyo biyo kulul.",
    descriptionEn:
      "A compact, quiet room with a single bed, private bathroom and hot water. Good for one traveller staying a night or two.",
    pricePerNight: 25,
    capacity: 1,
    beds: 1,
    location: "First floor, courtyard side",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["Wi-Fi", "Private bathroom", "Hot water", "Desk", "Generator backup"],
    quantity: 4,
  },
  {
    nameSo: "Qol Laba Qof",
    nameEn: "Double room",
    descriptionSo:
      "Qol ballaadhan oo sariir weyn leh, qaboojiye iyo daaqad wadada dhinaceeda ah.",
    descriptionEn:
      "A larger room with a double bed, air conditioning and a window onto Argo Street. Breakfast in the cafe downstairs is included.",
    pricePerNight: 40,
    capacity: 2,
    beds: 1,
    location: "Second floor, street side",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: [
      "Wi-Fi",
      "Air conditioning",
      "Private bathroom",
      "Hot water",
      "Breakfast included",
      "Street view",
      "Generator backup",
    ],
    quantity: 3,
  },
  {
    nameSo: "Qol Qoys",
    nameEn: "Family room",
    descriptionSo:
      "Qol weyn oo saddex sariir leh, ku habboon qoys. Balakoon iyo adeeg qolka.",
    descriptionEn:
      "Our biggest room, with three beds and space for a family. Comes with a balcony, room service and daily housekeeping.",
    pricePerNight: 65,
    capacity: 5,
    beds: 3,
    location: "Top floor, corner with balcony",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: [
      "Wi-Fi",
      "Air conditioning",
      "Private bathroom",
      "Hot water",
      "Breakfast included",
      "Balcony",
      "Room service",
      "Daily housekeeping",
      "Safe",
    ],
    quantity: 2,
  },
];

export interface SeedResult {
  categories: number;
  items: number;
  rooms: number;
  skipped: string[];
}

async function isEmpty(name: string): Promise<boolean> {
  const snap = await getDocs(query(collection(db, name), limit(1)));
  return snap.empty;
}

/** Never overwrites. Any collection that already has content is left alone. */
export async function seedStarterContent(): Promise<SeedResult> {
  const result: SeedResult = {
    categories: 0,
    items: 0,
    rooms: 0,
    skipped: [],
  };
  const batch = writeBatch(db);

  const menuEmpty = await isEmpty("menuItems");
  const catsEmpty = await isEmpty("menuCategories");
  const roomsEmpty = await isEmpty("rooms");

  const categoryIds: Record<string, string> = {};

  if (catsEmpty) {
    for (const c of CATEGORIES) {
      const ref = doc(collection(db, "menuCategories"));
      categoryIds[c.key] = ref.id;
      batch.set(ref, { nameSo: c.nameSo, nameEn: c.nameEn, order: c.order });
      result.categories++;
    }
  } else {
    result.skipped.push("categories");
  }

  if (menuEmpty && catsEmpty) {
    ITEMS.forEach((item, index) => {
      const ref = doc(collection(db, "menuItems"));
      batch.set(ref, {
        nameSo: item.nameSo,
        nameEn: item.nameEn,
        descriptionSo: item.descriptionSo,
        descriptionEn: item.descriptionEn,
        price: item.price,
        categoryId: categoryIds[item.cat],
        imageUrl: "",
        available: true,
        popular: Boolean(item.popular),
        signature: Boolean(item.signature),
        order: index,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      result.items++;
    });
  } else if (!menuEmpty) {
    result.skipped.push("menu items");
  }

  if (roomsEmpty) {
    for (const room of ROOMS) {
      const ref = doc(collection(db, "rooms"));
      batch.set(ref, {
        ...room,
        images: [],
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      result.rooms++;
    }
  } else {
    result.skipped.push("rooms");
  }

  await batch.commit();
  return result;
}
