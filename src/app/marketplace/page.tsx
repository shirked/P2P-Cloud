"use client";

import { useState } from "react";
import { fetchAvailableUnits } from "@/lib/api";
import { Transaction } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Zap, Plus, Search, Filter, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "@/components/auth/AuthContext";
import ListEnergyModal from "@/components/ui/ListEnergyModal";
import PurchaseModal from "@/components/ui/PurchaseModal";
export default function Marketplace() {
  const { userId, isAuthenticated } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Transaction | null>(null);

  const { data: units = [], isLoading, isError } = useQuery({
    queryKey: ['marketplace', userId],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || "";
      if (!token) throw new Error("No authentication token available");
      return fetchAvailableUnits(token);
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">P2P Marketplace</h1>
          <p className="text-gray-400">Trade energy units securely with community peers.</p>
        </div>
        <button 
          onClick={() => setIsListModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          List Energy
        </button>
      </div>

      <div className="glass-card mb-8 p-2 rounded-2xl flex items-center border border-[rgba(255,255,255,0.05)]">
        <div className="flex-1 flex items-center pl-4 pr-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by seller ID..." 
            className="w-full bg-transparent border-none outline-none text-white px-4 py-2 placeholder-gray-500"
          />
        </div>
        <div className="w-px h-8 bg-[rgba(255,255,255,0.1)] mx-2" />
        <button className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {isError && (
        <div className="glass-card p-6 rounded-2xl border border-rose-500/20 flex flex-col items-center justify-center py-12 text-rose-400 mb-6">
          <AlertTriangle className="h-8 w-8 mb-3" />
          <p className="font-medium">Connectivity Error</p>
          <p className="text-sm opacity-60">Unable to retrieve live marketplace units from AWS.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.05)] animate-pulse h-[200px]" />
        ))}

        {!isLoading && !isError && units.map((unit, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={unit.id} 
            className="glass-card rounded-2xl p-6 border border-[rgba(255,255,255,0.05)] hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {unit.status}
              </span>
              <span className="text-xs text-gray-500 font-mono">{unit.id}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-white">{unit.amount.toFixed(1)}</span>
              <span className="text-emerald-400 font-medium">kWh</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 font-medium">Listed by <span className="text-white hover:text-emerald-400 transition-colors cursor-pointer">{unit.sellerId}</span></p>
            
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-xs text-gray-500">Price per unit</p>
                <p className="text-lg font-semibold text-white">{unit.price} <span className="text-xs text-gray-400">cR</span></p>
              </div>
              <button 
                onClick={() => setSelectedUnit(unit)}
                className="bg-[rgba(255,255,255,0.05)] group-hover:bg-emerald-500 group-hover:text-white text-gray-300 px-5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
              >
                Purchase
              </button>
            </div>
          </motion.div>
        ))}

        {!isLoading && !isError && units.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 text-center text-gray-400">
            <Zap className="h-12 w-12 text-[rgba(255,255,255,0.1)] mx-auto mb-4" />
            <p>No active marketplace listings.</p>
          </div>
        )}
      </div>

      {/* Interactions */}
      <ListEnergyModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} />
      <PurchaseModal isOpen={selectedUnit !== null} onClose={() => setSelectedUnit(null)} unit={selectedUnit} />

    </div>
  );
}
