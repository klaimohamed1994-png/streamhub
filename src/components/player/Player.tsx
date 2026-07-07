'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  buildMovieEmbedUrl,
  buildTVEmbedUrl,
  buildAnimeEmbedUrl,
  EMBED_SERVERS,
} from '@/lib/embed';
import type { EmbedOptions, EmbedServer } from '@/types';
import { Server, Settings2, RotateCcw, ExternalLink } from 'lucide-react';

// ─── Movie Player ─────────────────────────────────────────────────────────────

interface MoviePlayerProps {
  tmdbId: number;
  options?: EmbedOptions;
}

export function MoviePlayer({ tmdbId, options }: MoviePlayerProps) {
  const [server, setServer] = useState<EmbedServer | undefined>(options?.server);
  const [startAt, setStartAt] = useState<number | undefined>(options?.startAt);

  const url = buildMovieEmbedUrl(tmdbId, { ...options, server, startAt });

  return (
    <PlayerShell
      url={url}
      server={server}
      onServerChange={setServer}
      onRestart={() => setStartAt(0)}
    />
  );
}

// ─── TV Player ────────────────────────────────────────────────────────────────

interface TVPlayerProps {
  tmdbId: number;
  season: number;
  episode: number;
  options?: EmbedOptions;
  onPrevEpisode?: () => void;
  onNextEpisode?: () => void;
}

export function TVPlayer({
  tmdbId,
  season,
  episode,
  options,
  onPrevEpisode,
  onNextEpisode,
}: TVPlayerProps) {
  const [server, setServer] = useState<EmbedServer | undefined>(options?.server);

  const url = buildTVEmbedUrl(tmdbId, season, episode, {
    ...options,
    server,
    controls: {
      ...options?.controls,
      prevepisode: !!onPrevEpisode,
      nextepisode: !!onNextEpisode,
    },
  });

  return (
    <PlayerShell
      url={url}
      server={server}
      onServerChange={setServer}
      label={`S${String(season).padStart(2, '0')} E${String(episode).padStart(2, '0')}`}
    />
  );
}

// ─── Anime Player ─────────────────────────────────────────────────────────────

interface AnimePlayerProps {
  anilistId: number;
  episode: number;
  subOrDub: 'sub' | 'dub';
  pahe?: boolean;
  options?: EmbedOptions;
}

export function AnimePlayer({
  anilistId,
  episode,
  subOrDub,
  pahe = false,
  options,
}: AnimePlayerProps) {
  const [server, setServer] = useState<EmbedServer | undefined>(options?.server);
  const [mode, setMode] = useState<'sub' | 'dub'>(subOrDub);
  const [source, setSource] = useState<'gogoanime' | 'animepahe'>(pahe ? 'animepahe' : 'gogoanime');

  const url =
    source === 'animepahe'
      ? buildAnimeEmbedUrl(anilistId, episode, mode, { ...options, server })
      : buildAnimeEmbedUrl(anilistId, episode, mode, { ...options, server });

  return (
    <div>
      {/* Sub / Dub / Source toggles */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center bg-[#1a1a24] border border-[#2a2a3a] rounded-lg overflow-hidden text-sm">
          {(['sub', 'dub'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 font-medium capitalize transition-all ${
                mode === m
                  ? 'bg-[#6c63ff] text-white'
                  : 'text-[#8888aa] hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-[#1a1a24] border border-[#2a2a3a] rounded-lg overflow-hidden text-sm">
          {(['gogoanime', 'animepahe'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-4 py-2 font-medium transition-all ${
                source === s
                  ? 'bg-[#6c63ff] text-white'
                  : 'text-[#8888aa] hover:text-white'
              }`}
            >
              {s === 'gogoanime' ? 'GogoAnime' : 'AnimePahe'}
            </button>
          ))}
        </div>
      </div>

      <PlayerShell
        url={url}
        server={server}
        onServerChange={setServer}
        label={`Episode ${episode}`}
      />
    </div>
  );
}

// ─── Shell (shared UI around every player) ────────────────────────────────────

interface PlayerShellProps {
  url: string;
  server?: EmbedServer;
  onServerChange: (s: EmbedServer) => void;
  label?: string;
  onRestart?: () => void;
}

function PlayerShell({ url, server, onServerChange, label, onRestart }: PlayerShellProps) {
  const [showServers, setShowServers] = useState(false);
  const [key, setKey] = useState(0);

  const reload = useCallback(() => setKey((k) => k + 1), []);

  return (
    <div className="space-y-2">
      {/* Controls bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {label && (
          <span className="text-xs font-medium text-[#8888aa] bg-[#1a1a24] border border-[#2a2a3a] px-2 py-1 rounded-md">
            {label}
          </span>
        )}

        {/* Server picker */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowServers((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#8888aa] hover:text-white bg-[#1a1a24] border border-[#2a2a3a] px-3 py-1.5 rounded-lg transition-all hover:border-[#6c63ff]/60"
          >
            <Server size={12} />
            {server ? server.charAt(0).toUpperCase() + server.slice(1) : 'Auto'}
          </button>

          {showServers && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl shadow-2xl p-2 min-w-[160px] animate-fade-in">
              <p className="text-[10px] text-[#8888aa] uppercase font-semibold tracking-wider px-2 py-1">
                Select Server
              </p>
              <button
                onClick={() => { onServerChange(undefined as unknown as EmbedServer); setShowServers(false); reload(); }}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  !server ? 'text-[#8b84ff] bg-[#6c63ff]/10' : 'text-[#8888aa] hover:text-white hover:bg-[#22222f]'
                }`}
              >
                Auto
              </button>
              {EMBED_SERVERS.map((s) => (
                <button
                  key={s}
                  onClick={() => { onServerChange(s); setShowServers(false); reload(); }}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    server === s
                      ? 'text-[#8b84ff] bg-[#6c63ff]/10'
                      : 'text-[#8888aa] hover:text-white hover:bg-[#22222f]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reload */}
        <button
          onClick={reload}
          title="Reload player"
          className="p-1.5 text-[#8888aa] hover:text-white bg-[#1a1a24] border border-[#2a2a3a] rounded-lg transition-all hover:border-[#6c63ff]/60"
        >
          <RotateCcw size={13} />
        </button>

        {/* Open in new tab */}
        {/* <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in new tab"
          className="p-1.5 text-[#8888aa] hover:text-white bg-[#1a1a24] border border-[#2a2a3a] rounded-lg transition-all hover:border-[#6c63ff]/60"
        >
          <ExternalLink size={13} />
        </a> */}
      </div>

      {/* iframe */}
      <div className="player-wrapper shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <iframe
          key={`${url}-${key}`}
          src={url}
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          className="rounded-xl"
        />
        {/* Blocks double-click fullscreen — see DblClickBlocker below */}
        <DblClickBlocker />
      </div>
    </div>
  );
}

// ─── DblClickBlocker ──────────────────────────────────────────────────────────
//
// How it works
// ────────────
// Browsers fire native fullscreen on <iframe> when the user double-clicks
// inside it.  We can't intercept events inside a cross-origin iframe, but we
// CAN place a transparent div on top and play a timing trick:
//
//   1. Overlay sits with pointer-events: none  →  all events pass to the iframe
//      (play, pause, seek, volume work normally on single click).
//
//   2. On mousedown we start a 300 ms timer and flip the overlay to
//      pointer-events: auto.  This means if a SECOND click arrives within
//      300 ms (i.e. a double-click), the overlay — not the iframe — receives
//      it and calls preventDefault() + stopPropagation(), suppressing the
//      fullscreen trigger.
//
//   3. If no second click arrives within 300 ms we flip back to
//      pointer-events: none so the user's interaction is uninterrupted.
//
// The result: single clicks reach the iframe normally; double-clicks are
// silently swallowed before the browser acts on them.

function DblClickBlocker() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    function arm() {
      // Enable overlay so the next click (if fast enough) hits us, not iframe
      el!.style.pointerEvents = 'auto';
      // Automatically disarm after the double-click window
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        el!.style.pointerEvents = 'none';
      }, 300);
    }

    function blockDbl(e: MouseEvent) {
      // A second mousedown arrived while we were armed → it's a double-click
      e.preventDefault();
      e.stopPropagation();
      el!.style.pointerEvents = 'none';
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    // We listen on the *parent* (player-wrapper) for the first mousedown
    // so we arm before the event reaches the iframe.
    const parent = el.parentElement;
    if (parent) parent.addEventListener('mousedown', arm);

    // The overlay itself catches the second mousedown (the double-click)
    el.addEventListener('mousedown', blockDbl);

    return () => {
      if (parent) parent.removeEventListener('mousedown', arm);
      el.removeEventListener('mousedown', blockDbl);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none', // starts transparent to events
        background: 'transparent',
      }}
    />
  );
}
