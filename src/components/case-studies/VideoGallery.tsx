import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

type Video = {
  provider: 'vimeo' | 'youtube';
  id: string;
  title: string;
  thumbnail?: string;
};

interface VideoGalleryProps {
  videos: Video[];
}

const embedUrl = (v: Video) =>
  v.provider === 'vimeo'
    ? `https://player.vimeo.com/video/${v.id}?autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;

const thumbUrl = (v: Video) =>
  v.thumbnail ??
  (v.provider === 'youtube'
    ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`
    : '');

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = videos[activeIndex];
  const total = videos.length;

  const go = (i: number) => {
    if (i < 0 || i >= total) return;
    setActiveIndex(i);
    setPlaying(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') go(activeIndex + 1);
      if (e.key === 'ArrowLeft') go(activeIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, total]);

  if (!videos.length) return null;

  return (
    <div ref={containerRef} className="space-y-4" tabIndex={-1}>
      {/* Featured player */}
      <div className="relative aspect-video overflow-hidden rounded-md bg-black group">
        {playing ? (
          <iframe
            key={`${active.provider}-${active.id}`}
            src={embedUrl(active)}
            title={active.title}
            className="w-full h-full"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group/play"
            aria-label={`Lire : ${active.title}`}
          >
            {thumbUrl(active) && (
              <img
                src={thumbUrl(active)}
                alt={active.title}
                className="w-full h-full object-cover opacity-80 group-hover/play:opacity-100 transition-opacity"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 shadow-lg group-hover/play:scale-105 transition-transform">
                <Play className="w-8 h-8 text-black translate-x-0.5" fill="currentColor" />
              </span>
            </span>
            <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
              <span className="text-sm font-medium drop-shadow line-clamp-2 text-left">
                {active.title}
              </span>
              <span className="text-xs font-mono bg-black/60 px-2 py-1 rounded shrink-0">
                {activeIndex + 1} / {total}
              </span>
            </span>
          </button>
        )}

        {total > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-90">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => go(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Vidéo précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => go(activeIndex + 1)}
              disabled={activeIndex === total - 1}
              aria-label="Vidéo suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnail playlist */}
      {total > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {videos.map((v, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={`${v.provider}-${v.id}`}
                type="button"
                onClick={() => go(i)}
                aria-current={isActive}
                aria-label={`Lire vidéo ${i + 1} : ${v.title}`}
                className={cn(
                  'group relative shrink-0 w-40 md:w-48 text-left transition-all',
                  isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
                )}
              >
                <div className="relative aspect-video overflow-hidden rounded bg-muted">
                  {thumbUrl(v) ? (
                    <img
                      src={thumbUrl(v)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {v.provider}
                    </div>
                  )}
                  <span className="absolute top-1 left-1 flex items-center justify-center w-6 h-6 rounded-full bg-black/80 text-white text-xs font-mono font-semibold">
                    {i + 1}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded">
                      Now playing
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                  {v.title}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
