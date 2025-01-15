import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RumourCast',
    short_name: 'Rumour',
    description: 'Anonymous Rumours..',
    start_url: '/',
    display: 'standalone',
    background_color: '#191919',
    theme_color: '#191919',
    icons: [
      {
        src: '/public/icons192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/icons512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
