'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

type BottomItem = {
  key: string
  href: string
  label: string
  icon: React.ReactNode
  match?: (pathname: string) => boolean
}

function IconHome(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 10.25 12 3l8.5 7.25" />
      <path d="M6 10v10h12V10" />
    </svg>
  )
}

function IconSearch(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function IconPlus(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function IconExplore(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m9 15 1.5-4.5L15 9l-1.5 4.5L9 15Z" />
    </svg>
  )
}

function IconProfile(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="3.2" />
      <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()

  const items: BottomItem[] = [
    {
      key: 'home',
      href: '/',
      label: 'Home',
      icon: <IconHome className="w-5 h-5" />,
      match: (p) => p === '/',
    },
    {
      key: 'explore',
      href: '/explore',
      label: 'Explore',
      icon: <IconExplore className="w-5 h-5" />,
    },
    {
      key: 'create',
      href: '/create',
      label: 'Create',
      icon: <IconPlus className="w-6 h-6" />,
      match: (p) => p.startsWith('/create'),
    },
    {
      key: 'search',
      href: '/search',
      label: 'Search',
      icon: <IconSearch className="w-5 h-5" />,
    },
    {
      key: 'profile',
      href: '/profile/mock',
      label: 'Profile',
      icon: <IconProfile className="w-5 h-5" />,
      match: (p) => p.startsWith('/profile'),
    },
  ]

  return (
    <nav
      aria-label="Primary bottom navigation"
      className="glass-card mx-4 mb-4 mt-2 border-border/60 bg-surface/90 backdrop-blur-xl shadow-[0_18px_80px_rgba(15,23,42,0.9)]"
    >
      <div className="flex items-center justify-between px-4 py-2">
        {items.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href
          return (
            <Link
              key={item.key}
              href={item.href as any}
              className={clsx(
                'group flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition-all duration-200 ease-out',
                active
                  ? 'text-brand-strong bg-white/5 shadow-[0_10px_30px_rgba(34,197,94,0.45)]'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-2xl border border-transparent transition-all duration-200',
                  active
                    ? 'bg-gradient-to-tr from-emerald-400/20 via-sky-400/20 to-fuchsia-400/20 border-emerald-300/70'
                    : 'border-transparent group-hover:border-emerald-300/40'
                )}
              >
                {item.icon}
              </span>
              <span className="text-[11px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

