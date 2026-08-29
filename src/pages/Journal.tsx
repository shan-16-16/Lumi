import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LumiCat } from '@/components/LumiCat';
import type { JournalEntry } from '@/lib/types';
import { Plus, Trash2, X, BookHeart, Calendar } from 'lucide-react';

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => { loadEntries(); }, []);

  async function loadEntries() {
    const { data } = await supabase.from('journal_entries').select('*').order('created_at', { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  }

  async function saveEntry(title: string, content: string) {
    if (editing) {
      await supabase.from('journal_entries').update({ title, content }).eq('id', editing.id);
    } else {
      await supabase.from('journal_entries').insert({ title: title || 'Untitled', content });
    }
    setShowEditor(false);
    setEditing(null);
    loadEntries();
  }

  async function deleteEntry(id: string) {
    await supabase.from('journal_entries').delete().eq('id', id);
    setEntries(e => e.filter(x => x.id !== id));
  }

  function openNew() { setEditing(null); setShowEditor(true); }
  function openEdit(entry: JournalEntry) { setEditing(entry); setShowEditor(true); }

  if (showEditor) return <Editor entry={editing} onSave={saveEntry} onCancel={() => { setShowEditor(false); setEditing(null); }} />;

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Journal</h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">A calm, private space for your thoughts.</p>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-lumi-600 px-4 py-2.5 font-bold text-white shadow-lg shadow-lumi-600/20 transition hover:-translate-y-0.5 hover:bg-lumi-700"><Plus size={18} /> New entry</button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20"><LumiCat size={80} animate={false} className="animate-pulse" /></div>
        ) : entries.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-lumi-100 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-white/5">
            <LumiCat size={140} />
            <h2 className="mt-6 font-display text-2xl font-semibold">Nothing here yet.</h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-lumi-200/60">Start with whatever is on your mind.</p>
            <button onClick={openNew} className="mt-6 rounded-xl bg-lumi-600 px-5 py-2.5 font-bold text-white hover:bg-lumi-700">Write something</button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="group rounded-2xl border border-lumi-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                <button onClick={() => openEdit(entry)} className="block w-full text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold">{entry.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-muted dark:text-lumi-200/60">{entry.content || 'No content yet…'}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-ink-muted dark:text-lumi-200/50">
                      <Calendar size={13} /> {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </button>
                <button onClick={() => deleteEntry(entry.id)} className="mt-3 hidden items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 group-hover:flex"><Trash2 size={13} /> Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Editor({ entry, onSave, onCancel }: { entry: JournalEntry | null; onSave: (title: string, content: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300"><BookHeart size={20} /></div>
            <h1 className="font-display text-2xl font-semibold">{entry ? 'Edit entry' : 'New entry'}</h1>
          </div>
          <button onClick={onCancel} className="rounded-xl p-2 text-ink-muted hover:bg-lumi-100 dark:hover:bg-white/10"><X size={20} /></button>
        </div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Give it a title…"
          className="mb-4 w-full rounded-2xl border border-lumi-100 bg-white px-5 py-4 font-display text-xl font-semibold outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start wherever you are…"
          rows={16}
          className="w-full resize-none rounded-2xl border border-lumi-100 bg-white px-5 py-4 text-[15px] leading-8 outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl px-5 py-3 font-bold text-ink-muted hover:bg-lumi-100 dark:hover:bg-white/10">Cancel</button>
          <button onClick={() => onSave(title || 'Untitled', content)} className="rounded-xl bg-lumi-600 px-6 py-3 font-bold text-white shadow-lg shadow-lumi-600/20 hover:bg-lumi-700">Save entry</button>
        </div>
      </div>
    </div>
  );
}
