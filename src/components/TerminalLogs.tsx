import React, { useEffect, useRef } from 'react';
import { TerminalLog } from '../types';
import { Terminal, Shield, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface TerminalLogsProps {
  logs: TerminalLog[];
  onClear: () => void;
}

export default function TerminalLogs({ logs, onClear }: TerminalLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogTypeMarkup = (type: TerminalLog['type']) => {
    switch (type) {
      case 'success':
        return {
          label: 'OK',
          color: 'text-emerald-400 font-bold',
          icon: <Sparkles size={12} className="text-emerald-400" />
        };
      case 'warn':
        return {
          label: 'WRN',
          color: 'text-amber-400 font-bold',
          icon: <AlertCircle size={12} className="text-amber-400" />
        };
      case 'error':
        return {
          label: 'ERR',
          color: 'text-red-400 font-bold animate-pulse',
          icon: <AlertCircle size={12} className="text-red-400" />
        };
      case 'security':
        return {
          label: 'SEC',
          color: 'text-violet-400 font-bold',
          icon: <Shield size={12} className="text-violet-400" />
        };
      default:
        return {
          label: 'SYS',
          color: 'text-cyan-400 font-bold',
          icon: <Terminal size={12} className="text-cyan-400" />
        };
    }
  };

  return (
    <div id="terminal-logs-panel" className="bg-black/95 border border-zinc-850 rounded-lg shadow-2xl p-4 font-mono text-xs text-zinc-300 relative overflow-hidden backdrop-blur-md">
      {/* Glow Header Accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      {/* Terminal Title Bar */}
      <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest pl-2">TELEMETRY STREAM // api_tracker_daemon</span>
        </div>
        <button 
          id="clear-logs-btn"
          onClick={onClear}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 border border-zinc-900 bg-zinc-950 px-2 py-0.5 rounded cursor-pointer"
        >
          <RefreshCw size={10} />
          CLEAR_STREAM
        </button>
      </div>

      {/* Screen CRT Scanlines Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] opacity-40 z-10" />

      {/* Logs Scroll Window */}
      <div 
        ref={containerRef}
        className="h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent space-y-1.5 pr-2 font-mono scroll-smooth text-[11px]"
      >
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic flex items-center justify-center h-full gap-2">
            <Terminal size={14} className="text-zinc-700" />
            Awaiting session input... Streams initialized.
          </div>
        ) : (
          logs.map((log) => {
            const markup = getLogTypeMarkup(log.type);
            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-zinc-950/80 p-0.5 rounded transition-all duration-150">
                <span className="text-zinc-600 select-none font-light">[{log.timestamp}]</span>
                <span className={`inline-flex items-center gap-1 px-1 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-[9px] ${markup.color} min-w-[42px] justify-center`}>
                  {markup.icon}
                  {markup.label}
                </span>
                <span className="text-zinc-300 break-all select-all font-light leading-relaxed">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
