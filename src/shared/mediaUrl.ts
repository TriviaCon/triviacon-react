const MEDIA_PROTOCOL = 'triviacon-media'

/**
 * Convert a media path (stored in DB) to a URL the renderer can use.
 * - Data URIs and http(s) URLs are passed through unchanged.
 * - Relative paths are resolved via the triviacon-media:// protocol.
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${MEDIA_PROTOCOL}://media/${encodeURIComponent(path)}`
}
