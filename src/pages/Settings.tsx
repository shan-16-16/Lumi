import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { ResponseStyle, Theme, UserSettings } from '@/lib/types';
import { Check, Lock, Moon, Palette, ShieldCheck, Sun, UserRound } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const [style, setStyle] = useState<ResponseStyle>('balanced');
  const [emojis, setEmojis] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('user_settings').select('*').eq('user_id', user?.id).maybeSingle().then(({ data }) => {
      const settings = data as UserSettings | null;
      if (settings) { setStyle(settings.response_style); setEmojis(settings.use_emojis); setTheme(settings.theme); }
    });
  }, [user?.id]);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);

  async function save() {
    await supabase.from('user_settings').upsert({ user_id: user?.id, response_style: style, use_emojis: emojis, theme }, { onConflict: 'user_id' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Settings</h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">Make Lumi feel a little more like yours.</p>
        </div>

        <SettingsCard icon={<UserRound />} title="Account" description="Your account details are managed securely through Lumi.">
          <div className="flex items-center gap-4 rounded-2xl bg-[#F7F3FF] p-4 dark:bg-white/5">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300"><UserRound size={20} /></div>
            <div><div className="font-bold">{user?.user_metadata?.name || 'Your Lumi account'}</div><div className="text-sm text-ink-muted dark:text-lumi-200/60">{user?.email}</div></div>
          </div>
          <p className="mt-3 text-xs text-ink-muted dark:text-lumi-200/50">To change your password, use the password reset option on the sign-in screen.</p>
        </SettingsCard>

        <SettingsCard icon={<Palette />} title="Appearance" description="Choose how Lumi looks for you.">
          <div className="grid grid-cols-2 gap-3">
            <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun size={17} />} label="Light" />
            <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={17} />} label="Dark" />
          </div>
        </SettingsCard>

        <SettingsCard icon={<ShieldCheck />} title="Chat preferences" description="Choose the kind of company you need today.">
          <label className="block text-sm font-bold">Response style
            <select value={style} onChange={e => setStyle(e.target.value as ResponseStyle)} className="mt-2 w-full rounded-xl border border-lumi-100 bg-[#F7F3FF] px-4 py-3 outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5">
              <option value="concise">Concise and gentle</option><option value="balanced">Balanced</option><option value="detailed">Thoughtful and detailed</option>
            </select>
          </label>
          <Toggle label="Occasional emojis" description="Let Lumi use a little extra warmth when it fits." enabled={emojis} onToggle={() => setEmojis(!emojis)} />
        </SettingsCard>

        <SettingsCard icon={<Lock />} title="Privacy" description="Your personal space stays personal.">
          <div className="rounded-2xl bg-[#F7F3FF] p-4 text-sm leading-6 text-ink-muted dark:bg-white/5 dark:text-lumi-200/60">Your conversations, journal entries, and check-ins are securely scoped to your account. Other users cannot access them.</div>
          <p className="mt-4 text-xs leading-5 text-ink-muted dark:text-lumi-200/50">Need to delete your account or data? Contact support through your project owner. This option is intentionally not destructive from the app.</p>
        </SettingsCard>

        <SettingsCard icon={<ShieldCheck />} title="About Lumi" description="A little light for heavy days.">
          <div className="text-sm leading-6 text-ink-muted dark:text-lumi-200/60">Lumi is an emotional-support companion for reflection, journaling, and gentle conversation. Lumi is not a therapist, doctor, or substitute for professional care.</div>
          <div className="mt-4 text-xs font-bold text-lumi-600 dark:text-lumi-300">Version 1.0.0</div>
        </SettingsCard>

        <button onClick={save} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-lumi-600 py-3.5 font-bold text-white shadow-lg shadow-lumi-600/20 transition hover:bg-lumi-700">{saved ? <><Check size={18} /> Saved</> : 'Save preferences'}</button>
      </div>
    </div>
  );
}

function SettingsCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="mb-5 rounded-3xl border border-lumi-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"><div className="mb-5 flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300">{icon}</div><div><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">{description}</p></div></div>{children}</section>;
}

function ThemeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button onClick={onClick} className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition ${active ? 'border-lumi-500 bg-lumi-50 text-lumi-700 dark:bg-lumi-950 dark:text-lumi-300' : 'border-lumi-100 text-ink-muted hover:border-lumi-300 dark:border-white/10 dark:text-lumi-200/60'}`}>{icon}{label}</button>;
}

function Toggle({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
  return <div className="mt-5 flex items-center justify-between gap-4"><div><div className="text-sm font-bold">{label}</div><div className="text-xs text-ink-muted dark:text-lumi-200/60">{description}</div></div><button onClick={onToggle} className={`relative h-7 w-12 shrink-0 rounded-full transition ${enabled ? 'bg-lumi-600' : 'bg-lumi-200 dark:bg-white/20'}`} aria-label={`Toggle ${label}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? 'left-6' : 'left-1'}`} /></button></div>;
}
