import { auth } from '@clerk/nextjs/server'
import PromptList from '../../components/PromptList'

export const metadata = {
  title: 'Browse Prompts | PromptCraft',
  description: 'Browse and discover AI coding prompts.'
}

export default async function BrowsePage() {
  await auth() // still triggers Clerk, but userId not needed here
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts`, { cache: 'no-store' })
  const prompts = await res.json()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Prompts</h1>
      <PromptList prompts={prompts} />
    </div>
  )
} 