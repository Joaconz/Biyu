import type { ImportCatalog } from '@/domain/importRows'

/** Usuario sembrado (US-43, "usuario sembrado" de la §10): 8 categorías y 5 cuentas activas. */
export const SEEDED_CATALOG: ImportCatalog = {
  categories: ['Comida y supermercado', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Indumentaria', 'Otros'].map(
    (name, i) => ({ id: `cat-${i}`, name }),
  ),
  accounts: [
    { id: 'acc-cc', name: 'Tarjeta de crédito', type: 'credit_card' },
    { id: 'acc-dc', name: 'Tarjeta de débito', type: 'debit_card' },
    { id: 'acc-cash', name: 'Efectivo', type: 'cash' },
    { id: 'acc-bank', name: 'Cuenta bancaria', type: 'bank_account' },
    { id: 'acc-wallet', name: 'Billetera virtual', type: 'wallet' },
  ],
}
