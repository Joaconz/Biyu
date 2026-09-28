import { Banknote, CreditCard, Landmark, Smartphone, WalletCards, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  credit_card: CreditCard,
  debit_card: WalletCards,
  cash: Banknote,
  bank_account: Landmark,
  wallet: Smartphone,
}

/** Ícono por tipo de cuenta (glosario: Cuenta), en trazo fino. */
export function AccountIcon({ type, className }: { type: string | null | undefined; className?: string }) {
  const Icon = (type && ICONS[type]) || Landmark
  return <Icon aria-hidden="true" strokeWidth={1.6} className={cn('size-[1.125rem] shrink-0', className)} />
}
