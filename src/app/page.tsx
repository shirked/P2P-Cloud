"use client";

import { fetchEnergyTelemetry } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Zap, BatteryCharging, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['telemetry'],
    queryFn: fetchEnergyTelemetry,
  });

  if (isError) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-rose-400">
        <AlertTriangle className="h-12 w-12 mb-4 animate-pulse opacity-50" />
        <p className="text-lg font-medium">Failed to connect to AWS backend.</p>
        <p className="text-sm opacity-60">Check your Lambda Function URL and network connection.</p>
      </div>
    );
  }

  const currentGen = data ? data[data.length - 1].generated : 0;
  const currentCons = data ? data[data.length - 1].consumed : 0;
  const net = currentGen - currentCons;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Energy Dashboard</h1>
        <p className="text-gray-400">Real-time monitoring of your node's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Generated", val: currentGen.toFixed(1), unit: "kWh", icon: Zap, color: "text-emerald-400", bg: "bg-[rgba(16,185,129,0.1)]", trend: "+12%" },
          { title: "Consumed", val: currentCons.toFixed(1), unit: "kWh", icon: BatteryCharging, color: "text-amber-400", bg: "bg-[rgba(245,158,11,0.1)]", trend: "-2%" },
          { title: "Net Export", val: net.toFixed(1), unit: "kWh", icon: net >= 0 ? ArrowUpRight : ArrowDownRight, color: net >= 0 ? "text-cyan-400" : "text-rose-400", bg: net >= 0 ? "bg-[rgba(6,182,212,0.1)]" : "bg-[rgba(244,63,94,0.1)]", trend: "+5%" }
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
              {isLoading ? (
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
        className="glass-card rounded-2xl p-6 h-[400px] border border-[rgba(255,255,255,0.05)]"
      >
        <h3 className="text-lg font-bold text-white mb-6">Energy Flow </h3>
        {isLoading ? (
          <div className="w-full h-full bg-white/5 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="generated" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGen)" />
              <Area type="monotone" dataKey="consumed" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCons)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
