import { useTranslation } from 'react-i18next'
import { Maximize, Play, Pause, Square } from 'lucide-react'
import { detectMediaType } from '@shared/media'
import { mediaUrl } from '@shared/mediaUrl'
import { Button } from '@renderer/components/ui/button'
import { cn } from '@renderer/lib/utils'

// ── Playback controls (audio / video via IPC) ──────────────────────

export const PlaybackControls = ({ mediaType }: { mediaType: 'audio' | 'video' }) => (
  <div className="flex gap-1">
    <Button size="sm" variant="outline" onClick={() => window.api.mediaPlay()}>
      <Play className="h-4 w-4" />
    </Button>
    <Button size="sm" variant="outline" onClick={() => window.api.mediaPause()}>
      <Pause className="h-4 w-4" />
    </Button>
    <Button size="sm" variant="outline" onClick={() => window.api.mediaStop()}>
      <Square className="h-4 w-4" />
    </Button>
    {mediaType === 'video' && (
      <Button size="sm" variant="outline" onClick={() => window.api.mediaToggleFullscreen()}>
        <Maximize className="h-4 w-4" />
      </Button>
    )}
  </div>
)

export const MediaControls = ({ mediaType }: { mediaType: 'audio' | 'video' }) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground mb-2 block">
        {mediaType === 'audio' ? t('runner.audioControls') : t('runner.videoControls')}
      </span>
      <PlaybackControls mediaType={mediaType} />
    </div>
  )
}

// ── MediaPreview ───────────────────────────────────────────────────

interface MediaPreviewProps {
  /** Raw media filename / UUID stored in the quiz document. */
  media: string | null | undefined
  /** Show a fullscreen button below images. Default: false */
  fullscreenButton?: boolean
  /** Show IPC playback controls for audio/video. Default: false */
  playbackControls?: boolean
  /** Extra classes on the img element. */
  imageClassName?: string
  className?: string
}

/**
 * Renders a media preview for a question attachment.
 *
 * - image  → <img> (+ optional fullscreen button)
 * - audio/video + playbackControls → IPC-driven <MediaControls>
 * - audio/video - playbackControls → text badge
 * - no media / unknown type → null
 */
export function MediaPreview({
  media,
  fullscreenButton = false,
  playbackControls = false,
  imageClassName,
  className
}: MediaPreviewProps) {
  const { t } = useTranslation()
  const mediaType = detectMediaType(media ?? null)
  const src = mediaUrl(media ?? null)

  if (!src || !mediaType) return null

  if (mediaType === 'image') {
    return (
      <div className={cn('space-y-2', className)}>
        <img src={src} className={cn('max-w-[200px] rounded', imageClassName)} alt="" />
        {fullscreenButton && (
          <Button size="sm" variant="outline" onClick={() => window.api.mediaToggleFullscreen()}>
            <Maximize className="h-4 w-4 mr-1" /> {t('actions.fullscreen')}
          </Button>
        )}
      </div>
    )
  }

  if (mediaType === 'audio' || mediaType === 'video') {
    if (playbackControls) return <MediaControls mediaType={mediaType} />
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        {mediaType} — {media}
      </p>
    )
  }

  return null
}
