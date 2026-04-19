"use client";

import { useEffect } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { Zap } from "lucide-react";

export default function LoginPage() {
  useEffect(() => {
    // Attempt redirect after a brief visual delay to ensure config loads
    const timer = setTimeout(() => {
      try {
        signInWithRedirect();
      } catch (err) {
        console.error("Failed to redirect to Hosted UI", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card p-10 rounded-3xl flex flex-col items-center space-y-6 max-w-md w-full text-center border border-[rgba(255,255,255,0.05)] shadow-2xl">
        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
          <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white">Authenticating...</h1>
        <p className="text-gray-400 text-sm">Transferring you to the secure AWS Cognito terminal.</p>
        
        <div className="w-full h-1 bg-white/10 rounded overflow-hidden mt-4">
          <div className="h-full bg-emerald-500 w-1/3 animate-ping"></div>
        </div>
      </div>
    </div>
  );
}
