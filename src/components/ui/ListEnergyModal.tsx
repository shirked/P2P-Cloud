"use client";

import { useState } from "react";
import { X, Zap, DollarSign, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { listEnergyUnit } from "@/lib/api";
import { fetchAuthSession } from "aws-amplify/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";
import { useTelemetry } from "@/hooks/useTelemetry";
import { clsx } from "clsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListEnergyModal({ isOpen, onClose }: Props) {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { data: telemetry, isLoading: isLoadingTelemetry } = useTelemetry();
  
  const [amount, setAmount] = useState<string>("1.0");
  const [price, setPrice] = useState<string>("0.10");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStorage = telemetry?.totalStorage?.value ?? 0;
  const isInsufficient = parseFloat(amount || "0") > availableStorage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInsufficient) return;

    console.log("[Sell] Submit clicked");
    setIsSubmitting(true);

    try {
      const session = await fetchAuthSession();
      console.log("[Sell] Session fetched");
      const token = session.tokens?.idToken?.toString() || "";

      if (!token) throw new Error("No idToken found");

      console.log("[Sell] Calling API now...");
      const success = await listEnergyUnit(
        parseFloat(amount), 
        parseFloat(price), 
        token
      );

      if (success) {
        console.log("[Sell] Listing created successfully!");
        // Refresh both marketplace and telemetry to reflect escrow lock
        queryClient.invalidateQueries({ queryKey: ['marketplace', userId] });
        queryClient.invalidateQueries({ queryKey: ['telemetry'] });
        onClose();
        // Reset fields
        setAmount("1.0");
        setPrice("0.10");
      } else {
        throw new Error("API indicated failure without throwing");
      }
    } catch (error) {
      console.error("[Sell] CRITICAL UI ERROR:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              className="glass-card border border-[rgba(255,255,255,0.1)] w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="text-emerald-400 h-6 w-6" /> List Energy
                </h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-400">Amount to Sell (kWh)</label>
                    <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest">
                      Live Available: {availableStorage.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={clsx(
                        "w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all font-semibold",
                        isInsufficient ? "border-rose-500/50 focus:ring-2 focus:ring-rose-500/30" : "border-white/10 focus:ring-2 focus:ring-emerald-500/50"
                      )}
                      placeholder="5.0"
                    />
                    <Zap className={clsx("absolute right-4 top-3.5 h-5 w-5 transition-colors", isInsufficient ? "text-rose-400" : "text-gray-500")} />
                  </div>
                  {isInsufficient && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-400 text-[11px] mt-2 font-medium flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Insufficient energy. Your available battery storage is {availableStorage.toFixed(1)} kWh.
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Price per kWh (cR)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-semibold"
                      placeholder="0.12"
                    />
                    <DollarSign className="absolute right-4 top-3.5 h-5 w-5 text-gray-500" />
                  </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-sm text-emerald-300">
                  <div className="flex justify-between mb-1">
                    <span>Potential Earnings:</span>
                    <span className="font-bold">{(parseFloat(amount || "0") * parseFloat(price || "0")).toFixed(2)} cR</span>
                  </div>
                  <p className="text-[10px] text-emerald-500/60 uppercase tracking-wider">Estimated after 1% platform fee</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isInsufficient || isLoadingTelemetry}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Listing...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
