import { auth } from '@clerk/nextjs/server'
import SharePromptForm from '../../components/SharePromptForm'

export const metadata = {
  title: 'Share a Prompt | PromptCraft',
  description: 'Share your favorite AI coding prompts.'
}

export default async function SharePage() {
  const { userId } = await auth()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Share a Prompt</h1>
      <SharePromptForm userId={userId} />
    </div>
  )
} 