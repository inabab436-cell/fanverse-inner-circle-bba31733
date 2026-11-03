export const pageHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Orbit` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Orbit` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
