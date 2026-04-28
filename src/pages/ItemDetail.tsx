import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useInventory } from '../store/inventoryStore'
import { getCategory } from '../constants/categories'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { ExpiryBadge, LowStockBadge } from '../components/items/ExpiryBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function ItemDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const item = useInventory((s) => s.items.find((it) => it.id === id))
  const adjust = useInventory((s) => s.adjustQuantity)
  const del = useInventory((s) => s.deleteItem)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!item) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-500">
        Item not found.{' '}
        <Link to="/items" className="text-brand-600 hover:underline">
          Back to all items
        </Link>
      </div>
    )
  }

  const cat = getCategory(item.category)

  function onDelete() {
    if (!item) return
    del(item.id)
    nav('/items', { replace: true })
  }

  return (
    <div className="space-y-5 px-4 py-4 pb-24">
      <header className="flex items-center gap-3">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl ${cat.bg}`}
          aria-hidden
        >
          {cat.icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-medium ${cat.color}`}>{cat.name}</p>
          <h1 className="truncate text-xl font-bold text-slate-900 dark:text-slate-100">
            {item.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <ExpiryBadge item={item} />
            <LowStockBadge item={item} />
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">Quantity</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => adjust(item.id, -1)}
            disabled={item.quantity <= 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-700 hover:bg-slate-300 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Decrease by one"
          >
            −
          </button>
          <p className="min-w-[6rem] text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
            {item.quantity}{' '}
            <span className="text-base font-normal text-slate-500">
              {item.unit}
            </span>
          </p>
          <button
            onClick={() => adjust(item.id, +1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white hover:bg-brand-700"
            aria-label="Increase by one"
          >
            +
          </button>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <Field label="Owner" value={item.owner ?? '—'} />
        <Field label="Date added" value={formatDate(item.dateAdded)} />
        <Field
          label="Expiry date"
          value={item.expiryDate ? formatDate(item.expiryDate) : '—'}
        />
        <Field label="Location" value={item.location ?? '—'} />
        <Field
          label="Price"
          value={item.price != null ? `₹ ${item.price}` : '—'}
        />
        <Field
          label="Low-stock alert"
          value={
            item.lowStockThreshold != null
              ? `≤ ${item.lowStockThreshold} ${item.unit}`
              : '—'
          }
        />
        {item.notes && (
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
              {item.notes}
            </p>
          </div>
        )}
      </section>

      <div className="flex gap-2">
        <Link to={`/items/${item.id}/edit`} className="flex-1">
          <Button variant="secondary" fullWidth>
            Edit
          </Button>
        </Link>
        <Button
          variant="danger"
          onClick={() => setConfirmOpen(true)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        title="Delete item?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          “{item.name}” will be permanently removed. This can't be undone.
        </p>
      </Modal>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {value}
      </span>
    </div>
  )
}
