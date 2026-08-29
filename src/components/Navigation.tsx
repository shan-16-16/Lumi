import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LumiAvatar } from '@/components/LumiCat';
import { Logo } from '@/components/Logo';
import { Home, MessageCircle, BookHeart, HeartPulse, MessagesSquare, UserRound, Settings, LogOut, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export type PageId = 'dashboard' | 'chat' | 'journal' | 'checkin' | 'conversations' | 'profile' | 'settings';

const NAV_ITEMS: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'chat', label: 'Talk to Lumi', icon: MessageCircle },
  { id: 'journal', label: 'Journal', icon: BookHeart },
  { id: 'checkin', label: 'Check-ins', icon: HeartPulse },
  { id: 'conversations', label: 'Conversations', icon: MessagesSquare },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface NavProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Navigation({ current, onNavigate, collapsed, onToggleCollapse }: NavProps) {
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (page: PageId) => { onNavigate(page); setMobileOpen(false); };

  return (
    <>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/30 lg:hidden" />}
      <aside
        className={`${collapsed ? 'lg:w-[78px]' : 'lg:w-[260px]'} fixed inset-y-0 left-0 z-40 flex w-[260px] -translate-x-full flex-col border-r border-lumi-100 bg-[#F7F3FF] transition-all duration-300 lg:static lg:translate-x-0 dark:border-white/5 dark:bg-[#1C1729] ${mobileOpen ? 'translate-x-0' : ''}`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          {collapsed ? <LumiAvatar size={34} /> : <Logo />}
          <button onClick={onToggleCollapse} className="hidden rounded-lg p-2 text-ink-muted hover:bg-lumi-100 lg:block dark:hover:bg-white/10" aria-label="Collapse sidebar">
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto px-3">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`group mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${active ? 'bg-white text-lumi-700 shadow-sm dark:bg-white/10 dark:text-lumi-300' : 'text-ink-muted hover:bg-white/50 hover:text-lumi-700 dark:text-lumi-200/60 dark:hover:bg-white/5 dark:hover:text-lumi-200'}`}
              >
                <Icon size={18} className={`shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-lumi-600 dark:text-lumi-400' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-lumi-100 p-3 dark:border-white/5">
          {!collapsed && (
            <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink-muted hover:bg-white/60 dark:text-lumi-200/70 dark:hover:bg-white/5">
              <LogOut size={17} /> Sign out
            </button>
          )}
          {collapsed && (
            <button onClick={signOut} className="mx-auto grid place-items-center rounded-xl p-2.5 text-ink-muted hover:bg-white/60 dark:hover:bg-white/5" aria-label="Sign out">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export function MobileNavButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button className="rounded-xl p-2 hover:bg-lumi-100 lg:hidden dark:hover:bg-white/10" onClick={onOpen} aria-label="Open menu">
      <Menu size={22} />
    </button>
  );
}
