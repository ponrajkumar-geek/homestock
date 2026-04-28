import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useInventory } from '../store/inventoryStore'
import {
  CATEGORIES,
  COMMON_UNITS,
} from '../constants/categories'
import { Button } from '../components/ui/Button'
import { FieldLabel, Input, Select, Textarea } from '../components/ui/Input'
import type { CategoryId, Item } from '../types'

const todayLocal = () => new Date().toISOString().slice(0, 10)

interface FormState {
  name: string
  category: CategoryId
  owner: string
  quantity: string
  unit: string
  dateAdded: string
  expiryDate: string
  location: string
  price: string
  lowStockThreshold: string
  notes: string
}

function emptyForm(): FormState {
  return {
    name: '',
    category: 'pantry',
    owner: '',
    quantity: '1',
    unit: 'pcs',
    dateAdded: todayLocal(),
    expiryDate: '',
    location: '',
    price: '',
    lowStockThreshold: '',
    notes: '',
  }
}

function fromItem(it: Item): FormState {
  return {
    name: it.name,
    category: it.category,
    owner: it.owner ?? '',
    quantity: String(it.quantity),
    unit: it.unit,
    dateAdded: it.dateAdded.slice(0, 10),
    expiryDate: it.expiryDate ? it.expiryDate.slice(0, 10) : '',
    location: it.location ?? '',
    price: it.price != null ? String(it.price) : '',
    lowStockThreshold:
      it.lowStockThreshold != null ? String(it.lowStockThreshold) : '',
    notes: it.notes ?? '',
  }
}

export function ItemEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = !!id

  const existing = useInventory((s) =>
    id ? s.items.find((it) => it.id === id) : undefined,
  )
  const owners = useInventory((s) => s.owners)
  const addItem = useInventory((s) => s.addItem)
  const updateItem = useInventory((s) => s.updateItem)

  const [form, setForm] = useState<FormState>(
    existing ? fromItem(existing) : emptyForm(),
  )
  const [error, setError] = useState<string | null>(null)

  const initial = useMemo(
    () => (existing ? fromItem(existing) : emptyForm()),
    [existing],
  )
  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  )

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }
    const qty = Number(form.quantity)
    if (!Number.isFinite(qty) || qty < 0) {
      setError('Quantity must be a number ≥ 0.')
      return
    }
    const data = {
      name: form.name.trim(),
      category: form.category,
      owner: form.owner || undefined,
      quantity: qty,
      unit: form.unit.trim() || 'pcs',
      dateAdded: new Date(form.dateAdded).toISOString(),
      expiryDate: form.expiryDate
        ? new Date(form.expiryDate).toISOString()
        : undefined,
      location: form.location.trim() || undefined,
      price: form.price !== '' ? Number(form.price) : undefined,
      lowStockThreshold:
        form.lowStockThreshold !== ''
          ? Number(form.lowStockThreshold)
          : undefined,
      notes: form.notes.trim() || undefined,
    }
    if (isEdit && existing) {
      updateItem(existing.id, data)
      nav(`/items/${existing.id}`, { replace: true })
    } else {
      const created = addItem(data)
      nav(`/items/${created.id}`, { replace: true })
    }
  }

  if (isEdit && !existing) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-500">
        Item not found.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-4 py-4 pb-32">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {isEdit ? 'Edit item' : 'Add new item'}
      </h1>

      <FieldLabel label="Name" required>
        <Input
          autoFocus
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Basmati rice"
          maxLength={80}
        />
      </FieldLabel>

      <FieldLabel label="Category" required>
        <Select
          value={form.category}
          onChange={(e) => set('category', e.target.value as CategoryId)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </Select>
      </FieldLabel>

      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="Quantity" required>
          <Input
            type="number"
            min={0}
            step="any"
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Unit" required>
          <Input
            list="unit-options"
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
            placeholder="pcs"
          />
          <datalist id="unit-options">
            {COMMON_UNITS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </FieldLabel>
      </div>

      <FieldLabel label="Owner">
        <Select
          value={form.owner}
          onChange={(e) => set('owner', e.target.value)}
        >
          <option value="">— None —</option>
          {owners.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </FieldLabel>

      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="Date added">
          <Input
            type="date"
            value={form.dateAdded}
            onChange={(e) => set('dateAdded', e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Expiry date">
          <Input
            type="date"
            value={form.expiryDate}
            onChange={(e) => set('expiryDate', e.target.value)}
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Location in home">
        <Input
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="e.g. Kitchen top shelf"
        />
      </FieldLabel>

      <div className="grid grid-cols-2 gap-3">
        <FieldLabel label="Price (₹)">
          <Input
            type="number"
            min={0}
            step="any"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="optional"
          />
        </FieldLabel>
        <FieldLabel
          label="Low-stock alert"
          hint="Warn when below this number"
        >
          <Input
            type="number"
            min={0}
            step="any"
            value={form.lowStockThreshold}
            onChange={(e) => set('lowStockThreshold', e.target.value)}
            placeholder="optional"
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Notes">
        <Textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Anything worth remembering"
          maxLength={500}
        />
      </FieldLabel>

      {error && (
        <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {error}
        </p>
      )}

      <div className="sticky bottom-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={() => nav(-1)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isEdit && !dirty} className="flex-1">
          {isEdit ? 'Save changes' : 'Add item'}
        </Button>
      </div>
    </form>
  )
}
