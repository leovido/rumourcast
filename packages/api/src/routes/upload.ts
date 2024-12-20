import { t } from 'elysia'
import { createElysia } from '../utils'

export const uploadRoutes = createElysia({ prefix: '/upload' }).post(
  '/',
  async ({ body }) => {
    try {
      const { image } = body

      if (!image) {
        throw new Error('No image file provided')
      }

      // Optional: Add file size validation
      if (image.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error('File size exceeds 10MB limit')
      }

      const data = await uploadImage(image)
      return {
        success: true,
        ...data,
      }
    } catch (error) {
      console.error('Upload error:', error)

      if (error instanceof Error) {
        if (error.message.includes('failed to fetch')) {
          throw new Error('Upload service unavailable')
        }
        throw error
      }
      throw new Error('Upload failed')
    }
  },
  {
    body: t.Object({
      image: t.File(),
    }),
    type: 'multipart/form-data',
    error({ error }) {
      if (error instanceof Error) {
        if (error.message.includes('Upload service unavailable')) {
          return {
            success: false,
            error: error.message,
            status: 503,
          }
        }
        if (error.message.includes('File size exceeds')) {
          return {
            success: false,
            error: error.message,
            status: 413,
          }
        }
        if (error.message.includes('No image file')) {
          return {
            success: false,
            error: error.message,
            status: 400,
          }
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        status: 500,
      }
    },
    plugins: {
      // Set maximum file size to 10MB
      maxFileSize: 10 * 1024 * 1024,
    },
  }
)

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch('https://api.uno.fun/v1/uploads', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.UPLOAD_API_KEY ?? '',
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
