"use client";

import { X, ShoppingBag, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unit: Transaction | null;
}

export default function PurchaseModal({ isOpen, onClose, unit }: Props) {
  if (!unit) return null;

  const totalCost = (unit.amount * unit.price).toFixed(2);

  const handleConfirm = () => {
    // Logic to call AWS Lambda / DynamoDB update would go here
    console.log("Confirming purchase:", unit.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card border border-[rgba(255,255,255,0.1)] w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="text-cyan-400 h-6 w-6" /> Confirm Order
                </h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                        <span className="text-gray-400 text-sm">Energy Unit</span>
                        <span className="text-white font-bold text-xl">{unit.amount.toFixed(1)} kWh</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Rate</span>
                        <span className="text-white">{unit.price} cR/kWh</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-4">
                        <span className="text-gray-400 text-sm font-medium">Total Cost</span>
                        <span className="text-3xl font-bold text-cyan-400">{totalCost} <span className="text-sm font-normal text-gray-400">cR</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 bg-white/3 p-3 rounded-lg border border-white/5 italic">
                    <ShieldCheck className="h-4 w-4 text-emerald-500/50 flex-shrink-0" />
                    Secure Transaction: Funds will be held in escrow until the Smart Contract verifies the energy handshake.
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3.5 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                    >
                        Buy Now
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
