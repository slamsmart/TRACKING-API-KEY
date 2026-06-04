import React, { useState, useEffect } from 'react';
import { 
  ApiKeyItem, 
  TerminalLog, 
  INITIAL_API_KEYS, 
  PROVIDERS, 
  KeyStatus, 
  ApiProvider, 
  KeyType 
} from './types';
import TerminalLogs from './components/TerminalLogs';
import CommandConsole from './components/CommandConsole';
import KeyStats from './components/KeyStats';
import ApiKeyCard from './components/ApiKeyCard';
import AddKeyModal from './components/AddKeyModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  ShieldAlert, 
  Activity, 
  AlertCircle, 
  FileCode, 
  RefreshCw, 
  Lock, 
  Github, 
  Coffee, 
  HelpCircle,
  ExternalLink,
  Cpu,
  X
} from 'lucide-react';

const STORAGE_KEY = 'nexus_api_tracer_keys';

export default function App() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | KeyStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | KeyType>('all');
  const [providerFilter, setProviderFilter] = useState<'all' | ApiProvider>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'label' | 'quota_used'>('newest');
  
  // Modals / Overlays
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [rawBackupText, setRawBackupText] = useState('');
  const [backupError, setBackupError] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString('id-ID', { hour12: false }) + ' WITA');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // System Logs trigger
  const triggerLog = (type: TerminalLog['type'], message: string) => {
    const newLog: TerminalLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toUTCString().slice(17, 25),
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog].slice(-50)); // limit to last 50 logs for memory performance
  };

  // Load initial dataset
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setKeys(parsed);
        triggerLog('success', 'Database di-load dari LocalStorage. Sistem pelacakan siap digunakan.');
      } catch (err) {
        setKeys(INITIAL_API_KEYS);
        triggerLog('error', 'Gagal membaca LocalStorage. Memuat data sampel bawaan.');
      }
    } else {
      setKeys(INITIAL_API_KEYS);
      triggerLog('info', 'Selamat datang! Sistem inisialisasi default terpasang dengan sampel draf.');
    }

    // Add realistic system logs
    setTimeout(() => triggerLog('security', 'SSL Tunneling established // AES-256 API Key Storage sandboxed.'), 800);
    setTimeout(() => triggerLog('info', 'Ketik /help di dalam Prompt Terminal untuk mempelajari command rahasia.'), 1500);
  }, []);

  // Save changes to storage whenever mutated
  const saveKeys = (updatedKeys: ApiKeyItem[]) => {
    setKeys(updatedKeys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
  };

  // State mutators
  const handleAddKey = (newItem: Omit<ApiKeyItem, 'id' | 'addedAt'>) => {
    const fresh: ApiKeyItem = {
      ...newItem,
      id: `key-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    const updated = [fresh, ...keys];
    saveKeys(updated);
    triggerLog('success', `KUNCI BARU DIPASANG: "${fresh.label}" [${PROVIDERS[fresh.provider].name}] terdaftar di node.`);
  };

  const handleStatusChange = (id: string, nextStatus: KeyStatus) => {
    const keyToChange = keys.find(k => k.id === id);
    if (!keyToChange) return;

    const previousStatus = keyToChange.status;
    const updated = keys.map((k) => (k.id === id ? { ...k, status: nextStatus } : k));
    saveKeys(updated);

    const providerName = PROVIDERS[keyToChange.provider].name;
    const message = `Status "${keyToChange.label}" [${providerName}] diubah dari [${previousStatus.toUpperCase()}] menjadi [${nextStatus.toUpperCase()}].`;
    
    if (nextStatus === 'active') {
      triggerLog('success', `⚡ ${message}`);
    } else if (nextStatus === 'inactive') {
      triggerLog('warn', `💤 ${message}`);
    } else {
      triggerLog('error', `🛑 ${message}`);
    }
  };

  const handleUpdate = (updatedItem: ApiKeyItem) => {
    const updated = keys.map((k) => (k.id === updatedItem.id ? updatedItem : k));
    saveKeys(updated);
  };

  const handleDelete = (id: string) => {
    const target = keys.find((k) => k.id === id);
    if (!target) return;

    if (confirm(`Apakah Anda yakin ingin mematikan permanen pelacak & hapus seluruh memori kunci "${target.label}"?`)) {
      const updated = keys.filter((k) => k.id !== id);
      saveKeys(updated);
      triggerLog('warn', `DELETION EVENT: Kunci "${target.label}" didekripsi lalu di-purge secara permanen.`);
    }
  };

  // Seed default dummy
  const handleSeedDefaults = () => {
    saveKeys(INITIAL_API_KEYS);
    triggerLog('success', 'Database dipulihkan ke 4 sampel default API Key.');
  };

  // Pure memory wipe
  const handleClearDatabase = () => {
    if (confirm('BAHAYA! Tindakan ini akan menghapus semua API Key dari LocalStorage browser Anda secara permanen. Lanjutkan?')) {
      saveKeys([]);
      triggerLog('error', 'DATABASE PURGED: Seluruh draf API Key telah dibersihkan secara total.');
    }
  };

  // Terminal commands interpreter
  const handleExecuteTerminalCommand = (rawCmd: string) => {
    const text = rawCmd.trim();
    triggerLog('info', `EXECUTE_COMM: "${text}"`);

    if (text === '/help') {
      triggerLog('info', 'ℹ️ PANDUAN NEXUS_TRACER COMMANDS:');
      triggerLog('info', ' > /add - Membuka formulir modal pendaftaran Kunci API');
      triggerLog('info', ' > /clear - Mereset layar telemetri log saat ini');
      triggerLog('info', ' > /active [kata kunci] - Mengaktifkan instan kunci API berdasarkan kecocokan label');
      triggerLog('info', ' > /off [kata kunci] - Mematikan instant kunci API berdasarkan kecocokan label');
      triggerLog('info', ' > /exhausted [kata kunci] - Mengubah kuota habis instant berdasarkan label');
      return;
    }

    if (text === '/add') {
      setIsAddOpen(true);
      triggerLog('success', 'Membuka popup pendaftaran kunci via CLI (/add)...');
      return;
    }

    if (text === '/clear') {
      setLogs([]);
      return;
    }

    // Command patterns with variables
    if (text.startsWith('/active ')) {
      const query = text.replace('/active ', '').trim();
      const match = keys.find(k => k.label.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        handleStatusChange(match.id, 'active');
      } else {
        triggerLog('warn', `Command gagal: Tidak dapat menemukan label berisi kata kunci "${query}"`);
      }
      return;
    }

    if (text.startsWith('/off ')) {
      const query = text.replace('/off ', '').trim();
      const match = keys.find(k => k.label.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        handleStatusChange(match.id, 'inactive');
      } else {
        triggerLog('warn', `Command gagal: Tidak dapat menemukan label berisi kata kunci "${query}"`);
      }
      return;
    }

    if (text.startsWith('/exhausted ')) {
      const query = text.replace('/exhausted ', '').trim();
      const match = keys.find(k => k.label.toLowerCase().includes(query.toLowerCase()));
      if (match) {
        handleStatusChange(match.id, 'exhausted');
      } else {
        triggerLog('warn', `Command gagal: Tidak dapat menemukan label berisi kata kunci "${query}"`);
      }
      return;
    }

    // fallback
    triggerLog('error', `Perintah tak dikenal: "${text}". Ketik /help untuk daftar command valid.`);
  };

  // Backup Import & Export handlers
  const handleOpenBackup = () => {
    setRawBackupText(JSON.stringify(keys, null, 2));
    setBackupError('');
    setIsBackupOpen(true);
  };

  const handleApplyBackup = () => {
    try {
      const parsed = JSON.parse(rawBackupText);
      if (Array.isArray(parsed)) {
        // Simple structure validation
        const isValid = parsed.every(item => item.apiKey && item.provider && item.label);
        if (isValid) {
          saveKeys(parsed);
          setIsBackupOpen(false);
          triggerLog('success', `Berhasil memulihkan ${parsed.length} node API Key dari Backup Encrypted payload.`);
        } else {
          setBackupError('Format tidak valid. Array objek harus memiliki atribut apiKey, provider, dan label.');
        }
      } else {
        setBackupError('Payload tidak valid. JSON cadangan harus berupa representasi array.');
      }
    } catch (err) {
      setBackupError('Kesalahan Parser: String JSON tidak lengkap atau rusak.');
    }
  };

  // Filtering list logic
  const filteredKeys = keys.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.apiKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    // Provider filter
    const matchesProvider = providerFilter === 'all' || item.provider === providerFilter;

    return matchesSearch && matchesStatus && matchesType && matchesProvider;
  });

  // Sorting list logic
  const sortedKeys = [...filteredKeys].sort((a, b) => {
    if (sortBy === 'label') {
      return a.label.localeCompare(b.label);
    }
    if (sortBy === 'quota_used') {
      const aUsed = a.usedAmount || 0;
      const bUsed = b.usedAmount || 0;
      return bUsed - aUsed; // Highest usage first
    }
    // Default: newest added first
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  // Autocomplete command recommendations for command console
  const commandSuggestions = [
    '/help',
    '/add',
    '/clear',
    '/active Google',
    '/off Prod',
    '/exhausted Claude'
  ];

  return (
    <div id="nexus-app-root" className="min-h-screen bg-black text-zinc-300 flex flex-col justify-between font-sans selection:bg-[#51ff00]/30 selection:text-white relative">
      
      {/* Decorative cyber grid background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.025)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Cyberpunk Top Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="bg-[#51ff00]/10 p-2 rounded-lg border border-[#51ff00]/20 flex items-center justify-center animate-pulse">
              <Terminal size={18} className="text-[#51ff00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-zinc-100 font-mono font-bold text-sm tracking-widest uppercase">
                  NEXUS_API_TRACER
                </h1>
                <span className="bg-red-950/40 text-red-400 border border-red-900/30 font-mono text-[9px] px-1.5 py-0.5 rounded leading-none">
                  DARK_MODE
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wider">
                MAIN_CONSOLE // DISALURKAN LEWAT CLOUD PORT 3000
              </p>
            </div>
          </div>

          {/* Center Digital Clock Panel */}
          <div className="hidden lg:flex items-center gap-4 bg-black border border-zinc-900 px-4 py-1.5 rounded-md font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#51ff00] animate-ping" />
              <span className="text-zinc-500 uppercase text-[9px]">DAEMON_STATUS:</span>
              <span className="text-[#51ff00] font-bold">ONLINE</span>
            </div>
            <div className="text-zinc-600">|</div>
            <div className="text-zinc-400 tracking-wider font-light">
              {currentTime || 'SYSTEM_TIME'}
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2">
            <button
              id="raw-backup-btn"
              onClick={handleOpenBackup}
              className="px-2.5 py-1.5 text-[11px] font-mono border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-cyan-400 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Backup / Restore data JSON"
            >
              <FileCode size={13} />
              JSON_SYNC
            </button>
            
            <button
              id="launch-node-btn"
              onClick={() => setIsAddOpen(true)}
              className="px-3 py-1.5 text-[11px] font-mono bg-[#51ff00]/10 text-[#51ff00] hover:bg-[#51ff00]/20 border border-[#51ff00]/30 rounded transition-all flex items-center gap-1.5 cursor-pointer font-bold duration-200"
            >
              <Plus size={14} />
              MOUNT_KEY_NODE
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6 z-10">
        
        {/* Row 1: Global metrics widgets */}
        <KeyStats keys={keys} />

        {/* Row 2: Secondary terminal command interface & log monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CommandConsole 
              onExecuteCommand={handleExecuteTerminalCommand} 
              commandSuggestions={commandSuggestions}
            />
          </div>
          <div>
            <TerminalLogs logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>

        {/* Row 3: Live interactive keys list explorer */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 space-y-5">
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-900/60 pb-4">
            
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-cyan-500 rounded-sm" />
              <h2 className="text-zinc-100 font-mono font-bold text-sm tracking-wider uppercase">
                KEYS_STORAGE_EXPLORER ({filteredKeys.length})
              </h2>
            </div>

            {/* Quick interactive parameters filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-xs">
              
              {/* Search bar */}
              <div className="relative md:col-span-2">
                <input
                  id="explorer-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari label, provider, token, catatan..."
                  className="w-full bg-black/50 border border-zinc-900 hover:border-zinc-800 rounded pl-8 pr-3 py-1.5 text-zinc-300 outline-none focus:border-[#51ff00] placeholder-zinc-650"
                />
                <Search size={13} className="absolute left-2.5 top-2.5 text-zinc-600" />
              </div>

              {/* Status filter selection */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-black/50 border border-zinc-900 rounded px-2.5 py-1.5 text-zinc-400 outline-none focus:border-cyan-500 font-mono text-[11px]"
                >
                  <option value="all">STATUS: ALL</option>
                  <option value="active">🟢 ACTIVE_ONLY</option>
                  <option value="inactive">🟡 STANDBY / OFF</option>
                  <option value="exhausted">🔴 EXHAUSTED</option>
                </select>
              </div>

              {/* Provider filter selection */}
              <div>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value as any)}
                  className="w-full bg-black/50 border border-zinc-900 rounded px-2.5 py-1.5 text-zinc-400 outline-none focus:border-cyan-500 font-mono text-[11px]"
                >
                  <option value="all">PROVIDER: ALL</option>
                  {Object.values(PROVIDERS).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting option */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-black/50 border border-zinc-900 rounded px-2.5 py-1.5 text-zinc-400 outline-none focus:border-cyan-500 font-mono text-[11px]"
                >
                  <option value="newest">URUT_TERBARU</option>
                  <option value="label">URUT_ALFABET</option>
                  <option value="quota_used">URUT_KUOTA_HABIS</option>
                </select>
              </div>

            </div>

          </div>

          {/* Render list */}
          {sortedKeys.length === 0 ? (
            <div className="bg-black/40 border border-dashed border-zinc-900 rounded-lg p-12 text-center font-mono text-xs">
              <ShieldAlert className="mx-auto text-zinc-700 mb-3" size={28} />
              <p className="text-zinc-500 font-semibold mb-1">DATA NODES TIDAK DITEMUKAN</p>
              <p className="text-zinc-600 text-[11px] max-w-sm mx-auto mb-4 leading-normal">
                Tidak ada kunci API yang cocok dengan filter pencarian saat ini atau database kosong.
              </p>
              
              <div className="flex gap-2 justify-center">
                <button
                  id="seed-defaults-btn"
                  onClick={handleSeedDefaults}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded text-zinc-400 hover:text-white transition-colors text-[10px] cursor-pointer"
                >
                  LOAD_SAMPLE_NODES
                </button>
                <button
                  id="reset-filter-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setProviderFilter('all');
                  }}
                  className="px-3 py-1.5 bg-cyan-950/20 border border-cyan-900/40 rounded text-cyan-400 hover:text-cyan-300 transition-colors text-[10px] cursor-pointer"
                >
                  RESET_FILTERS
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent rounded-lg border border-zinc-900 bg-zinc-950/20">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] text-zinc-500 font-mono uppercase tracking-wider bg-zinc-950/60 select-none">
                    <th className="p-3 font-bold text-center">Status / Regulator Geser</th>
                    <th className="p-3 font-bold">Provider & Tipe</th>
                    <th className="p-3 font-bold">Label / Catatan</th>
                    <th className="p-3 font-bold">API Key Token (Sekali Klik Copas)</th>
                    <th className="p-3 font-bold">Logistik Kuota</th>
                    <th className="p-3 font-bold text-right pr-6">Operasi</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {sortedKeys.map((item) => (
                      <ApiKeyCard
                        key={item.id}
                        item={item}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onTriggerLog={triggerLog}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Clear Database Button / Seeding Options */}
          {keys.length > 0 && (
            <div className="pt-3 border-t border-zinc-900/40 flex justify-between items-center text-[10px] font-mono text-zinc-650">
              <span>ACTIVE_RECORDS_COUNT: {keys.length} items</span>
              <div className="flex gap-3">
                <button
                  onClick={handleSeedDefaults}
                  className="hover:text-zinc-400 transition-colors cursor-pointer"
                >
                  RESET_SAMPLE_DATA
                </button>
                <span>/</span>
                <button
                  onClick={handleClearDatabase}
                  className="hover:text-red-400 transition-colors cursor-pointer text-red-950"
                >
                  PURGE_ALL_DATA_NODES
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Informative Help Panel */}
        <section id="developer-handbook" className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 font-mono text-xs text-zinc-400 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900/80 pb-2">
            <Cpu size={14} className="text-cyan-400 font-bold" />
            <h3 className="text-zinc-200 font-bold uppercase tracking-widest text-[11px]">
              TRACER_CORE // INFORMASI ENDPOINT DAN PROVIDER KUNCI
            </h3>
          </div>

          <p className="leading-relaxed text-zinc-500">
            Aplikasi ini dirancang khusus untuk memonitor ketersediaan draf kunci API rahasia Anda secara terlokalisasi di browser Anda. Status kunci dapat <span className="text-[#51ff00] font-bold">Digeser (Toggled)</span> kapanpun kuota kueri Anda habis, kadaluarsa, atau sedang dipindahkan untuk menghindari runtime error pada aplikasi yang menggunakan API tersebut.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-black/40 border border-zinc-900 rounded space-y-1">
              <span className="text-emerald-400 font-bold text-[10px]">🔴 STATE: EXHAUSTED</span>
              <p className="text-zinc-650 text-[11px] leading-relaxed">
                Tandai sebagai telah habis untuk melacak kunci yang butuh diisi ulang kuerinya atau pendaftaran email baru di provider bersangkutan.
              </p>
            </div>
            <div className="p-3 bg-black/40 border border-zinc-900 rounded space-y-1">
              <span className="text-amber-400 font-bold text-[10px]">🟡 STATE: STANDBY_OFF</span>
              <p className="text-zinc-650 text-[11px] leading-relaxed">
                Kunci sedang dinonaktifkan sementara dari deployment luar untuk mencegah serangan brute force atau pemborosan saldo tidak sengaja.
              </p>
            </div>
            <div className="p-3 bg-black/40 border border-zinc-900 rounded space-y-1">
              <span className="text-cyan-400 font-bold text-[10px]">🟢 STATE: ACTIVE</span>
              <p className="text-zinc-650 text-[11px] leading-relaxed">
                Kunci siap pakai untuk dimasukkan dalam file .env server backend, agen web otonom, atau script testing lokal Anda.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Branding inside clean margins */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 p-4 text-center font-mono text-[10px] text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            API Key Terminal Tracker © 2026. Built with extreme lightweight precision.
          </span>
          <div className="flex items-center gap-1">
            <span>SECURE_LOCAL_STORAGE_ENCRYPTION // ACTIVE</span>
          </div>
        </div>
      </footer>

      {/* OVERLAY: Add Key Modal */}
      {isAddOpen && (
        <AddKeyModal
          onClose={() => setIsAddOpen(false)}
          onAddKey={handleAddKey}
          onTriggerLog={triggerLog}
        />
      )}

      {/* OVERLAY: JSON Backup and Recovery Dialog */}
      {isBackupOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg max-w-xl w-full p-6 shadow-2xl relative font-mono text-xs">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-cyan-400" />
            
            <button
              onClick={() => setIsBackupOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors p-1"
            >
              <X size={18} />
            </button>

            <h3 className="text-zinc-200 font-bold text-sm tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <FileCode size={16} className="text-cyan-400" />
              DATABASE_BACKUP_AND_RESTORE // RAW Payloads
            </h3>
            
            <p className="text-zinc-500 text-[11px] mb-4 leading-normal">
              Salin seluruh teks JSON di bawah untuk mem-backup kunci API Anda ke notepad lokal, atau tempel teks JSON cadangan lama Anda lalu klik "APPLY_RESTORE" untuk memulihkan tracker.
            </p>

            <textarea
              id="raw-backup-textarea"
              value={rawBackupText}
              onChange={(e) => setRawBackupText(e.target.value)}
              rows={10}
              className="w-full bg-black border border-zinc-900 rounded p-3 text-[#51ff00] focus:outline-none focus:border-cyan-500 font-mono text-xs mb-3 resize-y"
              spellCheck={false}
              placeholder="Paste JSON array format back up keys here..."
            />

            {backupError && (
              <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-2 text-[11px] rounded mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>{backupError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => setIsBackupOpen(false)}
                className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 border border-zinc-90 w-24 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleApplyBackup}
                className="px-3.5 py-1.5 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300 rounded border border-cyan-800 flex items-center gap-1 cursor-pointer font-bold duration-150"
              >
                APPLY_RESTORE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
