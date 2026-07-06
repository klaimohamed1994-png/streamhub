'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Film, Tv, Sword, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/shows', label: 'TV Shows', icon: Tv },
  { href: '/anime', label: 'Anime', icon: Sword },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a3a]'
          : 'bg-gradient-to-b from-[#0a0a0f]/80 to-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.5)]">
            <Film size={16} className="text-white" />
          </div>
          <span
            style={{ fontFamily: 'Sora, sans-serif' }}
            className="text-xl font-bold text-white hidden sm:block"
          >
            Stream<span className="text-[#8b84ff]">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname.startsWith(href)
                  ? 'text-[#8b84ff] bg-[#1a1a24]'
                  : 'text-[#8888aa] hover:text-white hover:bg-[#1a1a24]'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-3 py-2 focus-within:border-[#6c63ff] transition-colors"
        >
          <Search size={15} className="text-[#8888aa] shrink-0" />
          <input
            type="text"
            placeholder="Search movies, shows, anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#8888aa] outline-none flex-1"
          />
        </form>

        {/* Mobile search icon + hamburger */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Link href="/search" className="p-2 text-[#8888aa] hover:text-white">
            <Search size={20} />
          </Link>
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="p-2 text-[#8888aa] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2a3a] bg-[#111118] animate-fade-in">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname.startsWith(href)
                    ? 'text-[#8b84ff] bg-[#1a1a24]'
                    : 'text-[#8888aa] hover:text-white hover:bg-[#1a1a24]'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <form onSubmit={handleSearch} className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-3 py-2">
              <Search size={15} className="text-[#8888aa]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-[#8888aa] outline-none flex-1"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
