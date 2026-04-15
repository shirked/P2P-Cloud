"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Activity, Zap } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { name: "Ledger", href: "/ledger", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 glass z-50 border-r border-[rgba(255,255,255,0.05)]">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-6 font-bold text-xl gap-2 text-white border-b border-[rgba(255,255,255,0.05)]">
          <Zap className="h-6 w-6 text-emerald-400 fill-emerald-400" />
          <span>FlowVolt</span>
        </div>
        
        {/* Connection Status Badge */}
        <div className="px-6 py-4">
          <div className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
            process.env.NEXT_PUBLIC_LAMBDA_URL
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          )}>
            <div className={clsx("h-1.5 w-1.5 rounded-full", process.env.NEXT_PUBLIC_LAMBDA_URL ? "bg-emerald-400" : "bg-amber-400")} />
            {process.env.NEXT_PUBLIC_LAMBDA_URL ? "Cloud Live" : "Mock Mode"}
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  isActive ? "bg-[rgba(255,255,255,0.1)] text-white" : "text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white",
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                )}
              >
                <item.icon
                  className={clsx(
                    isActive ? "text-emerald-400" : "text-gray-400 group-hover:text-emerald-300",
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 glass z-50 border-t border-[rgba(255,255,255,0.05)] pb-safe">
      <nav className="flex items-center justify-around h-16 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                isActive ? "text-emerald-400" : "text-gray-400 hover:text-white",
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
