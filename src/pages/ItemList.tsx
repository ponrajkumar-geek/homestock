import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useInventory } from '../store/inventoryStore'
import { CATEGORIES, getCategory } from '../constants/categories'
import { ItemCard } from '../components/items/ItemCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useFilteredItems, type SortKey } from '../hooks/useFilteredItems'
import type { CategoryId } from '../types'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Recently added' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A → Z)' },
  { value: 'expiry', label: 'Expiring soonest' },
]

export function ItemList() {
  const [params, setParams] = useSearchParams()
  const items = useInventory((s) => s.items)
  const owners = useInventory((s) => s.owners)

  const search = params.get('q') ?? ''
  const category = (params.get('category') as CategoryId | null) ?? null
  const owner = params.get('owner') ?? null
  const expiring = params.get('expiring') === '1'
  const lowstock = params.get('lowstock') === '1'
  const sort = (params.get('sort') as SortKey) ?? 'recent'

  const filtered = useFilteredItems(items, {
    search,
    category,
    owner,
    expiringSoon: expiring,
    lowStock: lowstock,
    sort,
  })

  const title = useMemo(() => {
    if (expiring) return 'Expiring soon'
    if (lowstock) return 'Low stock'
    if (category) return getCategory(category).name
    if (owner) return `${owner}'s items`
    return 'All items'
  }, [category, owner, expiring, lowstock])

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value == null || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const hasFilter = !!(category || owner || expiring || lowstock || search)

  return (
    <div className="space-y-4 px-4 py-4 pb-24">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {filtered.length} of {items.length} items
        </p>
      </div>

      <Input
        type="search"
        value={search}
        onChange={(e) => update('q', e.target.value)}
        placeholder="Search by name, location, notes…"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Select
          value={category ?? ''}
          onChange={(e) => update('category', e.target.value || null)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </Select>
        <Select
          value={owner ?? ''}
          onChange={(e) => update('owner', e.target.value || null)}
        >
          <option value="">All owners</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => update('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="Expiring ≤ 30 days"
          active={expiring}
          onClick={() => update('expiring', expiring ? null : '1')}
        />
        <FilterChip
          label="Low stock"
          active={lowstock}
          onClick={() => update('lowstock', lowstock ? null : '1')}
        />
        {hasFilter && (
          <button
            onClick={() => setParams({})}
            className="rounded-full px-3 py-1 text-xs font-medium text-brand-600 hover:underline dark:text-brand-500"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={hasFilter ? 'No items match' : 'No items yet'}
          description={
            hasFilter
              ? 'Try changing the filters or clearing them.'
              : 'Tap the + button to add your first item.'
          }
          action={
            !hasFilter && (
              <Link to="/items/new">
                <Button>+ Add item</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  )
}
