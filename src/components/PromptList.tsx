"use client"
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

type Prompt = {
  id: number
  uuid: string
  text: string
  creator_user_id: string
  date_created: string
  favorite_count: number
}

type PromptListProps = {
  prompts: Prompt[]
}

export default function PromptList({ prompts }: PromptListProps) {
  const { isSignedIn, isLoaded } = useUser()
  const [favState, setFavState] = useState<{ [id: number]: boolean }>({})
  const [copyId, setCopyId] = useState<number | null>(null)

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopyId(id)
    setTimeout(() => setCopyId(null), 1200)
  }

  const handleFavorite = async (prompt: Prompt, isFav: boolean) => {
    setFavState((s) => ({ ...s, [prompt.id]: !isFav }))
    const method = isFav ? 'DELETE' : 'POST'
    await fetch('/api/favorites', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_id: prompt.id }),
    })
  }

  if (!isLoaded) return <div className="text-center py-8">Loading...</div>
  if (!prompts?.length) return <div className="text-center py-8">No prompts found.</div>

  return (
    <ul className="space-y-6">
      {prompts.map((prompt) => {
        const isFav = favState[prompt.id] ?? false
        return (
          <li key={prompt.id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-700 text-base break-words flex-1" tabIndex={0} aria-label="Prompt text">{prompt.text}</span>
              <button
                className="ml-2 px-2 py-1 rounded text-xs bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Copy prompt"
                tabIndex={0}
                onClick={() => handleCopy(prompt.text, prompt.id)}
                onKeyDown={e => e.key === 'Enter' && handleCopy(prompt.text, prompt.id)}
              >
                {copyId === prompt.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500" aria-label="Favorite count">❤️ {prompt.favorite_count}</span>
              {isSignedIn && (
                <button
                  className={`px-3 py-1 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${isFav ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  aria-label={isFav ? 'Unfavorite' : 'Favorite'}
                  tabIndex={0}
                  onClick={() => handleFavorite(prompt, isFav)}
                  onKeyDown={e => e.key === 'Enter' && handleFavorite(prompt, isFav)}
                >
                  {isFav ? 'Unfavorite' : 'Favorite'}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
} 