import { useRef, useState } from 'react'
import { useInventory } from '../store/inventoryStore'
import { Button } from '../components/ui/Button'
import { FieldLabel, Input, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { exportBackup, readBackupFile } from '../services/storage'
import { CHANGELOG } from '../constants/changelog'
import type { ThemeMode } from '../types'

export function Settings() {
  const items = useInventory((s) => s.items)
  const owners = useInventory((s) => s.owners)
  const theme = useInventory((s) => s.theme)
  const setTheme = useInventory((s) => s.setTheme)
  const addOwner = useInventory((s) => s.addOwner)
  const renameOwner = useInventory((s) => s.renameOwner)
  const removeOwner = useInventory((s) => s.removeOwner)
  const importData = useInventory((s) => s.importData)
  const clearAll = useInventory((s) => s.clearAll)

  const [newOwner, setNewOwner] = useState('')
  const [editingOwner, setEditingOwner] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    const trimmed = newOwner.trim()
    if (!trimmed) return
    addOwner(trimmed)
    setNewOwner('')
  }

  function startEdit(name: string) {
    setEditingOwner(name)
    setEditingValue(name)
  }

  function commitEdit() {
    if (editingOwner && editingValue.trim()) {
      renameOwner(editingOwner, editingValue.trim())
    }
    setEditingOwner(null)
    setEditingValue('')
  }

  async function onImportFile(file: File) {
    try {
      const data = await readBackupFile(file)
      importData(data.items, data.owners?.length ? data.owners : owners)
      setImportStatus(
        `Imported ${data.items.length} items from backup (${data.exportedAt.slice(0, 10)}).`,
      )
    } catch (err) {
      setImportStatus(
        err instanceof Error ? `Import failed: ${err.message}` : 'Import failed.',
      )
    }
  }

  return (
    <div className="space-y-6 px-4 py-4 pb-24">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Settings
      </h1>

      <Section title="Appearance">
        <FieldLabel label="Theme">
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
          >
            <option value="system">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        </FieldLabel>
      </Section>

      <Section title="Owners">
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          Add, rename, or remove the people whose items you track.
        </p>
        <ul className="space-y-2">
          {owners.map((o) => (
            <li
              key={o}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800"
            >
              {editingOwner === o ? (
                <>
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit()
                      if (e.key === 'Escape') setEditingOwner(null)
                    }}
                  />
                  <Button onClick={commitEdit}>Save</Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-slate-800 dark:text-slate-100">
                    {o}
                  </span>
                  <button
                    onClick={() => startEdit(o)}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => setConfirmRemove(o)}
                    className="text-xs font-medium text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <Input
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Add new owner"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={!newOwner.trim()}>
            Add
          </Button>
        </div>
      </Section>

      <Section title="Backup & restore">
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Your data lives only on this device. Export a JSON backup before
          changing phones or clearing browser data.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => exportBackup(items, owners)}
            disabled={items.length === 0}
          >
            Export backup ({items.length} items)
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileRef.current?.click()}
          >
            Import from file
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        {importStatus && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {importStatus}
          </p>
        )}
      </Section>

      <Section title="Danger zone">
        <Button variant="danger" onClick={() => setConfirmClear(true)}>
          Clear all data
        </Button>
      </Section>

      <Section title="About">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          HomeStock · v{__APP_VERSION__} · built {' '}
          {new Date(__BUILD_DATE__).toLocaleDateString()}
        </p>
        <details className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <summary className="cursor-pointer text-slate-800 dark:text-slate-200">
            Changelog
          </summary>
          <ul className="mt-2 space-y-2">
            {CHANGELOG.map((entry) => (
              <li key={entry.version}>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  v{entry.version} — {entry.date}
                </p>
                <ul className="ml-4 list-disc text-xs">
                  {entry.changes.map((c, i) => (
                    <li key={i}>{c.summary}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </details>
      </Section>

      <Modal
        open={confirmRemove !== null}
        title="Remove owner?"
        onClose={() => setConfirmRemove(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmRemove) removeOwner(confirmRemove)
                setConfirmRemove(null)
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Items tagged for “{confirmRemove}” will become un-tagged. The items
          themselves stay.
        </p>
      </Modal>

      <Modal
        open={confirmClear}
        title="Clear everything?"
        onClose={() => setConfirmClear(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearAll()
                setConfirmClear(false)
              }}
            >
              Clear all
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This will delete every item and reset owners. Export a backup first
          if you want to be safe.
        </p>
      </Modal>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </h2>
      {children}
    </section>
  )
}
