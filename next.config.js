/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/**',
      },
    ],
  },

  // ── Security & AdSense-compatible headers ─────────────────────────────────
  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Permissions-Policy required by AdSense attribution reporting
          {
            key: 'Permissions-Policy',
            value:
              'attribution-reporting=*, run-ad-auction=*, join-ad-interest-group=*',
          },
          // CSP: locks down origins while explicitly whitelisting AdSense,
          // DoubleClick, Google Analytics, Google Fonts, TMDB, Anilist and
          // the VidNest embed.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://www.google-analytics.com https://www.googletagmanager.com https://fundingchoicesmessages.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.google.com https://googleads.g.doubleclick.net https://image.tmdb.org https://s4.anilist.co",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://vidnest.fun",
              "connect-src 'self' https://api.themoviedb.org https://graphql.anilist.co https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net",
              "media-src 'self'",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
