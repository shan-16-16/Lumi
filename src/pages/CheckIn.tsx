import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LumiCat } from '@/components/LumiCat';
import { MOODS, type MoodType, type MoodCheckIn } from '@/lib/types';
import { Sparkles } from 'lucide-react';

export function CheckIn() {
  const [checkins, setCheckins] = useState<MoodCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadCheckins(); }, []);

  async function loadCheckins() {
    const { data } = await supabase.from('mood_checkins').select('*').order('created_at', { ascending: false }).limit(30);
    setCheckins(data ?? []);
    setLoading(false);
  }

  async function submit() {
    if (!selectedMood) return;
    await supabase.from('mood_checkins').insert({ mood: selectedMood, note: note.trim() || null });
    setSaved(true);
    setSelectedMood(null);
    setNote('');
    loadCheckins();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Check in</h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">A gentle moment to notice how you're doing.</p>
        </div>

        {/* New check-in */}
        <section className="mb-10 rounded-3xl border border-lumi-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 font-display text-lg font-semibold">How are you right now?</h2>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200 hover:-translate-y-1 sm:p-4 ${selectedMood === m.value ? 'border-lumi-500 bg-lumi-50 dark:bg-lumi-950/50' : 'border-transparent bg-[#F7F3FF] hover:border-lumi-200 dark:bg-white/5'}`}
              >
                <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                <span className={`text-[11px] font-bold sm:text-xs ${selectedMood === m.value ? 'text-lumi-700 dark:text-lumi-300' : 'text-ink-muted dark:text-lumi-200/60'}`}>{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="mt-5 animate-fade-in">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Want to add a note? (optional)"
                rows={3}
                className="w-full resize-none rounded-2xl border border-lumi-100 bg-[#F7F3FF] px-4 py-3 text-sm outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5"
              />
              <button onClick={submit} className="mt-3 flex items-center gap-2 rounded-xl bg-lumi-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-lumi-600/20 hover:bg-lumi-700"><Sparkles size={16} /> Save check-in</button>
            </div>
          )}
          {saved && <p className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"><Sparkles size={15} /> Saved. Thanks for checking in with yourself.</p>}
        </section>

        {/* History */}
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold">Your check-in history</h2>
          {loading ? (
            <div className="grid place-items-center py-12"><LumiCat size={70} animate={false} className="animate-pulse" /></div>
          ) : checkins.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-lumi-100 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
              <LumiCat size={110} />
              <p className="mt-5 text-sm text-ink-muted dark:text-lumi-200/60">Your check-in history will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {checkins.map(c => {
                const mood = MOODS.find(m => m.value === c.mood);
                return (
                  <div key={c.id} className="flex items-start gap-4 rounded-2xl border border-lumi-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl" style={{ background: mood?.bg }}>{mood?.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{mood?.label}</div>
                      {c.note && <p className="mt-1 text-sm leading-6 text-ink-muted dark:text-lumi-200/60">{c.note}</p>}
                      <div className="mt-1 text-xs text-ink-muted dark:text-lumi-200/50">{new Date(c.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
