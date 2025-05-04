import { auth } from '@clerk/nextjs/server'
import PromptList from '../../components/PromptList'
import { SignInButton } from '@clerk/nextjs'

export const metadata = {
  title: 'Favorites | PromptCraft',
  description: 'Your favorited AI coding prompts.'
}

export default async function FavoritesPage() {
  const { userId } = await auth()
  if (!userId) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Sign in to View Favorites</h2>
          <p className="text-muted-foreground">Sign in to see your favorited prompts</p>
        </div>
        <SignInButton mode="modal">
          <button className="px-6 py-2 rounded bg-blue-600 text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">Sign in to Continue</button>
        </SignInButton>
      </div>
    )
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorites?user_id=${userId}`, { cache: 'no-store' })
  const prompts = await res.json()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      <PromptList prompts={prompts} />
    </div>
  )
} 