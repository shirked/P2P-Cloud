"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser, signInWithRedirect, signOut as amplifySignOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { configureAmplify } from "@/lib/amplify-config";

// Detect cloud mode at module level
const isCloudLive = !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;

// Configure Amplify synchronously outside the React tree for Next.js App Router compatibility
if (isCloudLive) {
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

  useEffect(() => {
    if (isCloudLive) {
      checkSession();

      const unsubscribe = Hub.listen("auth", (data) => {
        if (data.payload.event === "signedIn") {
          checkSession();
        } else if (data.payload.event === "signedOut") {
          setUserId(null);
        }
      });

      return () => unsubscribe();
    } else {
      // Mock Mode
      setUserId("mock-user-42");
      setIsLoading(false);
    }
  }, []);

  const checkSession = async () => {
    try {
      const user = await getCurrentUser();
      setUserId(user.username || user.userId);
    } catch (err) {
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    if (isCloudLive) {
      // Trigger Cognito Hosted UI / OAuth flow
      signInWithRedirect();
    } else {
      console.log("[Mock] Login triggered.");
      setUserId("mock-user-42");
    }
  };

  const logout = async () => {
    if (isCloudLive) {
      await amplifySignOut();
      setUserId(null);
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
