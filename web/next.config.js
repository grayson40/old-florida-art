/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'via.placeholder.com',
      // Gooten image domains
      'appassets.azureedge.net',
      'gtnadminassets.blob.core.windows.net',
      'gtnassets.azureedge.net',
      // Additional common Gooten domains (just in case)
      'assets.gooten.com',
      'cdn.gooten.com',
      'az412349.cdn.gooten.com'
    ],
  },
}

module.exports = nextConfig 