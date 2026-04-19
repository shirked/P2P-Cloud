"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Authenticator, ThemeProvider, Theme, View, useTheme } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useAuth } from "@/components/auth/AuthContext";

// Define a professional dark theme for the login box
const darkTheme: Theme = {
  name: 'flow-volt-dark',
  tokens: {
    colors: {
      background: {
        primary: { value: '#1e293b' }, // matches glass-card
      },
      font: {
        primary: { value: '#ffffff' },
      },
      brand: {
        primary: {
          '10': { value: '{colors.emerald.10}' },
          '80': { value: '{colors.emerald.80}' },
          '100': { value: '#10b981' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: '0 0 40px rgba(0,0,0,0.5)' },
        },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '{colors.emerald.100}' },
            borderColor: { value: '{colors.emerald.100}' },
          },
        },
      },
    },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { userId, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isLoading && userId) {
      router.replace("/");
    }
  }, [userId, isLoading, router]);

  if (!isMounted) return null;

  // Real-time check if variables are actually in the browser
  const poolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const hasConfig = !!poolId && !!clientId;

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md">
        {!hasConfig ? (
          <div className="glass-card p-8 rounded-2xl border border-rose-500/20 text-center">
            <h2 className="text-xl font-bold text-rose-400 mb-4">AWS Config Missing</h2>
            <p className="text-gray-400 text-sm mb-6">
              The browser is not receiving your Cognito environment variables.
            </p>
            <div className="text-left text-xs bg-black/40 p-4 rounded-lg space-y-2 mb-6 font-mono">
              <div className={poolId ? "text-emerald-400" : "text-rose-400"}>
                {poolId ? "✓" : "✗"} User Pool ID: {poolId ? "Found" : "Missing"}
              </div>
              <div className={clientId ? "text-emerald-400" : "text-rose-400"}>
                {clientId ? "✓" : "✗"} Client ID: {clientId ? "Found" : "Missing"}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-6 italic">
              Note: You must click "Redeploy" in Vercel after adding new environment variables.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="text-white bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-lg text-sm transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        ) : (
          <ThemeProvider theme={darkTheme}>
            <View className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <Authenticator 
                components={{
                  Header() {
                    return (
                      <div className="text-center pb-6 pt-8 border-b border-white/5 mb-4">
                        <h1 className="text-2xl font-bold text-white tracking-widest leading-none">
                          <span className="text-emerald-400">FLOW</span>VOLT
                        </h1>
                        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-tighter">Secure Authentication Portal</p>
                      </div>
                    );
                  }
                }}
              />
            </View>
            <div className="mt-8 text-center">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                ← Return to Dashboard
              </button>
            </div>
          </ThemeProvider>
        )}
      </div>
    </div>
  );
}
