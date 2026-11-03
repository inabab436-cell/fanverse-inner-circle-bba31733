import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Scene, SPRITES } from "@/components/Scene";
import { pageHead } from "@/lib/head";
import bg from "@/assets/bg-shop.jpg";

export const Route = createFileRoute("/shop")({
  head: () => pageHead("المتجر", "تيشيرتات وهوديز وهدايا للفانز."),
  component: Shop,
});

const ITEMS = [
  { id: "tee", name: "تيشيرت الفانز", icon: "👕", price: 120 },
  { id: "hoodie", name: "هودي النجم", icon: "🧥", price: 250 },
  { id: "cap", name: "كاب", icon: "🧢", price: 80 },
  { id: "phones", name: "سماعات بنفسجي", icon: "🎧", price: 300 },
  { id: "vinyl", name: "أسطوانة", icon: "💿", price: 150 },
  { id: "gift", name: "هدية للفنان", icon: "🎁", price: 50 },
];
const KEY = "orbit-shop";

function Shop() {
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState(500);
  const [owned, setOwned] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) { setCoins(s.coins); setOwned(s.owned); }
    } catch { /* ignore */ }
  }, []);

  function buy(id: string, price: number) {
    if (coins < price || owned.includes(id)) return;
    const next = { coins: coins - price, owned: [...owned, id] };
    setCoins(next.coins); setOwned(next.owned);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return (
    <Scene
      bg={bg}
      title="المتجر"
      walk={{ minY: 40, maxY: 88 }}
      npcs={[
        { src: SPRITES.girl2, x: 30, y: 52, msg: "الهودي تحفة 😍" },
        { src: SPRITES.boy, x: 72, y: 64, msg: "🛍️" },
      ]}
      hotspots={[{ x: 50, y: 96, to: "/", label: "⭐ الساحة" }]}
    >
      <button onClick={() => setOpen(true)} className="neon-chip absolute left-1/2 top-[20%] z-[1700] flex -translate-x-1/2 items-center gap-1 animate-pulse-soft">
        <ShoppingBag className="size-4" /> تسوّق · 🪙 {coins}
      </button>
      {open && (
        <div className="absolute inset-0 z-[3000] flex items-end bg-night/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div dir="rtl" className="neon-panel w-full rounded-t-3xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">🛍️ المتجر</h2>
              <span className="text-sm font-bold text-neon-gold">🪙 {coins}</span>
              <button aria-label="إغلاق" onClick={() => setOpen(false)}><X className="size-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ITEMS.map((it) => {
                const has = owned.includes(it.id);
                return (
                  <button key={it.id} disabled={has || coins < it.price} onClick={() => buy(it.id, it.price)}
                    className="place-card flex flex-col items-center rounded-2xl p-2 disabled:opacity-60">
                    <span className="text-3xl">{it.icon}</span>
                    <span className="mt-1 text-[11px] font-bold">{it.name}</span>
                    <span className="text-[11px] text-neon-gold">{has ? "✓ عندك" : `🪙 ${it.price}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}
