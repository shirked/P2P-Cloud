"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Authenticator, ThemeProvider, Theme, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useAuth } from "@/components/auth/AuthContext";
import { Zap } from "lucide-react";

/**
 * Premium FlowVolt Dark Theme for Amplify Authenticator
 */
const darkTheme: Theme = {
  name: 'flowvolt-premium-dark',
  tokens: {
    colors: {
      background: {
        primary: { value: 'rgba(15, 23, 42, 0.7)' },
      },
      font: {
        primary: { value: '#FFFFFF' },
        secondary: { value: '#94A3B8' },
      },
      brand: {
        primary: {
          10: { value: 'rgba(16, 185, 129, 0.1)' },
          80: { value: '#10b981' },
          100: { value: '#10b981' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          backgroundColor: { value: 'transparent' },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: { value: '#10b981' },
        },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '#10b981' },
            borderColor: { value: '#10b981' },
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
    // If session is already active, bounce to dashboard
    if (!isLoading && userId) {
      router.replace("/");
    }
  }, [userId, isLoading, router]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.05),transparent_40%)]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4 shadow-lg shadow-emerald-500/5">
                <Zap className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-widest leading-none">
                <span className="text-emerald-400 font-extrabold">FLOW</span>VOLT
            </h1>
            <p className="text-gray-400 text-sm mt-3 font-medium">Peer-to-Peer Energy Marketplace</p>
        </div>

        {/* Authenticator Container */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl backdrop-blur-xl">
          <ThemeProvider theme={darkTheme}>
            <Authenticator 
                components={{
                    Header() {
                        return <div className="h-4" />;
                    },
                    Footer() {
                        return (
                            <div className="text-center pb-6">
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Secure Node Authentication</p>
                            </div>
                        );
                    }
                }}
            >
              {({ user }) => (
                <View className="p-8 text-center">
                  <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Authenticated</h3>
                  <p className="text-gray-400 text-sm mb-8">Identity linked: {user?.username}</p>
                  <button 
                    onClick={() => router.replace("/")}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    Enter Dashboard
                  </button>
                </View>
              )}
            </Authenticator>
          </ThemeProvider>
        </div>

        {/* Home Link */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-white text-xs transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
          >
            ← Back to Landing Page
          </button>
        </div>

      </div>
    </div>
  );
}
