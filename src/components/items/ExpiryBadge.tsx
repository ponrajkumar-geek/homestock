import type { Item } from '../../types'

function daysUntil(dateStr: string): number {
  return Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / 86400000,
  )
}

export function ExpiryBadge({ item }: { item: Item }) {
  if (!item.expiryDate) return null
  const days = daysUntil(item.expiryDate)
  if (days < 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
        Expired
      </span>
    )
  }
  if (days <= 7) {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
        {days === 0 ? 'Expires today' : `${days}d left`}
      </span>
    )
  }
  if (days <= 30) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        {days}d left
      </span>
    )
  }
  return null
}

export function LowStockBadge({ item }: { item: Item }) {
  if (item.lowStockThreshold == null) return null
  if (item.quantity > item.lowStockThreshold) return null
  return (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
      Low stock
    </span>
  )
}
