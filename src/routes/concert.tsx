import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Clapperboard, X } from "lucide-react";
import { Scene, SPRITES } from "@/components/Scene";
import { pageHead } from "@/lib/head";
import bg from "@/assets/bg-concert.jpg";

export const Route = createFileRoute("/concert")({
  head: () => pageHead("المسرح", "شاهد كليبات الفنان واستمتع بالعروض الجماعية مع الفانز."),
  component: Concert,
});

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function Concert() {
  const [video, setVideo] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [err, setErr] = useState("");

  function play(e: FormEvent) {
    e.preventDefault();
    const id = youtubeId(link);
    if (!id) return setErr("الصق رابط يوتيوب صحيح");
    setVideo(id); setOpen(false); setErr(""); setLink("");
  }

  return (
    <Scene
      bg={bg}
      title="المسرح"
      start={{ x: 50, y: 78 }}
      walk={{ minY: 50, maxY: 90 }}
      npcs={[
        { src: SPRITES.girl2, x: 32, y: 62, msg: "🔥🔥" },
        { src: SPRITES.girl, x: 66, y: 60, msg: "بحبها! 💜" },
        { src: SPRITES.boy, x: 22, y: 80, msg: "👏" },
        { src: SPRITES.boy, x: 78, y: 82, msg: "🎶" },
        { src: SPRITES.girl, x: 50, y: 64, msg: "😍" },
      ]}
      hotspots={[{ x: 50, y: 86, to: "/", label: "⭐ الساحة" }]}
    >
      {video && (
        <div className="neon-panel absolute left-[29%] top-[4.5%] z-[1600] aspect-video w-[42%] overflow-hidden rounded-md">
          <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${video}?autoplay=1&playsinline=1`} title="كليب الفنان" allow="autoplay; encrypted-media" allowFullScreen />
        </div>
      )}
      <button onClick={() => setOpen(true)} className="neon-chip absolute left-1/2 top-[33%] z-[1700] flex -translate-x-1/2 items-center gap-1 animate-pulse-soft">
        <Clapperboard className="size-4" /> {video ? "غيّر الكليب" : "شغّل كليب على الشاشة"}
      </button>
      {open && (
        <div className="absolute inset-0 z-[3000] flex items-center justify-center bg-night/70 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <form dir="rtl" onSubmit={play} onClick={(e) => e.stopPropagation()} className="neon-panel w-full rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">🎬 كليبات الفنان</h2>
              <button type="button" aria-label="إغلاق" onClick={() => setOpen(false)}><X className="size-5" /></button>
            </div>
            <p className="mb-2 text-xs opacity-80">الصق رابط كليب من يوتيوب ليعرض على شاشة المسرح.</p>
            <input dir="ltr" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full rounded-xl bg-night/60 px-3 py-2 text-sm outline-none" />
            {err && <p className="mt-1 text-xs text-neon-pink">{err}</p>}
            <button className="bg-neon-gradient mt-3 w-full rounded-xl py-2 font-bold">اعرض على الشاشة</button>
          </form>
        </div>
      )}
    </Scene>
  );
}
