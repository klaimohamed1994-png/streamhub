/**
 * AdSlots — pre-configured, named ad placements used throughout the app.
 *
 * Each exported component wraps <AdUnit> with the correct slot ID, format,
 * and layout styles so call-sites stay clean:
 *
 *   <AdBanner />           — full-width leaderboard between sections
 *   <AdRectangle />        — 300×250 sidebar / inline rectangle
 *   <AdInArticle />        — native in-article unit
 *   <AdInFeed />           — native in-feed unit
 *   <AdMobileBanner />     — mobile-only 320×50 banner (hidden on desktop)
 *   <AdStickyBottom />     — fixed bottom banner (mobile)
 *
 * Slot IDs
 * --------
 * Replace every SLOT_* constant with the real slot IDs from your AdSense
 * dashboard (Account › Sites › Ad units).  The publisher ID is read from
 * the NEXT_PUBLIC_ADSENSE_PUBLISHER_ID environment variable.
 */

'use client';

import clsx from 'clsx';
import { AdUnit } from './AdUnit';

// ─── Slot IDs — replace with real values from AdSense dashboard ───────────────
const SLOT_BANNER        = '1671839153'; // Leaderboard  728×90
const SLOT_RECTANGLE     = '1350486519'; // Rectangle    300×250
const SLOT_IN_ARTICLE    = '9881501665'; // In-article   native
const SLOT_IN_FEED       = '7756077372'; // In-feed      native
const SLOT_MOBILE_BANNER = '7863888587'; // Mobile       320×50
const SLOT_HALF_PAGE     = '3924643572'; // Half-page    300×600

// ─── Full-width banner (leaderboard) between page sections ────────────────────
export function AdBanner({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full flex justify-center py-2', className)}>
      {/* Desktop: 728×90 leaderboard */}
      <div className="hidden md:block">
        <AdUnit slot={SLOT_BANNER} format="leaderboard" label />
      </div>
      {/* Mobile: 320×50 banner */}
      <div className="block md:hidden">
        <AdUnit slot={SLOT_MOBILE_BANNER} format="mobile_banner" label />
      </div>
    </div>
  );
}

// ─── Medium rectangle (300×250) ───────────────────────────────────────────────
export function AdRectangle({ className }: { className?: string }) {
  return (
    <div className={clsx('flex justify-center py-2', className)}>
      <AdUnit slot={SLOT_RECTANGLE} format="rectangle" label />
    </div>
  );
}

// ─── Half-page (300×600) ─────────────────────────────────────────────────────
export function AdHalfPage({ className }: { className?: string }) {
  return (
    <div className={clsx('flex justify-center py-2', className)}>
      <AdUnit slot={SLOT_HALF_PAGE} format="half_page" label />
    </div>
  );
}

// ─── Native in-article ───────────────────────────────────────────────────────
export function AdInArticle({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full py-4', className)}>
      <AdUnit slot={SLOT_IN_ARTICLE} format="in_article" label responsive />
    </div>
  );
}

// ─── Native in-feed ──────────────────────────────────────────────────────────
export function AdInFeed({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full py-4', className)}>
      <AdUnit slot={SLOT_IN_FEED} format="in_feed" label responsive />
    </div>
  );
}

// ─── Responsive auto ad (fills available width) ──────────────────────────────
export function AdResponsive({ className }: { className?: string }) {
  return (
    <div className={clsx('w-full py-2', className)}>
      <AdUnit slot={SLOT_BANNER} format="auto" responsive label />
    </div>
  );
}

// ─── Sticky bottom mobile banner ─────────────────────────────────────────────
// Rendered inside a fixed container — include only once per page.
export function AdStickyBottom() {
  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-40
        flex justify-center items-center
        bg-[#0a0a0f]/90 backdrop-blur-sm
        border-t border-[#2a2a3a]
        py-1 px-2
        md:hidden
      "
      aria-label="Advertisement"
    >
      <AdUnit slot={SLOT_MOBILE_BANNER} format="mobile_banner" />
    </div>
  );
}
