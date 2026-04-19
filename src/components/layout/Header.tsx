"use client";

import { Bell, Wallet, User, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import NotificationCenter from "../ui/NotificationCenter";
import WalletModal from "../ui/WalletModal";
import { useAuth } from "../auth/AuthContext";

export function Header() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { userId, isAuthenticated, login, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-[rgba(255,255,255,0.05)] glass px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex md:hidden text-lg font-bold items-center gap-2 text-white">
          <span className="text-emerald-400">⚡</span> FlowVolt
        </div>
        <div className="hidden md:block"></div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] relative"
            onClick={() => setIsNotifOpen(true)}
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-amber-500 ring-2 ring-slate-900" />
          </button>

          <div className="hidden sm:block h-6 w-px bg-[rgba(255,255,255,0.1)]" aria-hidden="true" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <User className="h-4 w-4 text-emerald-400" />
                </div>
                {userId}
              </div>

              <button
                onClick={() => setIsWalletOpen(true)}
                className="flex items-center gap-2 bg-[rgba(16,185,129,0.15)] hover:bg-[rgba(16,185,129,0.25)] text-emerald-300 px-4 py-2 rounded-full transition-all duration-200 border border-[rgba(16,185,129,0.2)]"
              >
                <Wallet className="h-4 w-4" />
                <span className="font-semibold text-sm">345.50 kWh</span>
              </button>

              <button
                onClick={logout}
                className="text-gray-400 hover:text-rose-400 transition-colors p-2 rounded-full hover:bg-rose-500/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}

        </div>
      </header>

      {/* Slide-overs & Modals */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </>
  );
}
