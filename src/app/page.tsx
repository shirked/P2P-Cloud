"use client";

import { Zap, BatteryCharging, ArrowUpRight, ArrowDownRight, AlertTriangle, Database, Leaf, TreePine, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useLedger } from "@/hooks/useLedger";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function Dashboard() {
  const { data, isLoading, isError } = useTelemetry();
  const { data: ledger = [], isLoading: isLoadingLedger } = useLedger();

  if (isError) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-rose-400">
        <AlertTriangle className="h-12 w-12 mb-4 animate-pulse opacity-50" />
        <p className="text-lg font-medium">Failed to connect to AWS backend.</p>
        <p className="text-sm opacity-60">Check your Lambda Function URL and network connection.</p>
      </div>
    );
  }

  // Handle single-object telemetry with optional chaining
  const currentGen = data?.generated?.value ?? 0;
  const currentCons = data?.consumed?.value ?? 0;
  const currentStorage = data?.totalStorage?.value ?? 0;
  const net = currentGen - currentCons;

  // Calculate Total Energy from Ledger (Cumulative Storage)
  const totalEnergy = ledger.reduce((acc, tx) => acc + (tx.amount || 0), 0);

  // Extract impact variables
  const co2Saved = data?.impact?.co2Saved || "0.00 kg";
  const treesEq = data?.impact?.treesEquivalent ?? 0;
  const gridIndep = data?.impact?.gridIndependence ?? 0;

  // Grid Independence SVG setup
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (gridIndep / 100) * circumference;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Energy Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring of your node's performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Generated", val: currentGen.toFixed(1), unit: "kWh", icon: Zap, color: "text-emerald-400", bg: "bg-[rgba(16,185,129,0.1)]", trend: "+12%" },
          { title: "Consumed", val: currentCons.toFixed(1), unit: "kWh", icon: BatteryCharging, color: "text-amber-400", bg: "bg-[rgba(245,158,11,0.1)]", trend: "-2%" },
          { title: "Net Export", val: net.toFixed(1), unit: "kWh", icon: net >= 0 ? ArrowUpRight : ArrowDownRight, color: net >= 0 ? "text-cyan-400" : "text-rose-400", bg: net >= 0 ? "bg-[rgba(6,182,212,0.1)]" : "bg-[rgba(244,63,94,0.1)]", trend: "+5%" },
          { title: "Total Storage", val: currentStorage.toFixed(1), unit: "kWh", icon: Database, color: "text-indigo-400", bg: "bg-[rgba(129,140,248,0.1)]", trend: "Live Balance" }
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="glass-card rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              {isLoading || isLoadingLedger ? (
                <div className="h-8 bg-white/10 rounded animate-pulse w-24 mt-2" />
              ) : (
                <div className="text-3xl font-bold text-white tracking-tight">
                  {stat.val} <span className="text-lg text-gray-500 font-normal">{stat.unit}</span>
                </div>
              )}
            </div>

            <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-20 ${stat.bg.replace('0.1', '1')}`} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">Sustainability Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carbon Offset Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Leaf className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-gray-400 font-medium">Carbon Offset</h4>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {co2Saved}
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500 blur-3xl opacity-10" />
          </div>

          {/* Forest Contribution Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <TreePine className="h-6 w-6 text-emerald-400" />
              </div>
              <h4 className="text-gray-400 font-medium">Trees Equivalent Saved</h4>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">
              {treesEq}
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500 blur-3xl opacity-10" />
          </div>

          {/* Grid Autonomy Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Activity className="h-6 w-6 text-emerald-400" />
                </div>
                <h4 className="text-gray-400 font-medium">Grid Autonomy</h4>
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">
                {gridIndep}%
              </div>
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500 blur-3xl opacity-10" />
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
