import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { LumiAvatar } from '@/components/LumiCat';
import { UserRound, Mail, Check, Pencil } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [saved, setSaved] = useState(false);

  async function saveName() {
    // Supabase auth update for user metadata
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.updateUser({ data: { name } });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'friend';

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-2xl px-6 py-8 lg:px-10 lg:py-12">
        <h1 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">Profile</h1>

        <div className="rounded-3xl border border-lumi-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <LumiAvatar size={96} />
            </div>
            {editing ? (
              <div className="mt-6 w-full max-w-xs">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-lumi-100 bg-[#F7F3FF] px-4 py-3 text-center font-display text-lg font-semibold outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5" autoFocus />
                <div className="mt-3 flex justify-center gap-2">
                  <button onClick={saveName} className="flex items-center gap-1.5 rounded-xl bg-lumi-600 px-4 py-2 font-bold text-white hover:bg-lumi-700"><Check size={16} /> Save</button>
                  <button onClick={() => { setEditing(false); setName(user?.user_metadata?.name || ''); }} className="rounded-xl px-4 py-2 font-bold text-ink-muted hover:bg-lumi-100 dark:hover:bg-white/10">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="mt-5 font-display text-2xl font-semibold">{displayName}</h2>
                <button onClick={() => setEditing(true)} className="mt-2 flex items-center gap-1.5 text-sm font-bold text-lumi-600 dark:text-lumi-300"><Pencil size={14} /> Edit name</button>
              </>
            )}
            {saved && <p className="mt-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">Saved!</p>}
          </div>

          <div className="mt-8 space-y-4 border-t border-lumi-100 pt-6 dark:border-white/10">
            <InfoRow icon={<UserRound size={18} />} label="Name" value={displayName} />
            <InfoRow icon={<Mail size={18} />} label="Email" value={user?.email ?? '—'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300">{icon}</div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-ink-muted dark:text-lumi-200/50">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
