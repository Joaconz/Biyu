# ADR-042 — Leer y generar .xlsx en el navegador con read-excel-file y write-excel-file

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-013, ADR-035 · C2, C14

## Contexto

US-74 a US-78 (`entrega-2/historias/importar-excel.md`) leen un `.xlsx` en el navegador y bajan una
plantilla generada ahí mismo; el archivo no se sube a ningún lado (C14). Hace falta una librería
para las dos cosas y la elección no es obvia, porque la spec pide tres cosas que no todas resuelven:

1. **Montos sin `number` (C2, §2 de la historia).** Excel guarda los números como texto decimal
   en el XML (`<v>0.30000000000000004</v>`); la historia redondea a 15 dígitos significativos con
   `decimal.js`. Una librería que entrega solo `number` obliga a pasar por el float.
2. **Distinguir una fecha de un número.** "46000" sin formato de fecha da F2; con formato, es una
   fecha. Eso sale del estilo de la celda y del sistema de fechas del libro (1900 o 1904).
3. **Mantenida y sin vulnerabilidades conocidas**, cargada solo en la pantalla de importación.

## Decisión

**`read-excel-file` para leer y `write-excel-file` para la plantilla**, las dos del mismo autor,
pinneadas a versión exacta (9.3.12 y 4.1.1) como `decimal.js`.

- `read-excel-file` acepta `parseNumber`: la celda numérica llega como el texto del `<v>`, sin
  convertir. El dominio lo redondea con `decimal.js` (C2, ADR-013). Detecta las fechas por el
  estilo de la celda, respeta `date1904` y lee el valor guardado de una fórmula. Lee solo la hoja
  pedida y no descarta las filas vacías del medio, así el número de fila no se corre.
- Se usan las builds `universal`, que corren igual en el navegador y en Node: los tests de
  `tests/lib/xlsx.test.ts` leen el archivo de ejemplo con el mismo código que la app.
- Viven detrás de `src/lib/xlsx.ts`, el único módulo que las importa, y se cargan con `import()`
  desde `src/lib/importFile.ts`: quedan en un chunk propio (unos 34 kB gzip) que baja recién al elegir
  un archivo o la plantilla. `src/domain/importFile.ts` recibe celdas ya extraídas y no conoce la
  librería.
- Al elegirlas, `npm audit` sobre las dos (y sus dependencias: `fflate`, `saxen`, `unzipper-esm`,
  `worker-f`) da cero vulnerabilidades, y las dos tienen versiones de los últimos meses.

## Alternativas descartadas

- **SheetJS (`xlsx`).** La más completa, pero la versión publicada en npm (0.18.5) tiene
  vulnerabilidades conocidas (prototype pollution y ReDoS) y las versiones corregidas solo se
  distribuyen desde el CDN del autor, fuera del registro: `npm audit` no las cubre y el lockfile
  apuntaría a un tarball externo.
- **ExcelJS.** Lee y escribe, pero su última versión es de 2023, arrastra dependencias pensadas
  para Node (`archiver`, `unzipper`, `tmp`, `fast-csv`) y pesa varias veces más en el navegador.
  Entrega los números como `number`.
- **Un lector propio con `fflate` y el `DOMParser`.** Cero dependencias nuevas fuera de `fflate`,
  pero hay que reimplementar estilos, fechas 1900/1904, cadenas compartidas y texto enriquecido, y
  el `DOMParser` no existe en el entorno `node` de Vitest: los tests no correrían el mismo código.

## Consecuencias

- La regla de C2 se cumple desde la celda: ningún monto del archivo pasa por `number`.
- Una fórmula sin valor guardado (un archivo generado por un programa que no calcula) se lee como
  celda vacía si es numérica, y si es de texto hace fallar la lectura entera (A3). La historia pide
  usar el valor guardado y no hay otro.
- Una celda con error de fórmula (`#DIV/0!`, `#N/A`) la librería la lee como vacía. En una columna
  obligatoria la fila queda igual con error y no se importa ("Falta el monto" en vez del texto de la
  celda); se acepta porque el resultado es el mismo y evitarlo obliga a leer el XML por fuera de la
  librería.
- Un serial de fecha fuera de rango (año mayor a 9999) se muestra como "########", igual que en
  Excel, y la fila da error de fecha en vez de rechazar el archivo.
- Dos dependencias de producción más. Si alguna deja de mantenerse o aparece una vulnerabilidad sin
  arreglo, se reemplaza tocando solo `src/lib/xlsx.ts`.
