import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const GIBSON_API_URL = 'https://api.gibsonai.com/v1/-/query'
const GIBSON_API_KEY = process.env.GIBSON_API_KEY!

export async function GET() {
  // Query all prompts with favorite count
  const sql = `
    SELECT p.id, p.uuid, p.text, p.creator_user_id, p.date_created,
      (SELECT COUNT(*) FROM content_prompt_favorite f WHERE f.prompt_id = p.id) AS favorite_count
    FROM content_prompt p
    ORDER BY p.date_created DESC
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
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { text } = await req.json()
  if (!text || typeof text !== 'string' || text.length < 10) {
    return NextResponse.json({ error: 'Prompt text required (min 10 chars)' }, { status: 400 })
  }
  // Insert prompt
  const uuid = crypto.randomUUID()
  const sql = `
    INSERT INTO content_prompt (uuid, text, creator_user_id) VALUES ('${uuid}', ?, '${userId}')
  `
  const res = await fetch(GIBSON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gibson-API-Key': GIBSON_API_KEY,
    },
    body: JSON.stringify({ query: sql.replace('?', JSON.stringify(text)) }),
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: 'Failed to create prompt', detail: err }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 