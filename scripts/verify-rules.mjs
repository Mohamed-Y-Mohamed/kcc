/**
 * Checks the deployed Firestore rules from the outside, signed out.
 *
 * This is the only way to know the rules actually took effect — the file being
 * in the repo proves nothing until it is published.
 *
 *   node --env-file=.env scripts/verify-rules.mjs
 *
 * Everything here is read-only apart from two writes that are *expected to be
 * rejected*; if either succeeds the database is still open and the script says
 * so loudly.
 */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  limit,
  query,
  where,
} from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

let pass = 0;
let fail = 0;

function report(ok, label, detail) {
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}${detail ? `  (${detail})` : ""}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}${detail ? `  (${detail})` : ""}`);
  }
}

async function shouldRead(name, label) {
  try {
    const snap = await getDocs(query(collection(db, name), limit(3)));
    report(true, label, `read ${snap.size}`);
  } catch (err) {
    report(false, label, `blocked: ${err.code ?? err.message}`);
  }
}

async function shouldBeDenied(name, label) {
  try {
    const snap = await getDocs(query(collection(db, name), limit(3)));
    report(false, label, `LEAKED ${snap.size} document(s) to a signed-out visitor`);
  } catch (err) {
    const denied = String(err.code ?? "").includes("permission-denied");
    report(denied, label, denied ? "denied" : `unexpected: ${err.code}`);
  }
}

console.log("\nSigned out, against the live project:\n");

console.log("Should be public — the shop window");
await shouldRead("foodItems", "read foodItems");
await shouldRead("rooms", "read rooms");
await shouldRead("dateBlocks", "read dateBlocks (PII-free availability)");

console.log("\nShould be locked — personal data");
await shouldBeDenied("users", "read users");
await shouldBeDenied("bookings", "read bookings");
await shouldBeDenied("messages", "read messages");
await shouldBeDenied("user", "read legacy user collection");

console.log("\nShould be rejected — writes from a stranger");
try {
  await addDoc(collection(db, "foodItems"), { name: { en: "rules probe", so: "" } });
  report(false, "write to foodItems", "ACCEPTED — anyone can edit your menu");
} catch (err) {
  const denied = String(err.code ?? "").includes("permission-denied");
  report(denied, "write to foodItems", denied ? "denied" : `unexpected: ${err.code}`);
}
try {
  await addDoc(collection(db, "rooms"), { nameEn: "rules probe" });
  report(false, "write to rooms", "ACCEPTED — anyone can add rooms");
} catch (err) {
  const denied = String(err.code ?? "").includes("permission-denied");
  report(denied, "write to rooms", denied ? "denied" : `unexpected: ${err.code}`);
}

console.log("\nComposite index for availability");
try {
  await getDocs(
    query(
      collection(db, "dateBlocks"),
      where("roomId", "==", "probe"),
      where("checkOut", ">", "2000-01-01")
    )
  );
  report(true, "dateBlocks roomId + checkOut index", "query ran");
} catch (err) {
  const missing = String(err.message).includes("index");
  report(
    false,
    "dateBlocks roomId + checkOut index",
    missing ? "INDEX MISSING — booking availability will fail" : err.code
  );
}

console.log(`\n${"=".repeat(60)}`);
console.log(fail === 0 ? `SECURE — ${pass} checks passed.` : `${fail} PROBLEM(S), ${pass} passed.`);
process.exit(fail === 0 ? 0 : 1);
