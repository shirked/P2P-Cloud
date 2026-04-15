"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: Props) {
  const notifications = [
    { id: 1, title: "Trade Successful", desc: "Sold 2.0 kWh to user-92 for 0.22 cR", type: "success", time: "10m ago" },
    { id: 2, title: "Low Energy Warning", desc: "Your balance is below 10 kWh.", type: "warning", time: "2h ago" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm glass-card border-l border-[rgba(255,255,255,0.05)] shadow-2xl z-50 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Notifications</h2>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 rounded-xl bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-semibold ${notif.type === "success" ? "text-emerald-400" : "text-amber-400"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{notif.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
