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
    <div className="flex h-screen items-center justify-center bg-[#0B0C10]">
      <Authenticator 
        variation="modal"
        components={{
          Header() {
            return (
              <div className="text-center pb-4">
                <h1 className="text-3xl font-bold text-white tracking-widest"><span className="text-cyan-400 font-black">FLOW</span>VOLT</h1>
                <p className="text-gray-400 text-sm mt-2">Sign in to your energy dashboard</p>
              </div>
            );
          }
        }}
      />
    </div>
  );
}
