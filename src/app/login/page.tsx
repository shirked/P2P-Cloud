"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Authenticator, View, Heading, Text, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/components/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { userId, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleForcedLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      {/* 1. Basic Identity Check */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Login Portal</h1>
        <p className="text-sm text-gray-400">
          Auth State: <span className={userId ? "text-emerald-400" : "text-amber-400"}>
            {userId ? `Logged in as ${userId}` : "Not Logged In"}
          </span>
        </p>
      </div>

      {/* 2. Bare-bones Authenticator (No customizations) */}
      <div className="bg-white rounded-lg p-2">
        <Authenticator>
          {({ signOut: internalSignOut, user }) => (
            <main className="p-6 text-center text-slate-900">
              <Heading level={1}>You are authenticated!</Heading>
              <Text marginTop="1rem">Welcome, {user?.username}</Text>
              <Button onClick={() => router.push("/")} variation="primary" marginTop="1rem">
                Go to Dashboard
              </Button>
            </main>
          )}
        </Authenticator>
      </div>

      {/* 3. Session Reset (Only if box is empty) */}
      <div className="mt-20 text-center space-y-4">
        <p className="text-xs text-gray-500 max-w-xs">
          If you see a blank box above, your login session might be "stuck". 
          Click the button below to clear all AWS data and refresh.
        </p>
        <button 
          onClick={handleForcedLogout}
          className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded hover:bg-rose-500/20 transition-all"
        >
          Reset Auth Session & Refresh
        </button>
        <br />
        <button 
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-white text-xs underline"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
