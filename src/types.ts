export type ApiProvider =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'deepseek'
  | 'cohere'
  | 'huggingface'
  | 'mistral'
  | 'openrouter'
  | 'custom';

export interface ProviderConfig {
  id: ApiProvider;
  name: string;
  defaultUrl: string;
  keyFormatHint: string;
  colorClass: string; // Tailwind text color
  bgClass: string; // Tailwind background color
  borderColor: string; // Tailwind border
  glowColor: string; // Custom shadow/glow hex or class
}

export type KeyType = 'free' | 'paid' | 'trial';
export type KeyStatus = 'active' | 'inactive' | 'exhausted';

export interface ApiKeyItem {
  id: string;
  provider: ApiProvider;
  customProviderName?: string;
  apiKey: string;
  label: string;
  type: KeyType;
  status: KeyStatus;
  addedAt: string;
  notes?: string;
  // Quota tracker
  limitAmount?: number;
  usedAmount?: number;
  currency: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'security';
  message: string;
}

export const PROVIDERS: Record<ApiProvider, ProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultUrl: 'https://platform.openai.com/api-keys',
    keyFormatHint: 'sk-proj-...',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    defaultUrl: 'https://console.anthropic.com/settings/keys',
    keyFormatHint: 'sk-ant-api03-...',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-950/40',
    borderColor: 'border-orange-500/30',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    defaultUrl: 'https://aistudio.google.com/app/apikey',
    keyFormatHint: 'AIzaSy...',
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-950/40',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.15)',
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    defaultUrl: 'https://console.groq.com/keys',
    keyFormatHint: 'gsk_...',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek API',
    defaultUrl: 'https://platform.deepseek.com/api_keys',
    keyFormatHint: 'sk-ds-...',
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-950/40',
    borderColor: 'border-violet-500/30',
    glowColor: 'rgba(139, 92, 246, 0.15)',
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    defaultUrl: 'https://dashboard.cohere.com/api-keys',
    keyFormatHint: 'xY7z9...',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-950/40',
    borderColor: 'border-rose-500/30',
    glowColor: 'rgba(244, 63, 94, 0.15)',
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    defaultUrl: 'https://huggingface.co/settings/tokens',
    keyFormatHint: 'hf_...',
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-950/40',
    borderColor: 'border-yellow-500/30',
    glowColor: 'rgba(234, 179, 8, 0.15)',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    defaultUrl: 'https://console.mistral.ai/api-keys',
    keyFormatHint: 'ms_...',
    colorClass: 'text-pink-400',
    bgClass: 'bg-pink-950/40',
    borderColor: 'border-pink-500/30',
    glowColor: 'rgba(236, 72, 153, 0.15)',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultUrl: 'https://openrouter.ai/settings/keys',
    keyFormatHint: 'sk-or-v1-...',
    colorClass: 'text-[#a1ff3b]',
    bgClass: 'bg-[#a1ff3b]/10',
    borderColor: 'border-[#a1ff3b]/30',
    glowColor: 'rgba(161, 255, 59, 0.15)',
  },
  custom: {
    id: 'custom',
    name: 'Custom Provider',
    defaultUrl: '',
    keyFormatHint: 'Enter custom API key format',
    colorClass: 'text-stone-300',
    bgClass: 'bg-stone-900/40',
    borderColor: 'border-stone-500/30',
    glowColor: 'rgba(120, 113, 108, 0.15)',
  }
};

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    provider: 'openai',
    apiKey: 'sk-proj-vKx9L8mQ1z7rP4wX3c9vA2b1nT5mR3k9l098p7q6H5g4f3d2s1a',
    label: 'Prod OpenAI - Web Agent',
    type: 'paid',
    status: 'active',
    addedAt: '2026-05-10T08:30:00Z',
    notes: 'Digunakan untuk backend WhatsApp Bot Pro. Kuota otomatis diisi ulang bulanan.',
    limitAmount: 120.00,
    usedAmount: 43.50,
    currency: 'USD'
  },
  {
    id: 'key-2',
    provider: 'gemini',
    apiKey: 'AIzaSyD-qR90xW3H2j8vK4m1nP5tT8y0z7q6r5s',
    label: 'Google AI Studio Gratisan',
    type: 'free',
    status: 'active',
    addedAt: '2026-06-01T12:00:00Z',
    notes: 'Kunci gratisan untuk coba-coba multimodal model di AI Studio.',
    limitAmount: 15.00,
    usedAmount: 0.00,
    currency: 'USD'
  },
  {
    id: 'key-3',
    provider: 'anthropic',
    apiKey: 'sk-ant-api03-L9k8j7H6g5F4d3S2a1pq9w8e7r6t5y4u3i2o1p0o9i8u7y6t5r4',
    label: 'Claude 3.5 Sonnet Sandbox',
    type: 'paid',
    status: 'inactive',
    addedAt: '2026-05-15T14:45:00Z',
    notes: 'Kunci cadangan untuk evaluasi coding agent.',
    limitAmount: 50.00,
    usedAmount: 12.80,
    currency: 'USD'
  },
  {
    id: 'key-4',
    provider: 'deepseek',
    apiKey: 'sk-ds-9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2',
    label: 'DeepSeek Chat Coder',
    type: 'free',
    status: 'exhausted',
    addedAt: '2026-04-20T09:15:00Z',
    notes: 'Kuota saldo $2 reward pendaftaran sudah habis terpakai untuk training.',
    limitAmount: 2.00,
    usedAmount: 2.00,
    currency: 'USD'
  }
];
