import type { BackupFile, Item } from '../types'

export function exportBackup(items: Item[], owners: string[]) {
  const payload: BackupFile = {
    app: 'homestock',
    version: __APP_VERSION__,
    exportedAt: new Date().toISOString(),
    items,
    owners,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const today = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `homestock-backup-${today}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data || data.app !== 'homestock' || !Array.isArray(data.items)) {
    throw new Error('Not a valid HomeStock backup file.')
  }
  return data as BackupFile
}
