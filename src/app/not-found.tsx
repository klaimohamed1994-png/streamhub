import Link from 'next/link';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-[#1a1a24] border border-[#2a2a3a] flex items-center justify-center mb-6">
        <Film size={36} className="text-[#6c63ff]" />
      </div>
      <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl font-bold text-white mb-3">
        404
      </h1>
      <p className="text-[#8888aa] mb-8 max-w-sm">
        This page doesn t exist or the content could not be found.
      </p>
      <Link
        href="/"
        className="btn-accent"
      >
        Back to Home
      </Link>
    </div>
  );
}
