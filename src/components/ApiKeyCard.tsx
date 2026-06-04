import React, { useState } from 'react';
import { ApiKeyItem, PROVIDERS, KeyStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  X, 
  Coins,
  FileText,
  Calendar,
  Layers,
  Zap,
  PowerOff,
  Skull
} from 'lucide-react';

interface ApiKeyCardProps {
  item: ApiKeyItem;
  onStatusChange: (id: string, status: KeyStatus) => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: ApiKeyItem) => void;
  onTriggerLog: (type: 'info' | 'success' | 'warn' | 'error' | 'security', message: string) => void;
}

const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ 
  item, 
  onStatusChange, 
  onDelete, 
  onUpdate,
  onTriggerLog 
}) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form Fields State
  const [editLabel, setEditLabel] = useState(item.label);
  const [editNotes, setEditNotes] = useState(item.notes || '');
  const [editLimit, setEditLimit] = useState(item.limitAmount?.toString() || '');
  const [editUsed, setEditUsed] = useState(item.usedAmount?.toString() || '');

  const providerInfo = PROVIDERS[item.provider];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.apiKey);
      setCopied(true);
      onTriggerLog('security', `Kunci API disalin langsung // Label: "${item.label}" [${providerInfo.name}].`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onTriggerLog('error', 'Gagal menyalin token. Keamanan browser memblokir operasi.');
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 14) return '••••••••••••';
    const start = key.slice(0, 8);
    const end = key.slice(-6);
    return `${start}••••••••••••${end}`;
  };

  const handleSaveEdit = () => {
    const limitNum = editLimit.trim() === '' ? undefined : parseFloat(editLimit);
    const usedNum = editUsed.trim() === '' ? undefined : parseFloat(editUsed);

    const updatedItem: ApiKeyItem = {
      ...item,
      label: editLabel.trim() || item.label,
      notes: editNotes.trim(),
      limitAmount: isNaN(limitNum || 0) ? undefined : limitNum,
      usedAmount: isNaN(usedNum || 0) ? undefined : usedNum,
    };

    // Auto-exhaust check
    if (updatedItem.limitAmount !== undefined && updatedItem.usedAmount !== undefined) {
      if (updatedItem.usedAmount >= updatedItem.limitAmount && updatedItem.status === 'active') {
        updatedItem.status = 'exhausted';
        onTriggerLog('warn', `Sistem mendeteksi limit tercapai untuk "${updatedItem.label}". Status disetel otomatis ke EXHAUSTED.`);
      }
    }

    onUpdate(updatedItem);
    setIsEditing(false);
    onTriggerLog('success', `Node metadata untuk "${updatedItem.label}" berhasil diaplikasikan.`);
  };

  const percentUsed = item.limitAmount && item.limitAmount > 0 
    ? Math.min(100, Math.round(((item.usedAmount || 0) / item.limitAmount) * 100))
    : 0;

  return (
    <>
      <tr 
        id={`key-row-${item.id}`}
        className={`border-b border-zinc-900 bg-zinc-950/60 hover:bg-zinc-950/90 transition-colors duration-200 text-xs font-mono`}
      >
        
        {/* COL 1: STATUS SWITCHER ("bisa digeser .di off kan/kuota habis") */}
        <td className="p-3 align-middle">
          <div className="flex items-center gap-1 bg-black/90 border border-zinc-900 rounded p-1 max-w-[270px]">
            
            {/* Active Switch button */}
            <button
              onClick={() => onStatusChange(item.id, 'active')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                item.status === 'active' 
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-bold' 
                  : 'text-zinc-650 hover:text-zinc-400'
              }`}
              title="Aktifkan kunci ini"
            >
              <Zap size={10} className={item.status === 'active' ? "animate-pulse" : ""} />
              ON
            </button>

            {/* Standby/Off Switch button */}
            <button
              onClick={() => onStatusChange(item.id, 'inactive')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                item.status === 'inactive' 
                  ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30' 
                  : 'text-zinc-650 hover:text-zinc-400'
              }`}
              title="Matikan sementara (STANDBY)"
            >
              <PowerOff size={10} />
              OFF
            </button>

            {/* Exhausted Switch button */}
            <button
              onClick={() => onStatusChange(item.id, 'exhausted')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                item.status === 'exhausted' 
                  ? 'bg-red-950/40 text-red-500 border border-red-500/30' 
                  : 'text-zinc-650 hover:text-zinc-450'
              }`}
              title="Tandai kuota telah habis (EXHAUSTED)"
            >
              <Skull size={10} />
              HABIS
            </button>

          </div>
        </td>

        {/* COL 2: PROVIDER NAME & TYPE CAT */}
        <td className="p-3 align-middle min-w-[140px]">
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] inline-block font-bold uppercase ${providerInfo.colorClass}`}>
              {item.provider === 'custom' ? item.customProviderName || 'CUSTOM' : providerInfo.name}
            </span>
            <div className="flex gap-1.5 items-center">
              <span className={`text-[8.5px] font-semibold tracking-wider font-mono uppercase px-1.5 py-0.2 rounded-full border ${
                item.type === 'paid' 
                  ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' 
                  : item.type === 'free' 
                    ? 'bg-purple-950/40 text-purple-400 border-purple-500/20' 
                    : 'bg-stone-800 text-stone-400 border-zinc-700'
              }`}>
                {item.type}
              </span>
            </div>
          </div>
        </td>

        {/* COL 3: LABEL ALIAS & NOTES */}
        <td className="p-3 align-middle max-w-[200px]">
          <div className="space-y-0.5">
            <span className="font-ubuntu text-zinc-100 font-bold block max-w-[180px] truncate" title={item.label}>
              {item.label}
            </span>
            {item.notes ? (
              <span className="text-[10px] text-zinc-650 flex items-center gap-1 italic max-w-[170px] truncate" title={item.notes}>
                <FileText size={10} /> {item.notes}
              </span>
            ) : (
              <span className="text-[9px] text-zinc-700 italic select-none block">tanpa catatan</span>
            )}
          </div>
        </td>

        {/* COL 4: SECRET REVEAL & COPY TICKET ("mudah copasnya") */}
        <td className="p-3 align-middle min-w-[280px]">
          <div className="flex items-center gap-1.5 bg-black/50 border border-zinc-900 rounded p-1.5 max-w-[320px] shadow-inner">
            <span className="font-mono text-[11px] text-[#60f38b] tracking-wide select-all truncate max-w-[210px]" title={item.apiKey}>
              {revealed ? item.apiKey : maskKey(item.apiKey)}
            </span>

            <div className="flex items-center gap-1 ml-auto shrink-0 border-l border-zinc-900 pl-1.5">
              {/* Reveal Switch Button */}
              <button
                onClick={() => setRevealed(!revealed)}
                className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors hover:bg-zinc-90 w-6 h-6 flex items-center justify-center rounded cursor-pointer"
                title={revealed ? "Mask secret" : "Reveal API Key token"}
              >
                {revealed ? <EyeOff size={11} /> : <Eye size={11} />}
              </button>

              {/* Direct Copy Switch Button (Main Requirement) */}
              <button
                onClick={handleCopy}
                className={`px-2 py-1 rounded text-[10px] font-bold font-mono border transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  copied 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
                    : 'bg-[#51ff00]/10 text-[#51ff00] hover:bg-[#51ff00]/20 border-[#51ff00]/30 animate-pulse'
                }`}
                title="Salin langsung kunci ke clipboard"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>
        </td>

        {/* COL 5: QUOTA / LIMIT PROGRESS */}
        <td className="p-3 align-middle min-w-[150px]">
          {item.limitAmount !== undefined && item.limitAmount > 0 ? (
            <div className="space-y-1 max-w-[140px]">
              <div className="flex justify-between text-[9.5px]">
                <span className="text-zinc-500 font-bold uppercase">QUOTA</span>
                <span className="text-zinc-300">
                  {item.currency}{item.usedAmount?.toFixed(1)}/{item.currency}{item.limitAmount.toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-zinc-900/90 h-1.5 rounded-full overflow-hidden relative border border-zinc-950">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentUsed > 80 
                      ? 'bg-red-500' 
                      : percentUsed > 40 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
              <span className="text-[8px] text-zinc-600 text-right block uppercase">
                {percentUsed}% CONSUMED
              </span>
            </div>
          ) : (
            <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono select-none block">
              UNLIMITED_KEY
            </span>
          )}
        </td>

        {/* COL 6: ACTIONS */}
        <td className="p-3 align-middle text-right shrink-0">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 hover:bg-zinc-900 rounded font-mono transition-colors text-zinc-600 cursor-pointer ${
                isEditing ? 'text-cyan-400 bg-zinc-900/50' : 'hover:text-cyan-400'
              }`}
              title="Edit parameters"
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
              title="Hapus permanen dari tracker"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </td>

      </tr>

      {/* Editing line replacement inline collapsible row */}
      {isEditing && (
        <tr className="bg-zinc-950/90 border-b border-zinc-900">
          <td colSpan={6} className="p-4">
            <div className="bg-black/40 border border-zinc-900/80 rounded-md p-4 space-y-3 font-mono text-xs max-w-4xl mx-auto shadow-inner relative">
              <div className="absolute top-0 right-0 py-1 px-2.5 bg-cyan-950/40 text-cyan-400 border-l border-b border-zinc-900 text-[9px] uppercase tracking-wider font-bold">
                EDIT_INTERFACE
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Edit Label Name Columnally */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1 font-bold">Label / Alias Kunci</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Limit Setup */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1 font-bold">Batas Saldo ({item.currency || '$'})</label>
                  <input
                    type="number"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Used budget metrics */}
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1 font-bold">Saldo Terpakai ({item.currency || '$'})</label>
                  <input
                    type="number"
                    value={editUsed}
                    onChange={(e) => setEditUsed(e.target.value)}
                    placeholder="e.g. 43"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase mb-1 font-bold">Catatan Deployment / Server</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 outline-none focus:border-cyan-500 resize-none text-[11px]"
                  placeholder="Kunci ini terpasang di..."
                  rows={2}
                />
              </div>

              {/* Action trigger commit */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900/60">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-zinc-950 font-bold border border-zinc-900 text-zinc-550 rounded hover:bg-zinc-900 text-[10px] cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 rounded hover:bg-cyan-900 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <CheckSquare size={12} />
                  COMMIT_MUTATION
                </button>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ApiKeyCard;
