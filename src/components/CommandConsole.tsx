import React, { useState } from 'react';
import { Terminal, CornerDownLeft, Info } from 'lucide-react';

interface CommandConsoleProps {
  onExecuteCommand: (cmd: string) => void;
  commandSuggestions: string[];
}

export default function CommandConsole({ onExecuteCommand, commandSuggestions }: CommandConsoleProps) {
  const [inputValue, setInputValue] = useState('');
  const [showCommandsHint, setShowCommandsHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    onExecuteCommand(command);
    setInputValue('');
  };

  const handleSuggestionClick = (suggested: string) => {
    setInputValue(suggested);
  };

  return (
    <div id="terminal-interface-console" className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 font-mono text-xs text-zinc-300 relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[#51ff00]">
          <span>root@nexus_tracer</span>
          <span className="text-zinc-500">:</span>
          <span className="text-cyan-400">~</span>
          <span className="font-bold animate-pulse">#</span>
        </div>
        
        <input
          id="terminal-prompt-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type command (e.g. /help, /add, /clear, /exhausted [Label])...'
          className="flex-1 bg-transparent border-none outline-none text-emerald-400 placeholder-zinc-700 font-mono text-xs py-1"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCommandsHint(!showCommandsHint)}
            className="text-zinc-600 hover:text-cyan-400 transition-colors p-1"
            title="Show commands guide"
          >
            <Info size={14} />
          </button>
          <button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded border border-zinc-850 flex items-center gap-1 cursor-pointer"
          >
            <span className="text-[9px]">EXEC</span>
            <CornerDownLeft size={10} />
          </button>
        </div>
      </form>

      {/* Suggestion Quick Chips */}
      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-900/60 items-center">
        <span className="text-[10px] text-zinc-600 font-semibold tracking-wider uppercase select-none">Quick:</span>
        {commandSuggestions.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleSuggestionClick(cmd)}
            className="text-[10px] text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded transition-all duration-150 cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Guide Help Panel */}
      {showCommandsHint && (
        <div className="mt-3 bg-black/90 p-3 rounded border border-cyan-500/20 text-zinc-400 text-[11px] leading-relaxed animate-none">
          <h4 className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
            <Terminal size={12} />
            Nexus_Tracer Terminal Guide
          </h4>
          <p className="mb-2 text-zinc-500">Anda dapat mengetik perintah langsung di terminal untuk mengoperasikan pelacak cepat:</p>
          <ul className="space-y-1">
            <li><span className="text-emerald-400 font-bold">/help</span> - Tampilkan instruksi lengkap</li>
            <li><span className="text-emerald-400 font-bold">/add</span> - Tampilkan formulir tambah kunci API</li>
            <li><span className="text-emerald-400 font-bold">/clear</span> - Bersihkan riwayat log stream</li>
            <li><span className="text-emerald-400 font-bold">/active [label]</span> - Aktifkan instan kunci API berdasarkan label</li>
            <li><span className="text-emerald-400 font-bold">/off [label]</span> - Matikan instan kunci API berdasarkan label</li>
            <li><span className="text-emerald-400 font-bold">/exhausted [label]</span> - Setel kuota habis (kuota_habis) berdasarkan label</li>
          </ul>
        </div>
      )}
    </div>
  );
}
