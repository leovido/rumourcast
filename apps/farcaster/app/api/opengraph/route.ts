import { NextRequest, NextResponse } from 'next/server'
import ogs from 'open-graph-scraper'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const options = { url }
    const { error, result } = await ogs(options)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch OpenGraph data' },
        { status: 500 }
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
