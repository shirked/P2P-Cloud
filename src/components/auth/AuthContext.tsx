"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchAuthSession, signInWithRedirect, signOut as amplifySignOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { configureAmplify } from "@/lib/amplify-config";

// Detect cloud mode at module level
const isCloudLive = !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;

// Configure Amplify synchronously outside the React tree for Next.js App Router compatibility
if (typeof window !== "undefined" && isCloudLive) {
  configureAmplify();
}

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("[Auth Flow] isCloudLive flag evaluated to:", isCloudLive);
    if (isCloudLive) {
      checkSession();

      const unsubscribe = Hub.listen("auth", (data) => {
        if (data.payload.event === "signedIn" || data.payload.event === "signInWithRedirect") {
          checkSession();
        } else if (data.payload.event === "signedOut") {
          setUserId(null);
        }
      });

      return () => unsubscribe();
    } else {
      // Mock Mode
      console.log("[Auth Flow] Fallback Mock Mode Initiated.");
      setUserId("mock-user-42");
      setIsLoading(false);
    }
  }, []);

  const checkSession = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      if (tokens?.accessToken) {
        // Support environments where only 'email' scope is checked (no idToken)
        const username = (tokens.idToken?.payload?.email as string) || (tokens.idToken?.payload?.['cognito:username'] as string) || "Authenticated Volt User";
        setUserId(username);
      } else {
        setUserId(null);
      }
    } catch (err) {
      console.warn("[Auth Flow] checkSession error:", err);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    if (isCloudLive) {
      router.push('/login');
    } else {
      console.log("[Auth Flow] Mock Login triggered.");
      setUserId("mock-user-42");
    }
  };

  const logout = async () => {
    if (isCloudLive) {
      try {
        await amplifySignOut();
      } catch (e) {
        console.error("[Auth Flow] Sign out failed:", e);
      } finally {
        setUserId(null);
        router.push('/');
      }
    } else {
      console.log("[Mock] Logout triggered.");
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated: !!userId, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
