'use client';

/**
 * AdUnit — renders a single Google AdSense <ins> slot.
 *
 * Usage
 * -----
 * // Auto-size (responsive):
 * <AdUnit slot="1234567890" format="auto" responsive />
 *
 * // Fixed rectangle:
 * <AdUnit slot="1234567890" format="rectangle" />
 *
 * // Leaderboard (728×90) with a labelled wrapper:
 * <AdUnit slot="1234567890" format="leaderboard" label />
 *
 * Environment
 * -----------
 * Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-4337784950654838 in .env.local
 * The script tag is injected once from RootLayout via <AdSenseScript />.
 */

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

// ─── Ad format dimensions ─────────────────────────────────────────────────────

const FORMAT_SIZES = {
  auto: null,           // responsive — no fixed dimensions
  rectangle: { width: 300, height: 250 },   // medium rectangle
  leaderboard: { width: 728, height: 90 },  // leaderboard
  banner: { width: 468, height: 60 },       // banner
  large_rectangle: { width: 336, height: 280 },
  skyscraper: { width: 120, height: 600 },
  wide_skyscraper: { width: 160, height: 600 },
  half_page: { width: 300, height: 600 },
  billboard: { width: 970, height: 250 },
  mobile_banner: { width: 320, height: 50 },
  in_feed: null,        // native — no fixed dimensions
  in_article: null,     // native — no fixed dimensions
  matched_content: null,
} as const;

export type AdFormat = keyof typeof FORMAT_SIZES;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AdUnitProps {
  /** AdSense ad-slot ID (the 10-digit number from your AdSense dashboard) */
  slot: string;
  /** Ad format — controls which ins attributes and dimensions are applied */
  format?: AdFormat;
  /** Whether to add data-full-width-responsive="true" (for responsive auto ads) */
  responsive?: boolean;
  /** Optional className for the outer wrapper div */
  className?: string;
  /** Show a subtle "Advertisement" label above the unit */
  label?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdUnit({
  slot,
  format = 'auto',
  responsive = false,
  className,
  label = false,
}: AdUnitProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Guard: only push once per mount, only if adsbygoogle is available
    if (pushed.current) return;
    if (!publisherId || publisherId === 'ca-pub-4337784950654838') return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (err) {
      // AdSense not loaded yet — safe to swallow; the script will
      // pick up un-pushed slots when it initialises.
      console.warn('[AdUnit] adsbygoogle.push() skipped:', err);
    }
  }, [publisherId]);

  // Don't render at all if no publisher ID is configured
  if (!publisherId || publisherId === 'ca-pub-4337784950654838') {
    return <AdPlaceholder format={format} label={label} className={className} />;
  }

  const sizes = FORMAT_SIZES[format];
  const isNative = format === 'in_feed' || format === 'in_article' || format === 'matched_content';

  return (
    <div className={clsx('overflow-hidden', className)}>
      {label && (
        <p className="text-[10px] text-[#8888aa]/60 text-center uppercase tracking-widest mb-1 select-none">
          Advertisement
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={
          sizes
            ? { display: 'inline-block', width: sizes.width, height: sizes.height }
            : { display: 'block' }
        }
        data-ad-client={publisherId}
        data-ad-slot={slot}
        {...(format === 'auto' || responsive
          ? { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' }
          : isNative
          ? { 'data-ad-format': format.replace('_', '-') }
          : {})}
      />
    </div>
  );
}

// ─── Dev placeholder (renders when no publisher ID set) ───────────────────────

function AdPlaceholder({
  format,
  label,
  className,
}: {
  format: AdFormat;
  label: boolean;
  className?: string;
}) {
  const sizes = FORMAT_SIZES[format];

  return (
    <div className={clsx('overflow-hidden', className)}>
      {label && (
        <p className="text-[10px] text-[#8888aa]/60 text-center uppercase tracking-widest mb-1 select-none">
          Advertisement
        </p>
      )}
      <div
        className="flex items-center justify-center bg-[#1a1a24] border border-dashed border-[#2a2a3a] rounded-lg text-[#8888aa]/50 text-xs select-none"
        style={
          sizes
            ? { width: sizes.width, height: sizes.height }
            : { width: '100%', height: 90 }
        }
      >
        Ad ({format})
      </div>
    </div>
  );
}
