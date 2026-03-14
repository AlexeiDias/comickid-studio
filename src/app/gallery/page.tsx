'use client';
import { useState, useEffect } from 'react';
import { getPublicComics, addReaction } from '@/lib/comicsService';
import { Comic } from '@/types';
import BottomNav from '@/components/ui/BottomNav';
import toast from 'react-hot-toast';

const REACTIONS: Array<{ key: keyof Comic['reactions']; emoji: string }> = [
  { key: 'heart', emoji: '❤️' },
  { key: 'laugh', emoji: '😂' },
  { key: 'fire', emoji: '🔥' },
  { key: 'clap', emoji: '👏' },
];

export default function GalleryPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [reacted, setReacted] = useState<Set<string>>(new Set());

  useEffect(() => { loadComics(); }, []);

  async function loadComics() {
    const data = await getPublicComics();
    setComics(data);
    setLoading(false);
  }

  async function handleReaction(comicId: string, reaction: keyof Comic['reactions']) {
    const key = `${comicId}-${reaction}`;
    if (reacted.has(key)) return;
    await addReaction(comicId, reaction);
    setReacted(prev => new Set([...prev, key]));
    setComics(prev => prev.map(c =>
      c.id === comicId ? { ...c, reactions: { ...c.reactions, [reaction]: c.reactions[reaction] + 1 } } : c
    ));
    toast.success('Reaction sent! ✨');
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-purple-500 border-b-4 border-purple-900 px-4 pt-12 pb-4">
        <h1 className="font-display text-3xl text-white">🌟 Gallery</h1>
        <p className="text-purple-100 font-bold text-sm">Comics from young creators!</p>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 font-display text-2xl text-purple-700 animate-pulse">Loading gallery...</div>
        ) : comics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <p className="font-bold text-purple-800 text-lg">No comics yet!</p>
            <p className="text-purple-600 text-sm mt-1">Be the first to publish your comic!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comics.map(comic => (
              <div key={comic.id} className="comic-panel bg-white rounded-xl overflow-hidden pop-in">
                {/* Cover */}
                <div className="h-40 flex items-center justify-center font-display text-white relative"
                  style={{ backgroundColor: comic.coverColor }}>
                  <div className="text-center">
                    <div className="text-6xl mb-1">{comic.title.charAt(0)}</div>
                    <div className="text-2xl drop-shadow">{comic.title}</div>
                  </div>
                  <div className="absolute bottom-2 right-3 bg-black/30 rounded-full px-2 py-0.5 text-xs font-bold">
                    {comic.pageCount} pages
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-extrabold text-gray-900">{comic.title}</p>
                      <p className="text-xs text-gray-500 font-bold">by {comic.authorName}</p>
                    </div>
                  </div>
                  {comic.description && (
                    <p className="text-sm text-gray-700 font-bold mb-2">{comic.description}</p>
                  )}

                  {/* Reactions */}
                  <div className="flex gap-2">
                    {REACTIONS.map(r => {
                      const key = `${comic.id}-${r.key}`;
                      const hasReacted = reacted.has(key);
                      return (
                        <button key={r.key}
                          onClick={() => handleReaction(comic.id, r.key)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm border-2 transition-all ${
                            hasReacted
                              ? 'bg-amber-400 border-amber-900 scale-105'
                              : 'bg-gray-50 border-gray-200 hover:border-amber-400'
                          }`}>
                          <span>{r.emoji}</span>
                          <span className="text-xs">{comic.reactions[r.key] || 0}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
