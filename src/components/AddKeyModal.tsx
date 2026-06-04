import React, { useState } from 'react';
import { ApiKeyItem, PROVIDERS, ApiProvider, KeyType } from '../types';
import { X, Server, Key, AlertCircle, HelpCircle, HardDriveDownload } from 'lucide-react';

interface AddKeyModalProps {
  onClose: () => void;
  onAddKey: (item: Omit<ApiKeyItem, 'id' | 'addedAt'>) => void;
  onTriggerLog: (type: 'info' | 'success' | 'warn' | 'error' | 'security', message: string) => void;
}

export default function AddKeyModal({ onClose, onAddKey, onTriggerLog }: AddKeyModalProps) {
  const [provider, setProvider] = useState<ApiProvider>('openai');
  const [customProviderName, setCustomProviderName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<KeyType>('free');
  const [notes, setNotes] = useState('');
  
  // Quota
  const [limitAmount, setLimitAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const selectedProviderInfo = PROVIDERS[provider];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      onTriggerLog('error', 'Pemasangan kunci API dibatalkan: Kolom kunci API tidak boleh kosong!');
      return;
    }

    if (!label.trim()) {
      onTriggerLog('error', 'Pemasangan kunci API dibatalkan: Kolom Label/Alias wajib diisi.');
      return;
    }

    const limitNum = limitAmount.trim() === '' ? undefined : parseFloat(limitAmount);

    onAddKey({
      provider,
      customProviderName: provider === 'custom' ? customProviderName.trim() : undefined,
      apiKey: apiKey.trim(),
      label: label.trim(),
      type,
      status: 'active', // default to active status when mounted
      notes: notes.trim() || undefined,
      limitAmount: isNaN(limitNum || 0) ? undefined : limitNum,
      usedAmount: limitNum !== undefined ? 0 : undefined,
      currency
    });

    onClose();
  };

  return (
    <div id="mount-key-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
        {/* Glow Line Indicator */}
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#51ff00]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors p-1"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4 font-mono">
          <Server size={18} className="text-[#51ff00]" />
          <h2 className="text-zinc-100 font-bold text-sm uppercase tracking-widest">
            MOUNT_NEW_API_NODE // PENELUSUR
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          
          {/* Provider Select */}
          <div>
            <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
              1. PROVIDER SERVIS
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value as ApiProvider);
                onTriggerLog('info', `Mengubah fokus draft provider ke: ${e.target.value.toUpperCase()}`);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-200 outline-none focus:border-[#51ff00] font-mono"
            >
              {Object.values(PROVIDERS).map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-950 text-zinc-300">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Provider Name (Conditional) */}
          {provider === 'custom' && (
            <div className="animate-none">
              <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1 font-bold">
                NAMA PROVIDER KHUSUS
              </label>
              <input
                type="text"
                value={customProviderName}
                onChange={(e) => setCustomProviderName(e.target.value)}
                placeholder="misal: Ollama / Local API / DeepL"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 outline-none focus:border-[#51ff00]"
                required
              />
            </div>
          )}

          {/* Label / Name */}
          <div>
            <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1 font-bold">
              2. ALIAS / NAMA LABEL PELACAK
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="misal: Bot WhatsApp Pro / DeepResearch testing / Backup"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-100 outline-none focus:border-[#51ff00]"
              required
            />
            <span className="text-[10px] text-zinc-650 italic mt-1 block">Help: Nama pengenal agar mudah ditracking letak deploy-nya</span>
          </div>

          {/* Key type (Free / Paid / Trial) */}
          <div>
            <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
              3. TIPE AKUN / KATEGORI
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['free', 'paid', 'trial'] as const).map((t) => (
                <label 
                  key={t}
                  className={`border p-2 rounded text-center cursor-pointer transition-all ${
                    type === t 
                      ? 'bg-zinc-900 border-cyan-500 text-cyan-400 font-bold' 
                      : 'border-zinc-850 hover:border-zinc-800 bg-transparent text-zinc-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="keyType"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="sr-only"
                  />
                  {t.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Secret API Key Input */}
          <div>
            <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1 font-bold flex justify-between">
              <span>4. PASTE API KEY TOKEN</span>
              {selectedProviderInfo.keyFormatHint && (
                <span className="text-[9px] text-zinc-600 italic">Format: {selectedProviderInfo.keyFormatHint}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste token rahasia di sini..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-emerald-400 outline-none focus:border-[#51ff00] pr-10 font-mono text-xs"
                required
              />
              <Key size={14} className="absolute right-3 top-2.5 text-zinc-650" />
            </div>
          </div>

          {/* Optional Initial Quota Setup */}
          <div className="bg-zinc-950 p-2.5 border border-zinc-900/80 rounded">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold mb-2">
              <HelpCircle size={12} className="text-zinc-500" />
              <span>LOGISTIK KUOTA (OPSIONAL)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">MATA UANG</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 font-mono text-[11px]"
                >
                  <option value="USD">USD ($)</option>
                  <option value="IDR">IDR (Rp)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">BATAS SALDO / LIMIT</label>
                <input
                  type="number"
                  step="any"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Deployment Notes */}
          <div>
            <label className="block text-zinc-500 uppercase tracking-wider text-[10px] mb-1 font-bold">
              CATATAN DEPLOYMENT / INFRA
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan instruksi (misal: 'Dipakai di server VPS 03, jatah tim frontend')"
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-zinc-300 outline-none focus:border-[#51ff00] text-[11px] resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[11px] bg-zinc-950 font-bold border border-zinc-900 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              CLOSE
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[11px] bg-[#51ff00]/10 text-[#51ff00] font-bold border border-[#51ff00]/30 hover:bg-[#51ff00]/20 rounded transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <HardDriveDownload size={13} />
              MOUNT_SECRET_NODE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
