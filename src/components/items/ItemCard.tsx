import { Link } from 'react-router-dom'
import type { Item } from '../../types'
import { getCategory } from '../../constants/categories'
import { ExpiryBadge, LowStockBadge } from './ExpiryBadge'

export function ItemCard({ item }: { item: Item }) {
  const cat = getCategory(item.category)
  return (
    <Link
      to={`/items/${item.id}`}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl ${cat.bg}`}
        aria-hidden
      >
        {cat.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {item.name}
          </h3>
        </div>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {item.quantity} {item.unit}
          {item.owner && <span> · {item.owner}</span>}
          {item.location && <span> · {item.location}</span>}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <ExpiryBadge item={item} />
          <LowStockBadge item={item} />
        </div>
      </div>
    </Link>
  )
}
