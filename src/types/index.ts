export type CategoryId =
  | 'pantry'
  | 'cookware'
  | 'health'
  | 'medicine'
  | 'appliance'
  | 'personal'
  | 'clothing'
  | 'other'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface Category {
  id: CategoryId
  name: string
  icon: string
  color: string
  bg: string
}

export interface Item {
  id: string
  name: string
  category: CategoryId
  owner?: string
  quantity: number
  unit: string
  dateAdded: string
  expiryDate?: string
  location?: string
  price?: number
  lowStockThreshold?: number
  notes?: string
  updatedAt: string
}

export interface BackupFile {
  app: 'homestock'
  version: string
  exportedAt: string
  items: Item[]
  owners: string[]
}
