"use client";

import { Transaction } from "@/types";
import { useAuth } from "@/components/auth/AuthContext";
import { useLedger } from "@/hooks/useLedger";
import { ArrowDownLeft, ArrowUpRight, ArrowDownToLine, ArrowUpFromLine, Loader2, Database } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Ledger() {
  const { isAuthenticated } = useAuth();

  const { data: txs = [], isLoading } = useLedger();

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return <ArrowDownLeft className="h-4 w-4 text-emerald-400" />;
      case 'sell': return <ArrowUpRight className="h-4 w-4 text-cyan-400" />;
      case 'deposit': return <ArrowDownToLine className="h-4 w-4 text-emerald-400" />;
      case 'withdraw': return <ArrowUpFromLine className="h-4 w-4 text-rose-400" />;
    }
  };

  // Calculate Running Balance for the footer
  const totalBalance = txs.reduce((acc, tx) => {
    const change = (tx.type === 'buy' || tx.type === 'deposit') ? tx.amount : -tx.amount;
    return acc + change;
  }, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Energy Activity Log</h1>
          <p className="text-gray-400">Detailed record of storage handshakes and marketplace transactions.</p>
        </div>
        
        {!isLoading && txs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-4"
          >
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Database className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold">Ledger Balance</p>
              <p className="text-2xl font-bold text-white leading-none">{totalBalance.toFixed(1)} <span className="text-xs text-emerald-400 font-normal">kWh</span></p>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(0,0,0,0.2)] border-b border-[rgba(255,255,255,0.05)] text-sm font-medium text-gray-400">
                <th className="py-5 px-6 font-semibold uppercase tracking-wider">Date</th>
                <th className="py-5 px-6 font-semibold uppercase tracking-wider">Activity</th>
                <th className="py-5 px-6 font-semibold uppercase tracking-wider">Reference</th>
                <th className="py-5 px-6 font-semibold uppercase tracking-wider text-right">Change</th>
                <th className="py-5 px-6 font-semibold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx, i) => {
                const isPositive = tx.type === 'buy' || tx.type === 'deposit';
                return (
                  <tr key={tx.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                    <td className="py-5 px-6 whitespace-nowrap text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {tx.date}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          "p-2 rounded-lg transition-colors",
                          isPositive ? "bg-emerald-500/10" : "bg-rose-500/10"
                        )}>
                          {getIcon(tx.type)}
                        </div>
                        <span className="text-sm font-bold text-white">{tx.activity}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs text-gray-500 group-hover:text-cyan-400/70 transition-colors">
                        {tx.id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className={clsx(
                      "py-5 px-6 whitespace-nowrap text-right font-bold transition-all",
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {isPositive ? "+" : "-"}{tx.amount.toFixed(1)} <span className="text-[10px] opacity-40 font-normal">kWh</span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap text-center">
                      <span className={clsx(
                        "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest",
                        (tx.status === "Settled" || tx.status === "Completed" || tx.status.toUpperCase() === "COMPLETED") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                      )}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {isLoading && (
                 <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin opacity-40" />
                        <p className="text-gray-500 text-sm font-medium tracking-wide">Querying Encrypted Ledger...</p>
                      </div>
                    </td>
                 </tr>
              )}
              {!isLoading && !txs.length && (
                 <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="max-w-xs mx-auto">
                        <Database className="h-12 w-12 text-gray-700 mx-auto mb-4 opacity-20" />
                        <h4 className="text-gray-400 font-bold mb-2">No storage activity recorded yet.</h4>
                        <p className="text-sm text-gray-600">Start generating or buying energy to see your ledger move.</p>
                      </div>
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
