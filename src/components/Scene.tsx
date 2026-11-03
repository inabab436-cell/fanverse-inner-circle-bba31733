import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { Map as MapIcon, Smile, SendHorizontal, Music, Heart, Gift, Hand, Smartphone, X } from "lucide-react";
import boy from "@/assets/sprite-boy.png";
import girl from "@/assets/sprite-girl.png";
import girl2 from "@/assets/sprite-girl2.png";
import { PLACES } from "@/lib/places";

export const SPRITES = { boy, girl, girl2 };
export type Npc = { src: string; x: number; y: number; msg: string };
export type Hotspot = { x: number; y: number; to: (typeof PLACES)[number]["to"]; label: string };

const REACTIONS = [
  { label: "Play", icon: Music, emoji: "🎵" },
  { label: "Clap", icon: Hand, emoji: "👏" },
  { label: "Like", icon: Heart, emoji: "💜" },
  { label: "Gift", icon: Gift, emoji: "🎁" },
];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function Scene({
  bg, title, npcs, hotspots = [], walk = { minY: 36, maxY: 92 }, start = { x: 50, y: 70 }, children,
}: {
  bg: string; title: string; npcs: Npc[]; hotspots?: Hotspot[];
  walk?: { minY: number; maxY: number }; start?: { x: number; y: number }; children?: ReactNode;
}) {
  const [pos, setPos] = useState(start);
  const [dur, setDur] = useState(0);
  const [walking, setWalking] = useState(false);
  const [flip, setFlip] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [floats, setFloats] = useState<{ id: number; e: string; dx: number }[]>([]);
  const [hint, setHint] = useState(true);
  const [npcMsg, setNpcMsg] = useState(0);
  const [map, setMap] = useState(false);
  const [reacts, setReacts] = useState(false);
  const walkTimer = useRef(0);
  const bubbleTimer = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setNpcMsg((n) => (n + 1) % Math.max(1, npcs.length)), 2600);
    return () => clearInterval(t);
  }, [npcs.length]);

  function onWalk(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const to = { x: clamp(((e.clientX - r.left) / r.width) * 100, 6, 94), y: clamp(((e.clientY - r.top) / r.height) * 100, walk.minY, walk.maxY) };
    const ms = Math.max(250, (Math.hypot((to.x - pos.x) * r.width, (to.y - pos.y) * r.height) / 100) * 6);
    setFlip(to.x < pos.x); setDur(ms); setPos(to); setWalking(true); setHint(false);
    clearTimeout(walkTimer.current);
    walkTimer.current = window.setTimeout(() => setWalking(false), ms);
  }
  function say(e: FormEvent) {
    e.preventDefault();
    const m = text.trim().slice(0, 80);
    if (!m) return;
    setBubble(m); setText("");
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 4000);
  }
  function react(emoji: string) {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, e: emoji, dx: Math.random() * 30 - 15 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
  }

  const sprites = [...npcs.map((n, i) => ({ ...n, i, me: false })), { src: boy, x: pos.x, y: pos.y, msg: "", i: -1, me: true }];

  return (
    <main dir="ltr" className="flex h-dvh w-full items-center justify-center overflow-hidden bg-night select-none">
      <div className="fixed inset-0 z-[5000] hidden flex-col items-center justify-center gap-3 bg-night text-glass-foreground landscape:max-lg:flex">
        <Smartphone className="size-12 rotate-90 text-neon-soft" />
        <p className="font-semibold">لف الموبايل للوضع الرأسي</p>
      </div>

      <div className="relative h-full w-full max-w-[calc(100dvh*2/3)] overflow-hidden">
        <img src={bg} alt={title} width={1024} height={1536} className="scene-vivid absolute inset-0 h-full w-full object-cover" />

        <div className="absolute inset-0" onPointerDown={onWalk}>
          {sprites.map((s) => (
            <div key={s.i} className="pointer-events-none absolute"
              style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: Math.round(s.y * 10), transform: "translate(-50%, -100%)", transition: s.me ? `left ${dur}ms linear, top ${dur}ms linear` : undefined }}>
              {s.me && (
                <>
                  <span className="glow-ring animate-ring absolute left-1/2 top-full size-16 rounded-full border-2 border-neon-cyan" />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-neon-cyan drop-shadow">▼</span>
                  {floats.map((f) => <span key={f.id} className="animate-float-up absolute -top-4 text-2xl" style={{ left: `calc(50% + ${f.dx}px)` }}>{f.e}</span>)}
                </>
              )}
              {(s.me ? bubble : npcMsg === s.i || (npcMsg + 3) % npcs.length === s.i ? s.msg : null) && (
                <div className="absolute bottom-full left-1/2 mb-6 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-bubble px-3 py-1.5 text-xs font-semibold text-bubble-foreground shadow-lg">
                  <bdi>{s.me ? bubble : s.msg}</bdi>
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-bubble" />
                </div>
              )}
              <span className="absolute bottom-0 left-1/2 h-3 w-3/4 -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-night/60 blur-[3px]" />
              <img src={s.src} alt="" className={`relative w-auto drop-shadow-[0_6px_8px_var(--night)] ${s.me && walking ? "animate-bob" : ""}`}
                style={{ height: `calc(clamp(110px,19dvh,190px) * ${(0.55 + s.y / 140).toFixed(2)})`, transform: s.me && flip ? "scaleX(-1)" : undefined }} />
            </div>
          ))}
        </div>

        {hotspots.map((h) => (
          <Link key={h.to} to={h.to} className="neon-chip absolute z-[1500] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}>{h.label}</Link>
        ))}

        <div className="neon-panel absolute left-3 top-3 z-[2000] flex items-center gap-2 rounded-full py-1 pl-1 pr-4">
          <div className="relative">
            <img src={boy} alt="" className="size-11 rounded-full border-2 border-neon bg-night object-cover object-top" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-night bg-online" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Ahmed</p>
            <p className="flex items-center gap-1 text-[11px] opacity-80"><span className="size-1.5 rounded-full bg-online" />{title}</p>
          </div>
        </div>

        <div className="absolute right-3 top-3 z-[2000] flex flex-col gap-2">
          <button aria-label="الخريطة" onClick={() => setMap(true)} className="neon-btn grid size-11 place-items-center rounded-full"><MapIcon className="size-5" /></button>
        </div>

        {children}

        {hint && <div className="neon-panel pointer-events-none absolute bottom-24 left-1/2 z-[2000] -translate-x-1/2 rounded-full px-4 py-2 text-sm font-semibold">👆 Tap to walk</div>}

        <div className="absolute inset-x-2 bottom-3 z-[2000] flex items-end gap-2">
          <form onSubmit={say} className="neon-panel flex min-w-0 flex-1 items-center gap-1 rounded-full px-2 py-1.5">
            <Smile className="size-5 shrink-0 text-neon-gold" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." maxLength={80}
              className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-glass-foreground/60" />
            <button aria-label="إرسال" className="grid size-8 shrink-0 place-items-center rounded-full bg-neon-gradient"><SendHorizontal className="size-4" /></button>
          </form>
          <div className="relative shrink-0">
            {reacts && (
              <div className="neon-panel absolute bottom-full right-0 mb-2 flex gap-1 rounded-2xl p-1">
                {REACTIONS.map(({ label, icon: I, emoji }) => (
                  <button key={label} aria-label={label} onClick={() => { react(emoji); setReacts(false); }} className="grid size-10 place-items-center rounded-xl">
                    <I className="size-5 text-neon-pink" />
                  </button>
                ))}
              </div>
            )}
            <button aria-label="تفاعل" onClick={() => setReacts((v) => !v)} className="neon-btn grid size-11 place-items-center rounded-full"><Heart className="size-5 text-neon-pink" /></button>
          </div>
        </div>

        {map && (
          <div className="absolute inset-0 z-[3000] flex items-end bg-night/70 backdrop-blur-sm" onClick={() => setMap(false)}>
            <div dir="rtl" className="neon-panel w-full rounded-t-3xl p-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">إلى أين؟</h2>
                <button aria-label="إغلاق" onClick={() => setMap(false)}><X className="size-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PLACES.map((p) => (
                  <Link key={p.to} to={p.to} className="place-card rounded-2xl p-3">
                    <span className="text-2xl">{p.icon}</span>
                    <p className="mt-1 font-bold">{p.name}</p>
                    <p className="text-[11px] opacity-80">{p.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
