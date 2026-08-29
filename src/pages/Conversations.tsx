import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LumiCat } from '@/components/LumiCat';
import type { Conversation } from '@/lib/types';
import { Search, Plus, Trash2, MessageCircle, Pencil, Check, X, ArrowRight } from 'lucide-react';
import type { PageId } from '@/components/Navigation';

export function Conversations({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => { loadConversations(); }, []);

  async function loadConversations() {
    const { data } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false });
    setConversations(data ?? []);
    setLoading(false);
  }

  async function newConversation() {
    const { data } = await supabase.from('conversations').insert({ title: 'New conversation' }).select().maybeSingle();
    if (data) { onNavigate('chat'); }
  }

  async function deleteConversation(id: string) {
    await supabase.from('conversations').delete().eq('id', id);
    setConversations(c => c.filter(x => x.id !== id));
  }

  async function renameConversation(id: string) {
    await supabase.from('conversations').update({ title: editTitle }).eq('id', id);
    setEditingId(null);
    loadConversations();
  }

  const filtered = conversations.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-full bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white">
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Conversations</h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-lumi-200/60">Your past talks with Lumi.</p>
          </div>
          <button onClick={newConversation} className="flex items-center gap-2 rounded-xl bg-lumi-600 px-4 py-2.5 font-bold text-white shadow-lg shadow-lumi-600/20 transition hover:-translate-y-0.5 hover:bg-lumi-700"><Plus size={18} /> New</button>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-3.5 text-ink-muted" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search conversations…" className="w-full rounded-xl border border-lumi-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-lumi-400 dark:border-white/10 dark:bg-white/5" />
        </div>

        {loading ? (
          <div className="grid place-items-center py-20"><LumiCat size={80} animate={false} className="animate-pulse" /></div>
        ) : filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-lumi-100 bg-white px-6 py-20 text-center dark:border-white/10 dark:bg-white/5">
            <LumiCat size={140} />
            <h2 className="mt-6 font-display text-2xl font-semibold">No conversations yet.</h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-lumi-200/60">Whenever you're ready, Lumi is here.</p>
            <button onClick={newConversation} className="mt-6 rounded-xl bg-lumi-600 px-5 py-2.5 font-bold text-white hover:bg-lumi-700">Start a conversation</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="group flex items-center gap-3 rounded-2xl border border-lumi-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300"><MessageCircle size={18} /></div>
                {editingId === c.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="flex-1 rounded-lg border border-lumi-200 bg-[#F7F3FF] px-3 py-2 text-sm outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5" autoFocus />
                    <button onClick={() => renameConversation(c.id)} className="rounded-lg bg-lumi-600 p-2 text-white"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="rounded-lg p-2 text-ink-muted hover:bg-lumi-100 dark:hover:bg-white/10"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => onNavigate('chat')} className="min-w-0 flex-1 text-left">
                      <div className="truncate font-bold">{c.title}</div>
                      <div className="text-xs text-ink-muted dark:text-lumi-200/50">{new Date(c.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                    </button>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                      <button onClick={() => { setEditingId(c.id); setEditTitle(c.title); }} className="rounded-lg p-2 text-ink-muted hover:bg-lumi-100 hover:text-lumi-600 dark:hover:bg-white/10" aria-label="Rename"><Pencil size={15} /></button>
                      <button onClick={() => deleteConversation(c.id)} className="rounded-lg p-2 text-ink-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
