"use client";

import { fetchUserLedger } from "@/lib/api";
import { Transaction } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";
import { ArrowDownLeft, ArrowUpRight, ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Ledger() {
  const { userId, isAuthenticated } = useAuth();

  const { data: txs = [], isLoading } = useQuery({
    queryKey: ['ledger', userId],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() || "";
      return fetchUserLedger(token);
    },
    enabled: isAuthenticated,
  });

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return <ArrowDownLeft className="h-4 w-4 text-emerald-400" />;
      case 'sell': return <ArrowUpRight className="h-4 w-4 text-cyan-400" />;
      case 'deposit': return <ArrowDownToLine className="h-4 w-4 text-amber-400" />;
      case 'withdraw': return <ArrowUpFromLine className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction Ledger</h1>
        <p className="text-gray-400">History of all platform interactions stored on DynamoDB.</p>
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
                <th className="py-4 px-6 font-medium">Transaction ID</th>
                <th className="py-4 px-6 font-medium">Type</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Total Cost</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((tx, i) => (
                <tr key={tx.id} className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-300">{tx.id}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2 capitalize text-sm font-medium text-white">
                      <div className="p-1.5 rounded-full bg-[rgba(255,255,255,0.05)]">
                        {getIcon(tx.type)}
                      </div>
                      {tx.type}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-white font-medium">
                    {tx.amount.toFixed(1)} <span className="text-xs text-gray-500 font-normal">kWh</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-white">
                    {(tx.amount * tx.price).toFixed(2)} <span className="text-xs text-gray-500">cR</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-400">
                    {tx.date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={clsx(
                      "px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider",
                      (tx.status === "Settled" || tx.status === "Completed" || tx.status.toUpperCase() === "COMPLETED") && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                      (tx.status === "Pending" || tx.status.toUpperCase() === "PENDING") && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                      tx.status === "Available" && "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
                    )}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {isLoading && (
                 <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin opacity-50" />
                        <p className="text-gray-500 text-sm">Syncing with DynamoDB...</p>
                      </div>
                    </td>
                 </tr>
              )}
              {!isLoading && !txs.length && (
                 <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-500">
                      No transaction history found.
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
