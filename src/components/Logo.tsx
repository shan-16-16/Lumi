import { Moon, Sparkles } from 'lucide-react';
import { LumiAvatar } from './LumiCat';

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><div className="relative"><LumiAvatar size={compact ? 34 : 42} /><Sparkles size={12} className="absolute -right-1 -top-1 text-lumi-400" /></div>{!compact && <div><div className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Lumi</div><div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-lumi-500"><Moon size={9} fill="currentColor" /> a little light</div></div>}</div>;
}
