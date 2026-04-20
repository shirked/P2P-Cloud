"use client";

import { X, ShoppingBag, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { useState } from "react";
import { purchaseEnergyUnit } from "@/lib/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unit: Transaction | null;
}

export default function PurchaseModal({ isOpen, onClose, unit }: Props) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [txnId, setTxnId] = useState<string | null>(null);

  if (!unit) return null;

  const totalCost = (unit.amount * unit.price).toFixed(2);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    console.log("[Marketplace] Fetching session for purchase...");

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || "";

      if (!token) throw new Error("No authentication token available");

      console.log("[Marketplace] Executing live purchase for ID:", unit.id);
      const transactionId = await purchaseEnergyUnit(unit.id, token);

      if (transactionId) {
        console.log("[Marketplace] Purchase successful! TX ID:", transactionId);
        setTxnId(transactionId);
        setIsPurchased(true);

        // Invalidate queries to refresh the marketplace and ledger
        queryClient.invalidateQueries({ queryKey: ['marketplace', userId] });
        queryClient.invalidateQueries({ queryKey: ['ledger', userId] });
        queryClient.invalidateQueries({ queryKey: ['telemetry'] });
      } else {
        throw new Error("Purchase failed - Unit might no longer be available.");
      }
    } catch (error) {
      console.error("[Marketplace] Purchase Critical Error:", error);
      alert("Purchase failed. The unit may have already been sold or your session expired.");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsPurchased(false);
    setTxnId(null);
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
                  <ShoppingBag className="text-cyan-400 h-6 w-6" /> {isPurchased ? "Order Confirmed" : "Confirm Order"}
                </h2>
                <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {isPurchased ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="bg-emerald-500/10 p-5 rounded-full mb-6">
                      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Purchase Complete!</h3>
                    <p className="text-gray-400 mb-8 max-w-[280px]">Your energy unit has been successfully transferred to your storage node.</p>
                    
                    <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10 mb-8">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Blockchain Transaction ID</p>
                      <p className="text-sm font-mono text-cyan-400 break-all select-all cursor-pointer hover:text-cyan-300 transition-colors">
                        {txnId}
                      </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all"
                    >
                        Back to Marketplace
                    </button>
                  </motion.div>
                ) : (
                  <>
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
                            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processing...
                              </>
                            ) : "Buy Now"}
                        </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
