/**
 * Clears dead image links off `foodItems`.
 *
 * The imported photos lived on a Supabase project that no longer exists — the
 * hostname does not even resolve — so every one of them rendered as a broken
 * image. This blanks `image` so the site falls back to its woven placeholder.
 *
 * It does NOT throw the URLs away: the old value is copied to `legacyImage`
 * first. Those filenames name the dish (`1752426911990_Soor.jpeg`), which makes
 * re-shooting and re-uploading far easier later. Nothing here is one-way.
 *
 * Usage, from the project root:
 *   node --env-file=.env scripts/clear-broken-images.mjs            # dry run
 *   node --env-file=.env scripts/clear-broken-images.mjs --apply    # write
 *
 * Requires an admin/owner sign-in once firestore.rules is deployed:
 *   node --env-file=.env scripts/clear-broken-images.mjs --apply \
 *     --email you@example.com --password 'your-password'
 */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const email = flag("--email");
const password = flag("--password");
if (email && password) {
  await signInWithEmailAndPassword(getAuth(app), email, password);
  console.log(`signed in as ${email}\n`);
}

/** A link is only dead if the request genuinely fails or is not an image. */
async function isReachable(url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith("image/");
  } catch {
    return false;
  }
}

const snap = await getDocs(collection(db, "foodItems"));
const items = snap.docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .filter((d) => typeof d.image === "string" && d.image);

console.log(`${snap.size} food items, ${items.length} carrying an image URL`);

if (items.length === 0) {
  console.log("Nothing to do.");
  process.exit(0);
}

// Check one URL per host before checking all of them — if the host is gone,
// there is no point firing 131 requests at it.
const hosts = [...new Set(items.map((i) => new URL(i.image).host))];
const deadHosts = new Set();
for (const host of hosts) {
  const probe = items.find((i) => new URL(i.image).host === host);
  const alive = await isReachable(probe.image);
  if (!alive) deadHosts.add(host);
  console.log(`host ${host}: ${alive ? "reachable" : "DEAD"}`);
}

const broken = [];
for (const item of items) {
  const host = new URL(item.image).host;
  if (deadHosts.has(host)) {
    broken.push(item);
    continue;
  }
  if (!(await isReachable(item.image))) broken.push(item);
}

console.log(`\n${broken.length} broken, ${items.length - broken.length} fine`);

if (!apply) {
  console.log("\nDry run. Nothing was written. Re-run with --apply to clear them.");
  for (const item of broken.slice(0, 5)) {
    console.log(`  would clear: ${item.name?.en ?? item.id}`);
  }
  if (broken.length > 5) console.log(`  …and ${broken.length - 5} more`);
  process.exit(0);
}

// Firestore caps a batch at 500 writes; 131 fits, but chunk anyway.
let written = 0;
for (let i = 0; i < broken.length; i += 400) {
  const chunk = broken.slice(i, i + 400);
  const batch = writeBatch(db);
  for (const item of chunk) {
    batch.update(doc(db, "foodItems", item.id), {
      legacyImage: item.image, // keep it — the filename names the dish
      image: "",
      imageSource: "none",
      updatedAt: new Date().toISOString(),
    });
  }
  await batch.commit();
  written += chunk.length;
  console.log(`cleared ${written}/${broken.length}`);
}

console.log(
  `\nDone. ${written} items now show the woven placeholder instead of a broken image.` +
    `\nThe old URLs are kept in each document's legacyImage field.`
);
process.exit(0);
