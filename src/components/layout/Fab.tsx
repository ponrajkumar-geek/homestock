import { Link, useLocation } from 'react-router-dom'

export function Fab() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/items/new') || pathname.endsWith('/edit')) {
    return null
  }
  return (
    <Link
      to="/items/new"
      aria-label="Add item"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-3xl text-white shadow-lg transition hover:bg-brand-700 active:scale-95"
    >
      <span className="-mt-1">+</span>
    </Link>
  )
}
