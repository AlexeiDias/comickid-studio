'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getComic, addReaction } from '@/lib/comicsService';
import { Comic } from '@/types';
import { SceneBackground } from '@/components/editor/SceneBackgrounds';
import CharacterSVG from '@/components/characters/CharacterSVG';

const REACTIONS: Array<{ key: keyof Comic['reactions']; emoji: string; label: string }> = [
  { key: 'heart', emoji: '❤️', label: 'Love it' },
  { key: 'laugh', emoji: '😂', label: 'Funny' },
  { key: 'fire',  emoji: '🔥', label: 'Amazing' },
  { key: 'clap',  emoji: '👏', label: 'Bravo' },
];

export default function ComicReaderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [comic, setComic]         = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(-1); // -1 = cover
  const [loading, setLoading]     = useState(true);
  const [reacted, setReacted]     = useState<Set<string>>(new Set());
  const [showReactions, setShowReactions] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);

  useEffect(() => { if (id) loadComic(); }, [id]);

  async function loadComic() {
    const data = await getComic(id as string);
    setComic(data);
    setLoading(false);
  }

  function navigate(delta: number) {
    if (!comic || animating) return;
    const next = currentPage + delta;
    if (next < -1 || next >= comic.pages.length) return;
    setDirection(delta > 0 ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(next);
      setAnimating(false);
    }, 180);
  }

  async function handleReaction(reaction: keyof Comic['reactions']) {
    if (!comic) return;
    const key = `${comic.id}-${reaction}`;
    if (reacted.has(key)) return;
    await addReaction(comic.id, reaction);
    setReacted(prev => new Set([...prev, key]));
    setComic(prev => prev ? {
      ...prev,
      reactions: { ...prev.reactions, [reaction]: prev.reactions[reaction] + 1 }
    } : prev);
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-amber-50">
      <div className="font-display text-3xl text-amber-700 animate-pulse">Loading comic...</div>
    </div>
  );

  if (!comic) return (
    <div className="h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="text-6xl mb-4">😢</div>
        <p className="font-bold text-amber-800">Comic not found</p>
        <button onClick={() => router.back()} className="mt-4 btn-ink bg-amber-400 text-amber-900 px-6 py-3 rounded-xl font-extrabold">← Go back</button>
      </div>
    </div>
  );

  const totalPages = comic.pages.length;
  const isCover    = currentPage === -1;
  const isLastPage = currentPage === totalPages - 1;
  const page       = isCover ? null : comic.pages[currentPage];
  const pageSceneKey = page?.sceneKey || 'blank';
  const hasScene   = pageSceneKey !== 'blank' && pageSceneKey !== 'cream' && pageSceneKey !== '';

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-10 pb-2 bg-gray-900 shrink-0">
        <button onClick={() => router.back()}
          className="text-white font-extrabold text-lg px-2 py-1 rounded-lg bg-white/10 active:bg-white/20">
          ← Back
        </button>
        <div className="text-center">
          <p className="font-display text-lg text-white truncate max-w-[180px]">{comic.title}</p>
          <p className="text-gray-400 text-xs font-bold">
            {isCover ? 'Cover' : `Page ${currentPage + 1} of ${totalPages}`}
          </p>
        </div>
        <button onClick={() => setShowReactions(true)}
          className="text-white font-extrabold text-lg px-2 py-1 rounded-lg bg-white/10 active:bg-white/20">
          ❤️
        </button>
      </div>

      {/* ── Page progress dots ── */}
      <div className="flex items-center justify-center gap-1.5 py-2 shrink-0">
        {/* Cover dot */}
        <div className={`rounded-full transition-all ${isCover ? 'w-4 h-4 bg-amber-400' : 'w-2 h-2 bg-gray-600'}`}/>
        {comic.pages.map((_, i) => (
          <button key={i} onClick={() => setCurrentPage(i)}
            className={`rounded-full transition-all ${i === currentPage ? 'w-4 h-4 bg-amber-400' : 'w-2 h-2 bg-gray-600'}`}/>
        ))}
      </div>

      {/* ── Page display ── */}
      <div className="flex-1 relative overflow-hidden mx-3 mb-3 rounded-2xl"
        style={{ border: '3px solid #374151' }}>

        {/* ── COVER ── */}
        {isCover && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: comic.coverColor }}>
            {/* Comic book cover style */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)' }}/>
            {/* Title banner */}
            <div className="relative z-10 text-center px-6">
              <div className="bg-yellow-400 border-4 border-gray-900 rounded-2xl px-6 py-3 mb-4 inline-block"
                style={{ boxShadow: '4px 4px 0 #1a1a2e' }}>
                <p className="font-display text-4xl text-gray-900 leading-tight">{comic.title}</p>
              </div>
              <div className="bg-white/90 border-3 border-gray-900 rounded-xl px-4 py-2 inline-block"
                style={{ border: '3px solid #1a1a2e', boxShadow: '3px 3px 0 #1a1a2e' }}>
                <p className="font-extrabold text-gray-800 text-sm">by {comic.authorName}</p>
              </div>
              <p className="text-white/80 font-bold text-sm mt-3">{totalPages} page{totalPages !== 1 ? 's' : ''}</p>
            </div>
            {/* Decorative corner labels */}
            <div className="absolute top-3 left-3 font-display text-white/60 text-lg">POW!</div>
            <div className="absolute top-3 right-3 font-display text-white/60 text-lg">ZAP!</div>
            <div className="absolute bottom-12 left-3 font-display text-white/60 text-base">BOOM!</div>
          </div>
        )}

        {/* ── COMIC PAGE ── */}
        {!isCover && page && (
          <div className="absolute inset-0"
            style={{ backgroundColor: hasScene ? 'transparent' : (page.backgroundColor || '#fff') }}>

            {/* Scene background */}
            {hasScene && <SceneBackground sceneKey={pageSceneKey}/>}
            {!hasScene && <div className="absolute inset-0" style={{ backgroundColor: page.backgroundColor || '#fff' }}/>}

            {/* Drawing layer */}
            {page.drawingData && (
              <img
                src={page.drawingData}
                alt={`Page ${currentPage + 1}`}
                className="absolute inset-0 w-full h-full object-fill"
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Characters */}
            {page.characters.map(pc => {
              const char = comic.characters.find(c => c.id === pc.characterId);
              if (!char) return null;
              return (
                <div key={pc.characterId}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${pc.x}%`, top: `${pc.y}%`,
                    transform: `translate(-50%, -50%) scaleX(${pc.flipped ? -1 : 1})`,
                    zIndex: 10,
                  }}>
                  <CharacterSVG character={char} pose={pc.pose || 'standing'} size={pc.size || 70}/>
                </div>
              );
            })}

            {/* Text bubbles */}
            {page.textBubbles.map(bubble => {
              const fs = bubble.fontSize || 13;
              return (
                <div key={bubble.id}
                  className="absolute pointer-events-none"
                  style={{ left: `${bubble.x}%`, top: `${bubble.y}%`, maxWidth: `${bubble.width}%`, zIndex: 20 }}>
                  <div className={`relative px-3 py-2 font-bold bg-white border-2 border-gray-900
                    ${bubble.type === 'shout'   ? 'bg-yellow-300 font-display' : ''}
                    ${bubble.type === 'thought' ? 'rounded-3xl border-dotted' : 'rounded-xl'}
                    ${bubble.type === 'whisper' ? 'border-dashed opacity-80'  : ''}
                  `} style={{ fontSize: `${fs}px`, lineHeight: 1.3 }}>
                    {bubble.text}
                    {(bubble.type === 'speech' || bubble.type === 'whisper') && (
                      <div className="absolute -bottom-2 left-4 w-0 h-0"
                        style={{ borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid #1a1a2e' }}/>
                    )}
                    {bubble.type === 'shout' && (
                      <div className="absolute -bottom-2 left-4 w-0 h-0"
                        style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '7px solid #1a1a2e' }}/>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Sound effects */}
            {page.soundEffects?.map((sfx, i) => (
              <div key={i} className="absolute pointer-events-none font-display text-2xl"
                style={{ left: `${sfx.x}%`, top: `${sfx.y}%`, color: sfx.color, transform: 'rotate(-10deg)', zIndex: 15 }}>
                {sfx.text}
              </div>
            ))}

            {/* Page number badge */}
            <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs font-extrabold px-2 py-0.5 rounded-full pointer-events-none">
              {currentPage + 1}/{totalPages}
            </div>
          </div>
        )}

        {/* ── Tap zones for navigation (left / right thirds) ── */}
        {/* Left tap → previous page */}
        <button
          className="absolute left-0 top-0 w-1/3 h-full z-30 flex items-center justify-start pl-2 opacity-0 active:opacity-100"
          onClick={() => navigate(-1)}
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)' }}>
          <span className="text-white text-3xl font-bold drop-shadow">‹</span>
        </button>
        {/* Right tap → next page */}
        <button
          className="absolute right-0 top-0 w-1/3 h-full z-30 flex items-center justify-end pr-2 opacity-0 active:opacity-100"
          onClick={() => navigate(1)}
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)' }}>
          <span className="text-white text-3xl font-bold drop-shadow">›</span>
        </button>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="flex items-center gap-3 px-4 pb-8 shrink-0">
        <button
          onClick={() => navigate(-1)}
          disabled={isCover}
          className="btn-ink bg-white text-gray-800 px-5 py-3 rounded-xl font-extrabold text-lg flex-1 disabled:opacity-30">
          ‹ Prev
        </button>

        {/* Page indicator */}
        <div className="text-center text-white font-extrabold text-sm min-w-[60px]">
          {isCover ? '📖' : `${currentPage + 1}/${totalPages}`}
        </div>

        {isLastPage ? (
          <button
            onClick={() => setShowReactions(true)}
            className="btn-ink bg-amber-400 text-amber-900 px-5 py-3 rounded-xl font-extrabold text-lg flex-1">
            Rate it! ⭐
          </button>
        ) : (
          <button
            onClick={() => navigate(1)}
            className="btn-ink bg-amber-400 text-amber-900 px-5 py-3 rounded-xl font-extrabold text-lg flex-1">
            Next ›
          </button>
        )}
      </div>

      {/* ── Reactions modal ── */}
      {showReactions && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-50" onClick={() => setShowReactions(false)}>
          <div className="bg-white rounded-t-3xl border-t-4 border-amber-900 w-full p-6 pb-10"
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-4"/>
            <h2 className="font-display text-2xl text-amber-900 text-center mb-1">What did you think?</h2>
            <p className="text-amber-700 font-bold text-sm text-center mb-6">by {comic.authorName}</p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {REACTIONS.map(r => {
                const key = `${comic.id}-${r.key}`;
                const hasReacted = reacted.has(key);
                return (
                  <button key={r.key}
                    onClick={() => handleReaction(r.key)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-3 font-bold transition-all ${
                      hasReacted
                        ? 'bg-amber-400 border-amber-900 scale-105'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    style={{ border: hasReacted ? '3px solid #78350f' : '2px solid #e5e7eb' }}>
                    <span className="text-3xl">{r.emoji}</span>
                    <span className="text-xs">{r.label}</span>
                    <span className="font-extrabold text-sm">{comic.reactions[r.key] || 0}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowReactions(false)}
              className="w-full btn-ink bg-amber-400 text-amber-900 py-4 rounded-2xl text-xl font-extrabold">
              Done! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
