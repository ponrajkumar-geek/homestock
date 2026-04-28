import { useMemo } from 'react'
import type { CategoryId, Item } from '../types'

export type SortKey = 'recent' | 'name' | 'expiry' | 'oldest'

export interface FilterOptions {
  search?: string
  category?: CategoryId | null
  owner?: string | null
  expiringSoon?: boolean
  lowStock?: boolean
  sort?: SortKey
}

export function isExpiringSoon(item: Item, days = 30): boolean {
  if (!item.expiryDate) return false
  const now = Date.now()
  const exp = new Date(item.expiryDate).getTime()
  const diffDays = (exp - now) / 86400000
  return diffDays <= days
}

export function isLowStock(item: Item): boolean {
  if (item.lowStockThreshold == null) return false
  return item.quantity <= item.lowStockThreshold
}

export function useFilteredItems(
  items: Item[],
  opts: FilterOptions,
): Item[] {
  return useMemo(() => {
    const q = opts.search?.trim().toLowerCase()
    let out = items.filter((it) => {
      if (opts.category && it.category !== opts.category) return false
      if (opts.owner && it.owner !== opts.owner) return false
      if (opts.expiringSoon && !isExpiringSoon(it)) return false
      if (opts.lowStock && !isLowStock(it)) return false
      if (q) {
        const hay = [it.name, it.location, it.notes, it.owner]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    const sort = opts.sort ?? 'recent'
    out = [...out].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'oldest')
        return a.dateAdded.localeCompare(b.dateAdded)
      if (sort === 'expiry') {
        const ae = a.expiryDate ?? '9999'
        const be = b.expiryDate ?? '9999'
        return ae.localeCompare(be)
      }
      return b.dateAdded.localeCompare(a.dateAdded)
    })
    return out
  }, [items, opts.search, opts.category, opts.owner, opts.expiringSoon, opts.lowStock, opts.sort])
}
