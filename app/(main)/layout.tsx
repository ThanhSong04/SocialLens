import type { ReactNode } from 'react'
import LeftSidebar from '@/components/ig/layout/LeftSidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop / tablet sidebar */}
      <div className="hidden md:block">
        <LeftSidebar />
      </div>

      {/* Main content + mobile bottom nav */}
      <div className="md:pl-[244px] min-h-screen flex flex-col">
        <main className="flex-1 relative overflow-hidden">
          {/* Subtle background glow layer for main area */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(900px_circle_at_10%_-10%,rgba(56,189,248,0.26),transparent_60%),radial-gradient(900px_circle_at_90%_110%,rgba(74,222,128,0.26),transparent_55%)]" />
          {children}
        </main>

        {/* Mobile bottom nav */}
        <div className="md:hidden sticky bottom-0 z-40">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}

