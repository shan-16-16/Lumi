import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Conversation, Message } from '@/lib/types';
import { LumiAvatar, LumiCat } from '@/components/LumiCat';
import { Logo } from '@/components/Logo';
import { Navigation, MobileNavButton, type PageId } from '@/components/Navigation';
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Journal } from '@/pages/Journal';
import { CheckIn } from '@/pages/CheckIn';
import { Conversations } from '@/pages/Conversations';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { ArrowLeft, ArrowRight, Check, LogIn, Menu, MessageCircle, Send, ShieldCheck, Sparkles, Trash2, X } from 'lucide-react';

type PublicScreen = 'landing' | 'auth';

function App() { return <AuthProvider><AppContent /></AuthProvider>; }

function AppContent() {
  const { user, loading } = useAuth();
  const [publicScreen, setPublicScreen] = useState<PublicScreen>('landing');
  const [page, setPage] = useState<PageId>('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { if (user) setPage('dashboard'); }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#F7F3FF] dark:bg-[#171221]"><LumiAvatar size={72} className="animate-pulse" /></div>;
  if (!user) return publicScreen === 'landing' ? <Landing onEnter={() => setPublicScreen('auth')} /> : <AuthScreen onBack={() => setPublicScreen('landing')} />;

  return (
    <div className="flex min-h-screen bg-[#FBFAFE] dark:bg-[#171221]">
      <Navigation current={page} onNavigate={setPage} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-lumi-100 bg-white/70 px-5 backdrop-blur-md sm:px-8 lg:hidden dark:border-white/5 dark:bg-[#171221]/70">
          <div className="flex items-center gap-3"><MobileNavButton onOpen={() => { const button = document.querySelector<HTMLButtonElement>('[aria-label="Open menu"]'); button?.click(); }} /><Logo compact /></div>
          <LumiAvatar size={38} />
        </header>
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'chat' && <ChatApp />}
        {page === 'journal' && <Journal />}
        {page === 'checkin' && <CheckIn />}
        {page === 'conversations' && <Conversations onNavigate={setPage} />}
        {page === 'profile' && <Profile />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function AuthScreen({ onBack }: { onBack: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (result.error) setError(result.error); else if (mode === 'signup') setNotice('Your account is ready. You can sign in now.');
  }

  return <main className="min-h-screen bg-[#F7F3FF] px-6 py-8 dark:bg-[#171221]"><button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-lumi-700 dark:text-lumi-300"><ArrowLeft size={17} /> Back home</button><div className="mx-auto flex max-w-md flex-col items-center pt-12"><Logo /><div className="mt-10 w-full rounded-3xl border border-lumi-100 bg-white p-8 shadow-xl shadow-lumi-900/5 dark:border-white/10 dark:bg-white/5"><div className="mb-8"><h1 className="font-display text-3xl font-semibold">{mode === 'signin' ? 'Welcome back' : 'Make space for yourself'}</h1><p className="mt-2 text-sm text-ink-muted dark:text-lumi-200/60">{mode === 'signin' ? 'Lumi saved you a quiet seat.' : 'A gentle place to check in with your thoughts.'}</p></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-bold">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-lumi-100 bg-[#F7F3FF] px-4 py-3 outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5" /></label><label className="block text-sm font-bold">Password<input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-lumi-100 bg-[#F7F3FF] px-4 py-3 outline-none focus:border-lumi-500 dark:border-white/10 dark:bg-white/5" /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}{notice && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}<button disabled={busy} className="w-full rounded-xl bg-lumi-600 py-3.5 font-bold text-white transition hover:bg-lumi-700 disabled:opacity-60">{busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button></form><button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setNotice(''); }} className="mt-6 w-full text-center text-sm font-bold text-lumi-600">{mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></div><p className="mt-6 max-w-sm text-center text-xs leading-5 text-ink-muted dark:text-lumi-200/50">Lumi offers emotional support and general information. It is not a substitute for professional mental-health care.</p></div></main>;
}

function ChatApp() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { void loadConversations(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  async function loadConversations() {
    const { data } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false });
    setConversations(data ?? []);
    if (data?.[0]) { setActiveId(data[0].id); await loadMessages(data[0].id); }
    setLoading(false);
  }
  async function loadMessages(id: string) { setLoading(true); const { data } = await supabase.from('messages').select('*').eq('conversation_id', id).order('created_at'); setMessages(data ?? []); setLoading(false); }
  async function newConversation() { const { data, error } = await supabase.from('conversations').insert({ title: 'New conversation' }).select().maybeSingle(); if (!error && data) { setConversations(c => [data, ...c]); setActiveId(data.id); setMessages([]); } }
  async function deleteConversation(id: string) { const { error } = await supabase.from('conversations').delete().eq('id', id); if (!error) { const rest = conversations.filter(c => c.id !== id); setConversations(rest); if (activeId === id) { setActiveId(rest[0]?.id ?? null); setMessages([]); if (rest[0]) await loadMessages(rest[0].id); } } }
  async function sendMessage(event?: FormEvent) {
    event?.preventDefault(); const text = draft.trim(); if (!text || sending || !activeId) return; setDraft(''); setSending(true);
    const optimistic: Message = { id: `temp-${Date.now()}`, conversation_id: activeId, role: 'user', content: text, created_at: new Date().toISOString() }; setMessages(m => [...m, optimistic]);
    const { data: sessionData } = await supabase.auth.getSession();
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lumi-chat`, { method: 'POST', headers: { Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`, apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ conversation_id: activeId, message: text }) });
      const body: { response?: string; error?: string } = await res.json(); if (!res.ok || !body.response) throw new Error(body.error ?? "Lumi can't reach her thoughts right now. Please try again in a moment.");
      const assistant: Message = { id: `temp-a-${Date.now()}`, conversation_id: activeId, role: 'assistant', content: body.response, created_at: new Date().toISOString() }; setMessages(m => [...m.filter(x => x.id !== optimistic.id), optimistic, assistant]); await loadConversations();
    } catch (error) { setMessages(m => m.filter(x => x.id !== optimistic.id)); setDraft(text); window.alert(error instanceof Error ? error.message : "Lumi can't reach her thoughts right now. Please try again in a moment."); } finally { setSending(false); }
  }

  const filtered = useMemo(() => conversations.filter(c => c.title.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  return <div className="flex min-h-[calc(100vh-76px)] flex-1 bg-[#FBFAFE] text-ink dark:bg-[#171221] dark:text-white lg:min-h-screen"><aside className={`${historyOpen ? 'w-[270px]' : 'w-0'} hidden shrink-0 overflow-hidden border-r border-lumi-100 bg-[#F7F3FF] transition-all duration-300 lg:block dark:border-white/5 dark:bg-[#1C1729]`}><div className="w-[270px] p-4"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[.18em] text-ink-muted">History</span><button onClick={() => setHistoryOpen(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-white/60 dark:hover:bg-white/10"><X size={17} /></button></div><button onClick={newConversation} className="flex w-full items-center justify-center gap-2 rounded-xl bg-lumi-600 py-3 font-bold text-white shadow-lg shadow-lumi-600/20 hover:bg-lumi-700"><Sparkles size={17} /> New conversation</button><div className="relative mt-4"><MessageCircle size={15} className="absolute left-3 top-3 text-ink-muted" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="w-full rounded-xl border border-lumi-100 bg-white/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-lumi-400 dark:border-white/10 dark:bg-white/5" /></div><div className="mt-5 space-y-1">{filtered.map(c => <div key={c.id} className={`group flex items-center gap-2 rounded-xl px-3 py-3 text-sm ${c.id === activeId ? 'bg-white font-bold text-lumi-700 shadow-sm dark:bg-white/10 dark:text-lumi-300' : 'text-ink-muted hover:bg-white/50 dark:text-lumi-200/60 dark:hover:bg-white/5'}`}><button onClick={() => { setActiveId(c.id); void loadMessages(c.id); }} className="min-w-0 flex-1 truncate text-left">{c.title}</button><button onClick={() => void deleteConversation(c.id)} className="hidden text-ink-muted hover:text-red-500 group-hover:block"><Trash2 size={14} /></button></div>)}</div></div></aside><main className="flex min-w-0 flex-1 flex-col"><header className="flex h-[76px] items-center justify-between border-b border-lumi-100 bg-white/70 px-5 backdrop-blur-md sm:px-8 dark:border-white/5 dark:bg-[#171221]/70"><div className="flex items-center gap-3">{!historyOpen && <button onClick={() => setHistoryOpen(true)} className="rounded-xl p-2 text-ink-muted hover:bg-lumi-100 dark:hover:bg-white/10"><Menu size={20} /></button>}<LumiAvatar size={42} /><div><div className="font-display text-lg font-semibold">Lumi</div><div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-lumi-200/60"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Here with you</div></div></div><div className="hidden items-center gap-2 text-xs font-bold text-ink-muted sm:flex dark:text-lumi-200/50"><ShieldCheck size={15} className="text-lumi-500" /> A private space for your thoughts</div></header>{!activeId ? <EmptyState onNew={() => void newConversation()} /> : <><div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-16">{loading ? <div className="grid h-full place-items-center"><LumiAvatar size={55} className="animate-pulse" /></div> : messages.length === 0 ? <Welcome /> : <div className="mx-auto max-w-3xl space-y-6">{messages.map(m => <ChatMessage key={m.id} message={m} />)}{sending && <Typing />}<div ref={bottomRef} /></div>}</div><form onSubmit={sendMessage} className="border-t border-lumi-100 bg-white/80 p-4 backdrop-blur-md sm:p-6 lg:px-16 dark:border-white/5 dark:bg-[#171221]/80"><div className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-lumi-200 bg-white p-2 shadow-lg shadow-lumi-900/5 focus-within:border-lumi-500 dark:border-white/10 dark:bg-white/5"><textarea rows={1} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }} placeholder="Tell Lumi what's on your mind…" className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink-muted/70 dark:placeholder:text-lumi-200/40" /><button disabled={!draft.trim() || sending} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lumi-600 text-white transition hover:bg-lumi-700 disabled:bg-lumi-200 disabled:text-lumi-400" aria-label="Send message"><Send size={18} /></button></div><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-ink-muted dark:text-lumi-200/40">Lumi is emotional support, not professional mental-health care. Shift + Enter for a new line.</p></form></>}</main></div>;
}

function Welcome() { return <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-16 text-center"><LumiAvatar size={78} /><h2 className="mt-6 font-display text-3xl font-semibold">What feels heavy today?</h2><p className="mt-3 text-sm leading-6 text-ink-muted dark:text-lumi-200/60">You don't need to have the right words. Start anywhere, and we'll take it one thought at a time.</p></div>; }
function EmptyState({ onNew }: { onNew: () => void }) { return <div className="grid flex-1 place-items-center px-6"><div className="text-center"><LumiCat size={180} /><h2 className="mt-4 font-display text-3xl font-semibold">A quiet space is waiting.</h2><p className="mt-3 text-sm text-ink-muted dark:text-lumi-200/60">Whenever you're ready, start a conversation with Lumi.</p><button onClick={onNew} className="mt-7 rounded-xl bg-lumi-600 px-5 py-3 font-bold text-white">Start a conversation</button></div></div>; }
function ChatMessage({ message }: { message: Message }) { const isUser = message.role === 'user'; return <div className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>{!isUser && <LumiAvatar size={34} className="mt-1 shrink-0" />}<div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-7 ${isUser ? 'rounded-br-md bg-lumi-600 text-white' : 'rounded-bl-md border border-lumi-100 bg-white text-ink shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-lumi-50'}`}><p className="whitespace-pre-wrap">{message.content}</p><div className={`mt-1 text-[10px] ${isUser ? 'text-lumi-200' : 'text-ink-muted/60 dark:text-lumi-200/40'}`}>{new Date(message.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div></div></div>; }
function Typing() { return <div className="flex items-center gap-3"><LumiAvatar size={34} /><div className="flex gap-1 rounded-2xl rounded-bl-md border border-lumi-100 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/5"><i className="h-2 w-2 animate-pulse-dot rounded-full bg-lumi-400" /><i className="h-2 w-2 animate-pulse-dot rounded-full bg-lumi-400 [animation-delay:.2s]" /><i className="h-2 w-2 animate-pulse-dot rounded-full bg-lumi-400 [animation-delay:.4s]" /></div></div>; }

export default App;
