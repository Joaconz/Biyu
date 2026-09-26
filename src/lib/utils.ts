export { cn } from "cn"

/** "Comida y supermercado" → "comida-y-supermercado": sufijo estable de data-testid a partir de un nombre. */
export function toTestIdSuffix(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
