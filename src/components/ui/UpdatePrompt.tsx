import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { registerSW } from 'virtual:pwa-register'

export function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateSW, setUpdateSW] = useState<
    ((reload?: boolean) => Promise<void>) | null
  >(null)

  useEffect(() => {
    const fn = registerSW({
      onNeedRefresh() { setNeedRefresh(true) },
      immediate: true,
    })
    setUpdateSW(() => fn)
    const id = setInterval(() => fn(), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!needRefresh) return null

  return createPortal(
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '5.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
      className="flex items-center gap-3 rounded-lg bg-brand-600 px-4 py-3 text-sm text-white shadow-xl whitespace-nowrap"
    >
      <span>✨ New version available</span>
      <button
        onClick={() => updateSW?.(true)}
        className="rounded bg-white/20 px-2 py-1 font-semibold hover:bg-white/30"
      >
        Reload
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        className="text-white/70 hover:text-white"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>,
    document.body,
  )
}
