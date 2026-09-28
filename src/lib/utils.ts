import { createCn } from "cn/config"

// La escala tipográfica de ADR-023 (text-callout, text-title-1…) es de tamaño, no de color: sin esto,
// cn descartaba `text-primary-foreground` al lado de `text-callout`.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "amount", "title-1", "title-2", "headline", "callout", "footnote", "caption", "tab"] }],
    },
  },
})

/** "Comida y supermercado" → "comida-y-supermercado": sufijo estable de data-testid a partir de un nombre. */
export function toTestIdSuffix(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
