import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { LumiAvatar, LumiCat } from '@/components/LumiCat';
import { MOODS, type MoodType, type Conversation } from '@/lib/types';
import { ArrowRight, MessageCircle, BookHeart, HeartPulse, MessagesSquare, Sparkles } from 'lucide-react';
import type { PageId } from '@/components/Navigation';

export function Dashboard({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'friend';

  useEffect(() => {
    supabase.from('conversations').select('*').order('updated_at', { ascending: false }).limit(4).then(({ data }) => setConversations(data ?? []));
    supabase.from('mood_checkins').select('mood').order('created_at', { ascending: false }).limit(1).then(({ data }) => { if (data?.[0]) setTodayMood(data[0].mood as MoodType); });
  }, []);

  async function saveMood(mood: MoodType) {
    setTodayMood(mood);
    await supabase.from('mood_checkins').insert({ mood });
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2000);
  }

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-12">
        {/* Welcome */}
        <div className="mb-10 flex items-center gap-5">
          <LumiAvatar size={64} />
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Hey, {displayName} <span className="text-lumi-500">💜</span></h1>
            <p className="mt-1 text-base text-ink-muted dark:text-lumi-200/60">How are you feeling today?</p>
          </div>
        </div>

        {/* Mood check-in */}
        <section className="mb-10 rounded-3xl border border-lumi-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Check in with yourself</h2>
              <p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">Pick whatever feels closest. There's no wrong answer.</p>
            </div>
            {moodSaved && <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><Sparkles size={12} /> Saved</span>}
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => saveMood(m.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 hover:-translate-y-1 sm:p-4 ${todayMood === m.value ? 'border-lumi-500 bg-lumi-50 dark:bg-lumi-950/50' : 'border-transparent bg-[#F7F3FF] hover:border-lumi-200 dark:bg-white/5'}`}
              >
                <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                <span className={`text-[11px] font-bold sm:text-xs ${todayMood === m.value ? 'text-lumi-700 dark:text-lumi-300' : 'text-ink-muted dark:text-lumi-200/60'}`}>{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickAction icon={<MessageCircle />} label="Talk to Lumi" onClick={() => onNavigate('chat')} />
            <QuickAction icon={<HeartPulse />} label="Check in" onClick={() => onNavigate('checkin')} />
            <QuickAction icon={<BookHeart />} label="Journal" onClick={() => onNavigate('journal')} />
            <QuickAction icon={<MessagesSquare />} label="Conversations" onClick={() => onNavigate('conversations')} />
          </div>
        </section>

        {/* Recent conversations */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent conversations</h2>
            <button onClick={() => onNavigate('conversations')} className="flex items-center gap-1 text-sm font-bold text-lumi-600 dark:text-lumi-300">See all <ArrowRight size={14} /></button>
          </div>
          {conversations.length === 0 ? (
            <div className="rounded-3xl border border-lumi-100 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
              <LumiCat size={100} className="mx-auto" animate={false} />
              <p className="mt-4 text-sm text-ink-muted dark:text-lumi-200/60">No conversations yet. Whenever you're ready, Lumi is here.</p>
              <button onClick={() => onNavigate('chat')} className="mt-5 rounded-xl bg-lumi-600 px-5 py-2.5 font-bold text-white hover:bg-lumi-700">Talk to Lumi</button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map(c => (
                <button key={c.id} onClick={() => onNavigate('chat')} className="flex w-full items-center gap-3 rounded-2xl border border-lumi-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300"><MessageCircle size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{c.title}</div>
                    <div className="text-xs text-ink-muted dark:text-lumi-200/50">{new Date(c.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-3 rounded-2xl border border-lumi-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-lumi-100 text-lumi-600 transition group-hover:scale-110 dark:bg-lumi-950 dark:text-lumi-300">{icon}</div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
