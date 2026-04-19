"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession } from "aws-amplify/auth";
import { Zap } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check if Amplify has already consumed the code and initialized session
    const verifySession = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        if (tokens?.accessToken) {
            router.replace('/');
        }
      } catch (e) {
        // Session not ready yet, wait for Hub listener
      }
    };
    verifySession();

    // 2. Listen for the code exchange completion
    const unsubscribe = Hub.listen("auth", (data) => {
      if (data.payload.event === "signInWithRedirect") {
        router.replace("/");
      } else if (data.payload.event === "signInWithRedirect_failure") {
        console.error("Auth routing failed:", data.payload.data);
        router.replace("/?error=auth_failed");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card p-10 rounded-3xl flex flex-col items-center space-y-6 max-w-md w-full text-center border border-[rgba(255,255,255,0.05)] shadow-2xl">
        <div className="h-16 w-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
          <Zap className="h-8 w-8 text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white">Establishing Secure Link</h1>
        <p className="text-gray-400 text-sm">Verifying credentials and completing the handshake...</p>
        
        <div className="w-full h-1 bg-white/10 rounded overflow-hidden mt-4">
          <div className="h-full bg-cyan-500 w-full animate-pulse opacity-50"></div>
        </div>
      </div>
    </div>
  );
}
