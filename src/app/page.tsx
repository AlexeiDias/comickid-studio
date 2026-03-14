'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function HomePage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/library');
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="font-display text-4xl text-amber-800 animate-pulse">Loading...</div>
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Logo */}
      <div className="mb-2 text-7xl animate-bounce">🎨</div>
      <h1 className="font-display text-6xl text-amber-900 mb-1" style={{ letterSpacing: '2px' }}>
        ComicKid
      </h1>
      <p className="font-display text-3xl text-orange-500 mb-6">STUDIO</p>

      {/* Comic panels preview */}
      <div className="flex gap-2 mb-8">
        {['💥', '🦸', '🗺️'].map((emoji, i) => (
          <div key={i} className="comic-panel w-20 h-24 bg-white flex items-center justify-center text-3xl wiggle"
            style={{ animationDelay: `${i * 0.1}s` }}>
            {emoji}
          </div>
        ))}
      </div>

      <p className="text-amber-800 font-bold text-lg mb-8 max-w-xs">
        Create amazing comic books, build cool characters, and share your stories with the world! 🌟
      </p>

      <button
        onClick={signInWithGoogle}
        className="btn-ink bg-amber-400 text-amber-900 px-8 py-4 rounded-xl text-xl flex items-center gap-3 mb-4"
      >
        <span>Sign in with Google</span>
        <span>→</span>
      </button>

      <p className="text-amber-700 text-sm font-bold">Ask a parent to help you sign in!</p>

      {/* Decorative sound effects */}
      <div className="absolute top-8 right-8 font-display text-3xl text-orange-400 rotate-12 opacity-60">POW!</div>
      <div className="absolute top-24 left-6 font-display text-2xl text-yellow-500 -rotate-6 opacity-60">ZAP!</div>
      <div className="absolute bottom-32 right-6 font-display text-2xl text-red-400 rotate-6 opacity-60">BOOM!</div>
    </main>
  );
}
