import React from 'react';
import { ApiKeyItem } from '../types';
import { ShieldAlert, Zap, PowerOff, Database } from 'lucide-react';

interface KeyStatsProps {
  keys: ApiKeyItem[];
}

export default function KeyStats({ keys }: KeyStatsProps) {
  const total = keys.length;
  const activeCount = keys.filter(k => k.status === 'active').length;
  const inactiveCount = keys.filter(k => k.status === 'inactive').length;
  const exhaustedCount = keys.filter(k => k.status === 'exhausted').length;

  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;
  const inactivePercent = total > 0 ? Math.round((inactiveCount / total) * 100) : 0;
  const exhaustedPercent = total > 0 ? Math.round((exhaustedCount / total) * 100) : 0;

  // Calculate crude estimate of total used quota vs limit
  let spentTotal = 0;
  let limitTotal = 0;
  keys.forEach(k => {
    if (k.limitAmount) limitTotal += k.limitAmount;
    if (k.usedAmount) spentTotal += k.usedAmount;
  });

  const currencySymbol = '$';

  return (
    <div id="quick-telemetry-dashboard" className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Total Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">TOTAL_KEYS_MOUNTED</span>
          <Database size={14} className="text-zinc-650" />
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-bold font-mono text-zinc-100 tracking-tight">{total}</span>
          <span className="text-[10px] font-mono text-zinc-500">records</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div className="bg-zinc-600 h-full rounded-full" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Active Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/5 blur-lg rounded-full group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase">SYS_ACTIVE_ONLINE</span>
          <Zap size={14} className="text-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.1)]">{activeCount}</span>
          <span className="text-[10px] font-mono text-emerald-600">{activePercent}% load</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${activePercent}%` }} />
        </div>
      </div>

      {/* Inactive Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/5 blur-lg rounded-full group-hover:bg-amber-500/10 transition-all" />
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase">SYS_PAUSED_OFFLINE</span>
          <PowerOff size={14} className="text-amber-400" />
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight">{inactiveCount}</span>
          <span className="text-[10px] font-mono text-amber-600">{inactivePercent}% sleep</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${inactivePercent}%` }} />
        </div>
      </div>

      {/* Exhausted Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-red-500/5 blur-lg rounded-full group-hover:bg-red-500/10 transition-all" />
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase">QUOTA_HABIS_DEAD</span>
          <ShieldAlert size={14} className="text-red-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-2xl font-bold font-mono text-red-400 tracking-tight drop-shadow-[0_0_8px_rgba(248,113,113,0.1)]">{exhaustedCount}</span>
          <span className="text-[10px] font-mono text-red-600">{exhaustedPercent}% core</span>
        </div>
        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3">
          <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${exhaustedPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
