// Único lugar de la app que lee el reloj (C1). El dominio recibe `today` por parámetro.
export function today(): Date {
  return new Date()
}
