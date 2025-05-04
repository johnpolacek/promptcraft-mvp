import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const GIBSON_API_URL = 'https://api.gibsonai.com/v1/-/query'
const GIBSON_API_KEY = process.env.GIBSON_API_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  if (!userId) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 })
  }
  const sql = `
    SELECT p.id, p.uuid, p.text, p.creator_user_id, p.date_created,
      (SELECT COUNT(*) FROM content_prompt_favorite f WHERE f.prompt_id = p.id) AS favorite_count
    FROM content_prompt p
    JOIN content_prompt_favorite f ON f.prompt_id = p.id
    WHERE f.user_id = '${userId}'
    ORDER BY f.created_at DESC
  `
  const res = await fetch(GIBSON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gibson-API-Key': GIBSON_API_KEY,
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { prompt_id } = await req.json()
  if (!prompt_id || typeof prompt_id !== 'number') {
    return NextResponse.json({ error: 'prompt_id required (number)' }, { status: 400 })
  }
  const uuid = crypto.randomUUID()
  const sql = `
    INSERT INTO content_prompt_favorite (uuid, user_id, prompt_id) VALUES ('${uuid}', '${userId}', ${prompt_id})
  `
  const res = await fetch(GIBSON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gibson-API-Key': GIBSON_API_KEY,
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: 'Failed to add favorite', detail: err }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { prompt_id } = await req.json()
  if (!prompt_id || typeof prompt_id !== 'number') {
    return NextResponse.json({ error: 'prompt_id required (number)' }, { status: 400 })
  }
  const sql = `
    DELETE FROM content_prompt_favorite WHERE user_id = '${userId}' AND prompt_id = ${prompt_id}
  `
  const res = await fetch(GIBSON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gibson-API-Key': GIBSON_API_KEY,
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: 'Failed to remove favorite', detail: err }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 