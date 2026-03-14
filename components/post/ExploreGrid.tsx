'use client'

import Link from 'next/link'
import { mockPosts } from '@/lib/mock/posts'

export default function ExploreGrid() {
  const items = [...mockPosts, ...mockPosts].map((p, idx) => ({
    ...p,
    _id: `${p.id}_${idx}`,
  }))

  if (items.length === 0) {
    return (
      <div className="glass-card flex items-center justify-center py-12 text-sm text-muted">
        Nothing to explore yet.
      </div>
    )
  }

  return (
    <section
      aria-label="Explore"
      className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[210px] md:grid-cols-4"
    >
      {items.map((post, index) => {
        const spanClass =
          index % 5 === 0
            ? 'md:col-span-2 md:row-span-2'
            : index % 5 === 2
            ? 'md:col-span-2 md:row-span-1'
            : 'md:col-span-1 md:row-span-1'

        return (
          <Link
            key={post._id}
            href={`/post/${post.id}`}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-black/70 ${spanClass}`}
          >
            <div className="relative h-full w-full origin-center transition-transform duration-300 ease-out group-hover:scale-[1.03] group-hover:[transform:perspective(900px)_rotateX(6deg)_rotateY(-4deg)]">
              {post.file_type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.shelby_file_url}
                  alt={post.caption || 'Post'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={post.shelby_file_url}
                  className="h-full w-full object-cover"
                  muted
                  loop
                />
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between text-[11px] text-slate-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {post.user?.username || 'creator'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
                {post.likes_count || 0} ♥
              </span>
            </div>
          </Link>
        )
      })}
    </section>
  )
}

