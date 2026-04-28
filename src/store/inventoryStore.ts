import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item, ThemeMode } from '../types'
import { DEFAULT_OWNERS } from '../constants/categories'

interface InventoryState {
  items: Item[]
  owners: string[]
  theme: ThemeMode
  addItem: (
    data: Omit<Item, 'id' | 'dateAdded' | 'updatedAt'> & {
      dateAdded?: string
    },
  ) => Item
  updateItem: (id: string, patch: Partial<Item>) => void
  deleteItem: (id: string) => void
  adjustQuantity: (id: string, delta: number) => void
  addOwner: (name: string) => void
  renameOwner: (oldName: string, newName: string) => void
  removeOwner: (name: string) => void
  setTheme: (theme: ThemeMode) => void
  importData: (items: Item[], owners: string[]) => void
  clearAll: () => void
}

function makeId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

export const useInventory = create<InventoryState>()(
  persist(
    (set) => ({
      items: [],
      owners: DEFAULT_OWNERS,
      theme: 'system',

      addItem: (data) => {
        const now = new Date().toISOString()
        const item: Item = {
          ...data,
          id: makeId(),
          dateAdded: data.dateAdded || now,
          updatedAt: now,
        }
        set((s) => ({ items: [item, ...s.items] }))
        return item
      },

      updateItem: (id, patch) => {
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id
              ? { ...it, ...patch, updatedAt: new Date().toISOString() }
              : it,
          ),
        }))
      },

      deleteItem: (id) => {
        set((s) => ({ items: s.items.filter((it) => it.id !== id) }))
      },

      adjustQuantity: (id, delta) => {
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id
              ? {
                  ...it,
                  quantity: Math.max(0, it.quantity + delta),
                  updatedAt: new Date().toISOString(),
                }
              : it,
          ),
        }))
      },

      addOwner: (name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((s) =>
          s.owners.includes(trimmed)
            ? s
            : { owners: [...s.owners, trimmed] },
        )
      },

      renameOwner: (oldName, newName) => {
        const trimmed = newName.trim()
        if (!trimmed || oldName === trimmed) return
        set((s) => ({
          owners: s.owners.map((o) => (o === oldName ? trimmed : o)),
          items: s.items.map((it) =>
            it.owner === oldName ? { ...it, owner: trimmed } : it,
          ),
        }))
      },

      removeOwner: (name) => {
        set((s) => ({
          owners: s.owners.filter((o) => o !== name),
          items: s.items.map((it) =>
            it.owner === name ? { ...it, owner: undefined } : it,
          ),
        }))
      },

      setTheme: (theme) => set({ theme }),

      importData: (items, owners) => set({ items, owners }),

      clearAll: () => set({ items: [], owners: DEFAULT_OWNERS }),
    }),
    {
      name: 'homestock-store',
      version: 1,
    },
  ),
)
