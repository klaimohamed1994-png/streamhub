# StreamHub

A full-featured streaming platform built with **Next.js 14** that embeds movies, TV shows, and anime via the **VidNest API**. Content metadata is fetched from **TMDB** (The Movie Database) and **Anilist**.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS |
| Movie/TV Data | TMDB REST API |
| Anime Data | Anilist GraphQL API |
| Embed Player | VidNest (`vidnest.fun`) |
| Language | TypeScript |

---

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd streamhub
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_VIDNEST_BASE_URL=https://vidnest.fun
```

**Get your TMDB API key:**
1. Go to https://www.themoviedb.org/
2. Create an account
3. Settings → API → Create (Developer)
4. Copy your API Key (v3 auth)

> **Anilist** doesn't require an API key — it's publicly accessible via GraphQL.

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
src/
├── app/
│   ├── (routes)/
│   │   ├── movie/[id]/       # Movie detail + player
│   │   ├── tv/[id]/          # TV show detail + episode selector + player
│   │   ├── anime/
│   │   │   ├── page.tsx      # Anime browse
│   │   │   └── [id]/         # Anime detail + episode picker + player
│   │   ├── movies/           # Movies browse
│   │   ├── shows/            # TV Shows browse
│   │   └── search/           # Search page
│   ├── api/
│   │   ├── search/           # Search endpoint
│   │   └── tv/[id]/season/[season]/  # Season details endpoint
│   ├── layout.tsx            # Root layout (Navbar + Footer)
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles + CSS variables
│   └── not-found.tsx
├── components/
│   ├── player/
│   │   └── Player.tsx        # MoviePlayer, TVPlayer, AnimePlayer
│   └── ui/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── HeroBanner.tsx
│       ├── MediaCard.tsx
│       ├── AnimeCard.tsx
│       ├── MediaSection.tsx
│       ├── AnimeSection.tsx
│       └── Skeletons.tsx
├── lib/
│   ├── tmdb.ts               # TMDB API client
│   ├── anilist.ts            # Anilist GraphQL client
│   └── embed.ts              # VidNest URL builder
└── types/
    └── index.ts              # All TypeScript types
```

---

## VidNest Embed API

### URL Patterns

| Type | URL |
|---|---|
| Movie | `https://vidnest.fun/movie/[TMDB_ID]` |
| TV Show | `https://vidnest.fun/tv/[TMDB_ID]/[SEASON]/[EPISODE]` |
| Anime | `https://vidnest.fun/anime/[ANILIST_ID]/[EPISODE]/[sub\|dub]` |
| AnimePahe | `https://vidnest.fun/animepahe/[ANILIST_ID]/[EPISODE]/[sub\|dub]` |

### Query Parameters

| Param | Description |
|---|---|
| `server` | Force server: `lamda`, `primesrc`, `sigma`, `alfa`, `beta`, `gama`, `catflix`, `hexa`, `delta` |
| `startAt` | Start playback at N seconds |
| `progress` | Start from N seconds (alias) |
| `servericon=hide` | Hide server icon |
| `topcaption=hide` | Hide top captions |
| `timeslider=hide` | Hide time slider |
| `fullscreen=hide` | Hide fullscreen button |
| `prevepisode=hide` | Hide prev episode (TV only) |
| `nextepisode=hide` | Hide next episode (TV only) |
| *(and more)* | See `/src/lib/embed.ts` for all controls |

### Usage in Code

```typescript
import { buildMovieEmbedUrl, buildTVEmbedUrl, buildAnimeEmbedUrl } from '@/lib/embed';

// Movie
const url = buildMovieEmbedUrl(666243, { server: 'gama', startAt: 120 });

// TV
const url = buildTVEmbedUrl(94997, 1, 1, { server: 'alfa' });

// Anime
const url = buildAnimeEmbedUrl(154587, 1, 'sub');

// With hidden controls
const url = buildMovieEmbedUrl(666243, {
  controls: { servericon: false, fullscreen: false }
});
```

---

## Features

- **🏠 Home page** — Hero banner + trending sections for movies, TV, and anime
- **🎬 Movie pages** — Full metadata, cast, player with server switcher
- **📺 TV Show pages** — Season/episode selector, episode cards, player with nav
- **🌸 Anime pages** — Episode grid with pagination, sub/dub toggle, AnimeGogo + AnimePahe source toggle
- **🔍 Search** — Debounced multi-search across movies and TV
- **🖥 Multiple servers** — Dropdown to switch between all 9 VidNest servers
- **📱 Responsive** — Mobile-first design
- **⚡ ISR** — Pages revalidate every 1 hour
- **🎨 Dark theme** — Custom design system with accent purple (`#6c63ff`)

---

## Deploy to Vercel

```bash
vercel deploy
```

Add `NEXT_PUBLIC_TMDB_API_KEY` in Vercel environment variables.

---

## Google AdSense Integration

### How it works

AdSense is wired up across three layers:

| Layer | File | Purpose |
|---|---|---|
| Script loader | `src/components/ads/AdSenseScript.tsx` | Injects `adsbygoogle.js` once via `<Script strategy="afterInteractive">` — never blocks rendering |
| Core unit | `src/components/ads/AdUnit.tsx` | Generic `<ins>` wrapper that calls `adsbygoogle.push({})` on mount; renders a dev placeholder when no publisher ID is set |
| Named slots | `src/components/ads/AdSlots.tsx` | Pre-built named placements (`AdBanner`, `AdRectangle`, `AdInArticle`, `AdInFeed`, `AdStickyBottom`, `AdHalfPage`, `AdResponsive`) used in pages |

### Setup

**1. Add your publisher ID to `.env.local`:**

```env
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-4337784950654838
```

**2. Replace placeholder slot IDs in `src/components/ads/AdSlots.tsx`:**

```ts
const SLOT_BANNER        = '1111111111'; // ← your real leaderboard slot ID
const SLOT_RECTANGLE     = '2222222222'; // ← your real rectangle slot ID
const SLOT_IN_ARTICLE    = '3333333333'; // ← your real in-article slot ID
const SLOT_IN_FEED       = '4444444444'; // ← your real in-feed slot ID
const SLOT_MOBILE_BANNER = '5555555555'; // ← your real mobile banner slot ID
const SLOT_HALF_PAGE     = '6666666666'; // ← your real half-page slot ID
```

Get slot IDs from **AdSense dashboard → Sites → Ad units → Create ad unit**.

### Ad placements

| Page | Placement | Component |
|---|---|---|
| All pages (mobile) | Fixed sticky bottom | `AdStickyBottom` (in `layout.tsx`) |
| Home | Between every content section | `AdBanner`, `AdInFeed` |
| Movie detail | Above player, after player, before recommendations | `AdBanner`, `AdInArticle`, `AdRectangle` |
| TV show detail | Above episode selector, after player, bottom | `AdBanner`, `AdInArticle`, `AdRectangle` |
| Anime detail | Above episode picker, after player, bottom | `AdBanner`, `AdInArticle`, `AdRectangle` |
| Movies / Shows / Anime browse | Between content rows | `AdBanner`, `AdInFeed` |
| Search | Below search input, mid-results | `AdBanner`, `AdRectangle` |

### Dev mode

When `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` is unset (or still the placeholder `ca-pub-4337784950654838`), every `<AdUnit>` renders a labelled dashed-border placeholder box matching the ad's dimensions. No AdSense script is loaded and no network requests are made. This keeps local development clean.

### CSP / Headers

`next.config.js` sets a `Content-Security-Policy` header that explicitly whitelists all AdSense, DoubleClick and Google Analytics origins:

- `script-src`: `pagead2.googlesyndication.com`, `partner.googleadservices.com`, `tpc.googlesyndication.com`, `adservice.google.com`, `fundingchoicesmessages.google.com`, `googletagmanager.com`
- `frame-src`: `googleads.g.doubleclick.net`, `tpc.googlesyndication.com`
- `img-src`: `pagead2.googlesyndication.com`, `tpc.googlesyndication.com`, `googleads.g.doubleclick.net`
- `connect-src`: `pagead2.googlesyndication.com`, `googleads.g.doubleclick.net`, `adservice.google.com`, `stats.g.doubleclick.net`

A `Permissions-Policy` header also grants `attribution-reporting`, `run-ad-auction`, and `join-ad-interest-group` which AdSense requires for the Privacy Sandbox APIs.

### Using `<AdUnit>` directly

```tsx
import { AdUnit } from '@/components/ads';

// Responsive auto ad
<AdUnit slot="1234567890" format="auto" responsive label />

// Fixed 300×250 rectangle
<AdUnit slot="1234567890" format="rectangle" />

// 728×90 leaderboard with label
<AdUnit slot="1234567890" format="leaderboard" label />

// Native in-article
<AdUnit slot="1234567890" format="in_article" responsive />
```

Available `format` values: `auto`, `rectangle`, `leaderboard`, `banner`, `large_rectangle`, `skyscraper`, `wide_skyscraper`, `half_page`, `billboard`, `mobile_banner`, `in_feed`, `in_article`, `matched_content`.
