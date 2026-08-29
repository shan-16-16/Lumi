import { LumiCat, LumiAvatar, CatPaw } from '@/components/LumiCat';
import { Logo } from '@/components/Logo';
import { ArrowRight, Sparkles, ShieldCheck, Clock3, MessageCircle, Heart, Lock, BookHeart } from 'lucide-react';

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F3FF] text-ink dark:bg-[#171221] dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Logo />
        <button onClick={onEnter} className="rounded-full border border-lumi-200 bg-white/60 px-5 py-2.5 text-sm font-bold text-lumi-700 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-lumi-900 dark:bg-white/5 dark:text-lumi-300">Sign in</button>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-20">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-lumi-300/25 blur-3xl" />
        <div className="relative z-10 max-w-2xl animate-slide-up">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lumi-200 bg-white/60 px-4 py-2 text-xs font-bold tracking-wide text-lumi-700 dark:border-lumi-900 dark:bg-white/5 dark:text-lumi-300"><Sparkles size={14} /> A softer place to land</div>
          <h1 className="font-display text-6xl font-semibold leading-[.98] tracking-tight text-[#241B35] sm:text-7xl lg:text-[88px] dark:text-white">Meet Lumi.<br /><span className="text-lumi-600">A little light</span><br />for heavy days.</h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-ink-muted dark:text-lumi-200/70">A friendly AI companion for talking through difficult thoughts and feelings. Come as you are — Lumi is here to listen, without judgment.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button onClick={onEnter} className="group flex items-center gap-3 rounded-2xl bg-lumi-600 px-6 py-4 font-bold text-white shadow-xl shadow-lumi-600/25 transition hover:-translate-y-1 hover:bg-lumi-700">Talk to Lumi <ArrowRight size={18} className="transition group-hover:translate-x-1" /></button>
            <a href="#more" className="rounded-2xl px-5 py-4 font-bold text-lumi-700 transition hover:bg-white/70 dark:text-lumi-300">Learn more</a>
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs leading-5 text-ink-muted dark:text-lumi-200/60"><ShieldCheck size={15} className="text-lumi-500" /> Emotional support and general information — not professional care.</p>
        </div>
        <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[560px]">
          <div className="absolute h-80 w-80 rounded-full bg-lumi-400/30 blur-3xl animate-glow-pulse" />
          <div className="relative">
            <div className="absolute -right-12 top-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-bold text-lumi-800 shadow-lg shadow-lumi-900/10 animate-fade-in dark:border-white/10 dark:bg-white/10 dark:text-lumi-200">here with you <span className="ml-1 text-lumi-500">✦</span></div>
            <div className="absolute -left-16 bottom-20 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-bold text-ink-muted shadow-lg shadow-lumi-900/10 animate-fade-in dark:border-white/10 dark:bg-white/10 dark:text-lumi-200">take a breath</div>
            <div className="rounded-[48px] border border-white/80 bg-white/35 p-10 shadow-2xl shadow-lumi-900/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"><LumiCat size={330} /></div>
          </div>
          <div className="absolute bottom-4 right-8 flex gap-3 text-lumi-300"><Sparkles size={18} /><Sparkles size={11} /></div>
        </div>
      </section>

      <section id="more" className="border-t border-lumi-100 bg-white/40 px-6 py-16 dark:border-white/5 dark:bg-white/[.02]">
        <div className="mx-auto grid max-w-5xl gap-10 text-center sm:grid-cols-3">
          <Feature icon={<MessageCircle />} title="A place to talk" text="Put the tangled thoughts into words, at your own pace." />
          <Feature icon={<CatPaw />} title="No judgment" text="Lumi listens gently and meets you where you are." />
          <Feature icon={<Clock3 />} title="Whenever you need" text="A quiet companion for the moments that feel heavy." />
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <FeatureCard icon={<BookHeart />} title="Journal your thoughts" text="A calm, private space to reflect. Write freely, come back anytime, and watch your inner world take shape." />
          <FeatureCard icon={<Heart />} title="Check in with yourself" text="A gentle daily mood check-in. Notice patterns, celebrate small wins, and be kinder to yourself." />
        </div>
      </section>

      <section className="border-t border-lumi-100 bg-white/40 px-6 py-16 dark:border-white/5 dark:bg-white/[.02]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300"><Lock size={24} /></div>
          <h2 className="font-display text-3xl font-semibold">Your space, kept private</h2>
          <p className="mt-4 text-base leading-7 text-ink-muted dark:text-lumi-200/60">Your conversations, journal entries, and check-ins belong to you. They're securely tied to your account and never shared with anyone else.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-lumi-600 dark:text-lumi-300"><ShieldCheck size={16} /> End-to-end account isolation</div>
        </div>
      </section>

      <section className="px-6 py-20 text-center lg:px-10">
        <div className="mx-auto max-w-2xl">
          <LumiAvatar size={72} className="mx-auto" />
          <h2 className="mt-6 font-display text-4xl font-semibold">Ready when you are.</h2>
          <p className="mt-4 text-base leading-7 text-ink-muted dark:text-lumi-200/60">No pressure, no expectations. Just a quiet friend waiting to listen.</p>
          <button onClick={onEnter} className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-lumi-600 px-7 py-4 font-bold text-white shadow-xl shadow-lumi-600/25 transition hover:-translate-y-1 hover:bg-lumi-700">Talk to Lumi <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer className="border-t border-lumi-100 px-6 py-10 dark:border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Logo />
            <p className="max-w-md text-center text-xs leading-5 text-ink-muted sm:text-right dark:text-lumi-200/50">Lumi offers emotional support and general information. It is not a substitute for professional mental-health care. If you're in crisis, please contact your local emergency services or a crisis helpline.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="mx-auto max-w-xs"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300">{icon}</div><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-muted dark:text-lumi-200/60">{text}</p></div>;
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-3xl border border-lumi-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-lumi-100 text-lumi-600 dark:bg-lumi-950 dark:text-lumi-300">{icon}</div><h3 className="font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-ink-muted dark:text-lumi-200/60">{text}</p></div>;
}
