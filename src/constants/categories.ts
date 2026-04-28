import type { Category, CategoryId } from '../types'

export const CATEGORIES: Category[] = [
  {
    id: 'pantry',
    name: 'Pantry & Groceries',
    icon: '🥫',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    id: 'cookware',
    name: 'Cookware & Utensils',
    icon: '🍳',
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
  },
  {
    id: 'health',
    name: 'Health & Nutrition',
    icon: '🥜',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  {
    id: 'medicine',
    name: 'Medicines & Tablets',
    icon: '💊',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-100 dark:bg-rose-900/40',
  },
  {
    id: 'appliance',
    name: 'Appliances & Electronics',
    icon: '🔌',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: '🧴',
    color: 'text-fuchsia-700 dark:text-fuchsia-300',
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
  },
  {
    id: 'clothing',
    name: 'Clothing & Accessories',
    icon: '👕',
    color: 'text-violet-700 dark:text-violet-300',
    bg: 'bg-violet-100 dark:bg-violet-900/40',
  },
  {
    id: 'other',
    name: 'Other / Misc',
    icon: '📦',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-200 dark:bg-slate-800',
  },
]

const CATEGORY_MAP = new Map<CategoryId, Category>(
  CATEGORIES.map((c) => [c.id, c]),
)

export function getCategory(id: CategoryId): Category {
  return CATEGORY_MAP.get(id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export const DEFAULT_OWNERS = [
  'Family / Shared',
  'Papa',
  'Wife',
  'Me',
  'Baby',
  'Brother',
]

export const COMMON_UNITS = [
  'pcs',
  'pack',
  'bottle',
  'box',
  'kg',
  'g',
  'L',
  'ml',
  'tablets',
  'strips',
]
