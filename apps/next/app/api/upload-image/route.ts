import { NextResponse } from 'next/server'

export const runtime = 'edge'

const API_URL = 'https://api.imgbb.com/1/upload'
const UPLOAD_API_KEY = process.env.UPLOAD_API_KEY ?? '' // Add your own API key here

async function uploadImage(file: FormDataEntryValue) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': UPLOAD_API_KEY,
      Accept: 'application/json',
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upload failed: ${errorText}`)
  }

  return response.json()
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      )
    }

    const data = await uploadImage(file)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Upload error:', error)

    if (error instanceof Error && error.message.includes('failed to fetch')) {
      return NextResponse.json(
        { success: false, error: 'Upload service unavailable' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

