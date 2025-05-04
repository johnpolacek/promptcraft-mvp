"use client"
import { useState } from 'react'
import { SignInButton } from '@clerk/nextjs'

type SharePromptFormProps = {
  userId?: string | null
}

export default function SharePromptForm({ userId }: SharePromptFormProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!userId) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Sign in to Continue</h2>
          <p className="text-muted-foreground">Create an account or sign in to share a prompt</p>
        </div>
        <SignInButton mode="modal">
          <button className="px-6 py-2 rounded bg-blue-600 text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500">Sign in to Continue</button>
        </SignInButton>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setText('')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to share prompt')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <label htmlFor="prompt" className="block font-medium text-gray-700">Prompt</label>
      <textarea
        id="prompt"
        className="w-full min-h-[100px] p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={text}
        onChange={e => setText(e.target.value)}
        required
        minLength={10}
        aria-label="Prompt text"
        tabIndex={0}
        disabled={loading}
      />
      <button
        type="submit"
        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={loading || text.length < 10}
        aria-label="Share prompt"
        tabIndex={0}
      >
        {loading ? 'Sharing...' : 'Share Prompt'}
      </button>
      {success && <div className="text-green-600">Prompt shared successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  )
} 