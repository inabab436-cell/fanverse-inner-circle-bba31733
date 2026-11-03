import { createFileRoute } from "@tanstack/react-router";
import { Scene, SPRITES } from "@/components/Scene";
import { pageHead } from "@/lib/head";
import bg from "@/assets/bg-cafe.jpg";

export const Route = createFileRoute("/cafe")({
  head: () => pageHead("المقهى", "للتعارف والمحادثات والجلوس مع الفانز."),
  component: () => (
    <Scene
      bg={bg}
      title="المقهى"
      walk={{ minY: 38, maxY: 90 }}
      npcs={[
        { src: SPRITES.girl2, x: 40, y: 46, msg: "Let's dance! 🎉" },
        { src: SPRITES.girl, x: 58, y: 50, msg: "Hello! 💜" },
        { src: SPRITES.boy, x: 26, y: 66, msg: "قهوة؟ ☕" },
        { src: SPRITES.girl, x: 76, y: 70, msg: "🎶" },
        { src: SPRITES.boy, x: 60, y: 84, msg: "..." },
      ]}
      hotspots={[{ x: 50, y: 86, to: "/", label: "⭐ الساحة" }]}
    />
  ),
});
