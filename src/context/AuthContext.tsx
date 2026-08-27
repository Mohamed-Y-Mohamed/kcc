"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureUserProfile, getUserProfile } from "@/lib/users";
import { can as roleCan, hasDashboardAccess, type Capability } from "@/lib/roles";
import type { AppUser, Role } from "@/lib/types";

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: AppUser | null;
  role: Role;
  /** Anyone with a reason to open the dashboard: owner, admin, manager, staff. */
  isStaff: boolean;
  /** Capability check — always prefer this over comparing role strings. */
  can: (capability: Capability) => boolean;
  /** True until the first auth state resolves — guards must wait on this. */
  loading: boolean;
  signUp: (input: {
    email: string;
    password: string;
    displayName: string;
    phone: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Firebase error codes are not something to show a guest. */
export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact us on +252 61 067 3194.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account already exists with that email. Try signing in instead.";
    case "auth/weak-password":
      return "Password needs to be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute and try again.";
    case "auth/network-request-failed":
      return "Can't reach the server. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email sign-in is switched off in Firebase. Enable Email/Password under Authentication → Sign-in method.";
    default:
      return error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (next) {
        try {
          setProfile(await ensureUserProfile(next));
        } catch (err) {
          // A rules failure here must not lock the whole app on a spinner.
          console.error("[KCC] Could not load user profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    setProfile(await getUserProfile(user.uid));
  }, [user]);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      displayName: string;
      phone: string;
    }) => {
      const cred = await createUserWithEmailAndPassword(
        auth,
        input.email.trim(),
        input.password
      );
      if (input.displayName) {
        await updateProfile(cred.user, { displayName: input.displayName });
      }
      // New accounts are always role "user". Promotion happens in the admin
      // dashboard — never from anything the sign-up form can send.
      setProfile(
        await ensureUserProfile(cred.user, {
          displayName: input.displayName,
          phone: input.phone,
        })
      );
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const role: Role = profile?.role ?? "user";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role,
      isStaff: hasDashboardAccess(role),
      can: (capability: Capability) => roleCan(role, capability),
      loading,
      signUp,
      signIn,
      signOutUser,
      resetPassword,
      refreshProfile,
    }),
    [
      user,
      profile,
      role,
      loading,
      signUp,
      signIn,
      signOutUser,
      resetPassword,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
