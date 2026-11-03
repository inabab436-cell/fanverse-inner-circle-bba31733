import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { Settings, Users, Mic, Smile, SendHorizontal, Music, Heart, Gift, Hand, Smartphone } from "lucide-react";
import bg from "@/assets/cafe-bg.jpg";
import boy from "@/assets/sprite-boy.png";
import girl from "@/assets/sprite-girl.png";
import girl2 from "@/assets/sprite-girl2.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbit Cafe — مقهى الفانز" },
      { name: "description", content: "مقهى بكسل ليلي يلتقي فيه الفانز، يمشون ويتكلمون ويتفاعلون مع الحفل." },
      { property: "og:title", content: "Orbit Cafe — مقهى الفانز" },
      { property: "og:description", content: "ادخل المقهى بشخصيتك، امشِ، دردش وتفاعل مع الحفل." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cafe,
});

type Pt = { x: number; y: number };
const NPCS = [
  { src: girl2, x: 40, y: 44, msg: "Let's dance! 🎉" },
  { src: girl, x: 56, y: 47, msg: "Hello! 💜" },
  { src: boy, x: 82, y: 58, msg: "😍" },
  { src: girl, x: 28, y: 86, msg: "🎶" },
  { src: girl2, x: 72, y: 80, msg: "💜" },
  { src: boy, x: 18, y: 62, msg: "..." },
];
const REACTIONS = [
  { label: "Play", icon: Music, emoji: "🎵" },
  { label: "Clap", icon: Hand, emoji: "👏" },
  { label: "Like", icon: Heart, emoji: "💜" },
  { label: "Gift", icon: Gift, emoji: "🎁" },
];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Cafe() {
  const [pos, setPos] = useState<Pt>({ x: 50, y: 64 });
  const [dur, setDur] = useState(0);
  const [walking, setWalking] = useState(false);
  const [flip, setFlip] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [floats, setFloats] = useState<{ id: number; e: string; dx: number }[]>([]);
  const [hint, setHint] = useState(true);
  const [npcMsg, setNpcMsg] = useState(0);
  const walkTimer = useRef<number>(0);
  const bubbleTimer = useRef<number>(0);

  useEffect(() => {
    const t = setInterval(() => setNpcMsg((n) => (n + 1) % NPCS.length), 2600);
    return () => clearInterval(t);
  }, []);

  function walk(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const to = { x: clamp(((e.clientX - r.left) / r.width) * 100, 6, 94), y: clamp(((e.clientY - r.top) / r.height) * 100, 36, 92) };
    const dist = Math.hypot((to.x - pos.x) * r.width, (to.y - pos.y) * r.height) / 100;
    const ms = Math.max(250, dist * 6);
    setFlip(to.x < pos.x);
    setDur(ms);
    setPos(to);
    setWalking(true);
    setHint(false);
    clearTimeout(walkTimer.current);
    walkTimer.current = window.setTimeout(() => setWalking(false), ms);
  }

  function say(e: FormEvent) {
    e.preventDefault();
    const m = text.trim().slice(0, 80);
    if (!m) return;
    setBubble(m);
    setText("");
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 4000);
  }

  function react(emoji: string) {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, e: emoji, dx: Math.random() * 30 - 15 }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
  }

  const sprites = [...NPCS.map((n, i) => ({ ...n, i, me: false })), { src: boy, x: pos.x, y: pos.y, msg: "", i: -1, me: true }];

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-night select-none">
      {/* portrait-only guard */}
      <div className="fixed inset-0 z-50 hidden flex-col items-center justify-center gap-3 bg-night text-glass-foreground landscape:max-lg:flex">
        <Smartphone className="size-12 rotate-90 text-neon-soft" />
        <p className="font-semibold">لف الموبايل للوضع الرأسي</p>
      </div>

      <div className="relative h-full max-h-dvh w-full max-w-[calc(100dvh*2/3)] overflow-hidden" style={{ aspectRatio: "2 / 3" }}>
        <img src={bg} alt="مقهى الفانز الليلي" width={1024} height={1536} className="pixelated absolute inset-0 h-full w-full object-cover" />

        {/* walk surface */}
        <div className="absolute inset-0" onPointerDown={walk}>
          {sprites.map((s) => (
            <div
              key={s.i}
              className="pointer-events-none absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                zIndex: Math.round(s.y * 10),
                transform: "translate(-50%, -100%)",
                transition: s.me ? `left ${dur}ms linear, top ${dur}ms linear` : undefined,
              }}
            >
              {s.me && (
                <>
                  <span className="glow-ring animate-ring absolute left-1/2 top-full size-16 rounded-full border-2 border-neon" />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-neon-soft drop-shadow">▼</span>
                  {floats.map((f) => (
                    <span key={f.id} className="animate-float-up absolute -top-4 text-2xl" style={{ left: `calc(50% + ${f.dx}px)` }}>{f.e}</span>
                  ))}
                </>
              )}
              {(s.me ? bubble : npcMsg === s.i || (npcMsg + 3) % NPCS.length === s.i ? s.msg : null) && (
                <div className="absolute bottom-full left-1/2 mb-6 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-bubble px-3 py-1.5 text-xs font-semibold text-bubble-foreground shadow-lg">
                  {s.me ? bubble : s.msg}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-bubble" />
                </div>
              )}
              <img
                src={s.src}
                alt=""
                className={`pixelated relative h-[clamp(70px,12dvh,110px)] w-auto ${s.me && walking ? "animate-bob" : ""}`}
                style={{ transform: s.me && flip ? "scaleX(-1)" : undefined }}
              />
            </div>
          ))}
        </div>

        {/* top-left profile */}
        <div className="absolute left-3 top-3 z-[2000] flex items-center gap-2 rounded-full bg-glass py-1 pl-1 pr-4 text-glass-foreground backdrop-blur">
          <div className="relative">
            <img src={boy} alt="" className="pixelated size-11 rounded-full border-2 border-neon bg-night object-cover object-top" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-night bg-online" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">Ahmed</p>
            <p className="flex items-center gap-1 text-[11px] opacity-80"><span className="size-1.5 rounded-full bg-online" />Online</p>
          </div>
        </div>

        {/* right controls */}
        <div className="absolute right-3 top-3 z-[2000] flex flex-col gap-2">
          {[Settings, Users, Mic].map((I, i) => (
            <button key={i} aria-label={["الإعدادات", "الأصدقاء", "المايك"][i]} className="grid size-11 place-items-center rounded-full bg-glass text-glass-foreground backdrop-blur active:scale-95">
              <I className="size-5" />
            </button>
          ))}
        </div>

        {hint && (
          <div className="pointer-events-none absolute bottom-24 left-1/2 z-[2000] -translate-x-1/2 rounded-full bg-glass px-4 py-2 text-sm font-semibold text-glass-foreground backdrop-blur">
            👆 Tap to walk
          </div>
        )}

        {/* bottom bar */}
        <div className="absolute inset-x-2 bottom-3 z-[2000] flex items-end gap-2">
          <form onSubmit={say} className="flex min-w-0 flex-1 items-center gap-1 rounded-full bg-glass px-2 py-1.5 text-glass-foreground backdrop-blur">
            <Smile className="size-5 shrink-0 opacity-80" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              maxLength={80}
              className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-glass-foreground/60"
            />
            <button aria-label="إرسال" className="grid size-8 shrink-0 place-items-center rounded-full"><SendHorizontal className="size-5" /></button>
          </form>
          {REACTIONS.map(({ label, icon: I, emoji }) => (
            <button key={label} onClick={() => react(emoji)} className="flex w-11 shrink-0 flex-col items-center rounded-2xl bg-glass py-1.5 text-glass-foreground backdrop-blur active:scale-95">
              <I className="size-5 text-neon-soft" />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
