import Feed from '@/components/post/Feed'

export default async function HomePage() {
  // Public page - no auth required to view feed
  return (
    <div className="min-h-screen relative">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 pt-6 pb-24 space-y-6">
        <Feed />
      </div>
    </div>
  )
}
