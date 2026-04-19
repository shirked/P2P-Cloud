"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "@/components/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    // If the AuthContext picks up that we have a userId, we are logged in
    if (userId) {
      router.replace("/");
    }
  }, [userId, router]);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-10rem)] bg-transparent">
      <div className="w-full max-w-md">
        <Authenticator 
          components={{
            Header() {
              return (
                <div className="text-center pb-8 pt-4">
                  <h1 className="text-3xl font-bold text-white tracking-widest"><span className="text-cyan-400 font-black">FLOW</span>VOLT</h1>
                  <p className="text-gray-400 text-sm mt-2 font-medium">Secure Node Authentication</p>
                </div>
              );
            }
          }}
        />
        
        <div className="mt-8 text-center">
           <button 
             onClick={() => router.push('/')}
             className="text-gray-500 hover:text-white text-sm transition-colors border-b border-gray-800 hover:border-white pb-1"
           >
             ← Return to Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}
