export interface ChangelogEntry {
  version: string
  date: string
  changes: { summary: string; files: string[] }[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.1.1',
    date: '2026-04-28',
    changes: [
      { summary: 'PWA polls every 60s — updates appear automatically on all devices', files: ['src/components/ui/UpdatePrompt.tsx'] },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-04-28',
    changes: [
      {
        summary:
          'Initial launch — dashboard, 8 categories, owners, add/edit/delete, expiry & low-stock alerts, search & filters, dark mode, JSON export/import, PWA with auto-update banner.',
        files: ['src/'],
      },
    ],
  },
]
