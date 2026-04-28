import { useEffect } from 'react'
import { useInventory } from '../store/inventoryStore'

export function useApplyTheme() {
  const theme = useInventory((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      root.classList.toggle('dark', isDark)
    }
    apply()
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])
}
