"use client";

import { X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card border border-[rgba(255,255,255,0.1)] w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mt-4 mb-8">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Available Balance</h3>
                <div className="text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                  <span className="text-emerald-400">⚡</span> 345.50 <span className="text-lg text-gray-500 font-normal">kWh</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[rgba(16,185,129,0.1)] hover:bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.2)] transition-all group">
                  <div className="h-10 w-10 rounded-full bg-[rgba(16,185,129,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowDownCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-emerald-300">Deposit</span>
                </button>
                
                <button className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.05)] transition-all group">
                  <div className="h-10 w-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpCircle className="h-5 w-5 text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Withdraw</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Reserved for Pending Bids:</span>
                  <span className="text-white font-medium">12.00 kWh</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
