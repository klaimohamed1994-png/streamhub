import Link from 'next/link';
import { Film } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a3a] bg-[#111118] mt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#6c63ff] flex items-center justify-center">
              <Film size={14} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif' }} className="text-lg font-bold text-white">
              Stream<span className="text-[#8b84ff]">TN</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#8888aa]">
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/shows" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/anime" className="hover:text-white transition-colors">Anime</Link>
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          </nav>

          {/* Powered by */}
          <p className="text-xs text-[#8888aa] text-center">
            Powered by med 
          </p>
        </div>

        <p className="text-center text-xs text-[#8888aa]/50 mt-6">
          
        </p>
      </div>
    </footer>
  );
}
