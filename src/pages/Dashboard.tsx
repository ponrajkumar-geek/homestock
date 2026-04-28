import { Link } from 'react-router-dom'
import { useInventory } from '../store/inventoryStore'
import { CATEGORIES } from '../constants/categories'
import { ItemCard } from '../components/items/ItemCard'
import { EmptyState } from '../components/ui/EmptyState'
import { isExpiringSoon, isLowStock } from '../hooks/useFilteredItems'
import { Button } from '../components/ui/Button'

export function Dashboard() {
  const items = useInventory((s) => s.items)
  const expiringCount = items.filter((it) => isExpiringSoon(it)).length
  const lowStockCount = items.filter((it) => isLowStock(it)).length
  const recent = [...items]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 5)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const counts = new Map<string, number>()
  for (const it of items) {
    counts.set(it.category, (counts.get(it.category) ?? 0) + 1)
  }

  return (
    <div className="space-y-6 px-4 py-4 pb-24">
      <section>
        <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {greeting} 👋
        </h1>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Link
          to="/items"
          className="rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {items.length}
          </p>
        </Link>
        <Link
          to="/items?expiring=1"
          className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-left shadow-sm dark:border-amber-900/40 dark:bg-amber-900/10"
        >
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Expiring soon
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-800 dark:text-amber-200">
            {expiringCount}
          </p>
        </Link>
        <Link
          to="/items?lowstock=1"
          className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-left shadow-sm dark:border-orange-900/40 dark:bg-orange-900/10"
        >
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Low stock
          </p>
          <p className="mt-1 text-2xl font-bold text-orange-800 dark:text-orange-200">
            {lowStockCount}
          </p>
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Categories
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/items?category=${cat.id}`}
              className={`flex flex-col items-start gap-2 rounded-xl border border-transparent p-3 shadow-sm transition hover:border-brand-300 ${cat.bg}`}
            >
              <span className="text-3xl" aria-hidden>
                {cat.icon}
              </span>
              <div>
                <p className={`text-xs font-semibold ${cat.color}`}>{cat.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {counts.get(cat.id) ?? 0} item
                  {(counts.get(cat.id) ?? 0) === 1 ? '' : 's'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recently added
        </h2>
        {recent.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="Your home, empty for now"
            description="Add your first item to get started — pantry staples, medicines, or appliances."
            action={
              <Link to="/items/new">
                <Button>+ Add first item</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recent.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
            {items.length > recent.length && (
              <Link
                to="/items"
                className="block rounded-lg py-2 text-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-500"
              >
                See all {items.length} items →
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
