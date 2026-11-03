import { createFileRoute } from "@tanstack/react-router";
import { Scene, SPRITES } from "@/components/Scene";
import { pageHead } from "@/lib/head";
import bg from "@/assets/bg-plaza.jpg";

export const Route = createFileRoute("/")({
  head: () => pageHead("الساحة الرئيسية", "نقطة دخول الفانز والتجمع العام في عالم Orbit."),
  component: () => (
    <Scene
      bg={bg}
      title="الساحة"
      start={{ x: 50, y: 72 }}
      walk={{ minY: 30, maxY: 88 }}
      npcs={[
        { src: SPRITES.girl2, x: 30, y: 40, msg: "أهلاً! 👋" },
        { src: SPRITES.girl, x: 70, y: 42, msg: "يلا المسرح 🎤" },
        { src: SPRITES.boy, x: 26, y: 62, msg: "😍" },
        { src: SPRITES.girl, x: 74, y: 64, msg: "💜" },
      ]}
      hotspots={[
        { x: 20, y: 24, to: "/cafe", label: "☕ المقهى" },
        { x: 82, y: 26, to: "/concert", label: "🎤 المسرح" },
        { x: 18, y: 70, to: "/shop", label: "🛍️ المتجر" },
        { x: 82, y: 72, to: "/rooms", label: "🌙 الصالات" },
      ]}
    />
  ),
});
