'use client';
import { useState } from 'react';

interface Props {
  comicTitle?: string;
  onClose: () => void;
}

const ACTIONS = [
  { type: 'plot_twist', label: '🌀 Plot Twist!', desc: 'What happens next?' },
  { type: 'character_name', label: '🦸 Name a Hero', desc: 'Get character name ideas' },
  { type: 'dialogue', label: '💬 Write Dialogue', desc: 'Speech bubble ideas' },
  { type: 'story_idea', label: '✨ Story Idea', desc: 'Spark a new story' },
];

export default function ComicBot({ comicTitle, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [extra, setExtra] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function askBot(type: string) {
    setSelected(type);
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context: {
            title: comicTitle || 'My Comic',
            description: extra,
            scene: extra,
            character: extra,
          },
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setResult('Oops! ComicBot had a hiccup. Try again! 🤖');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50">
      <div className="bg-blue-50 rounded-t-3xl border-t-4 border-blue-900 w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl text-blue-900">ComicBot 🤖</h2>
              <p className="text-blue-700 text-sm font-bold">Your AI creative helper!</p>
            </div>
            <button onClick={onClose} className="text-2xl text-blue-800">✕</button>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {ACTIONS.map(action => (
              <button key={action.type}
                onClick={() => askBot(action.type)}
                className={`btn-ink p-3 rounded-xl text-left ${
                  selected === action.type ? 'bg-blue-400 text-blue-900' : 'bg-white text-blue-900'
                }`}>
                <div className="font-extrabold text-sm">{action.label}</div>
                <div className="text-xs text-blue-700">{action.desc}</div>
              </button>
            ))}
          </div>

          {/* Extra context input */}
          <input
            type="text"
            placeholder="Add details (optional) e.g. 'flying superhero'..."
            value={extra}
            onChange={e => setExtra(e.target.value)}
            className="w-full border-3 border-blue-300 rounded-xl px-3 py-2 font-bold text-sm mb-3 outline-none"
            style={{ border: '2px solid #93c5fd' }}
          />

          {/* Result */}
          {loading && (
            <div className="bg-white comic-panel rounded-xl p-4 text-center">
              <div className="font-display text-2xl text-blue-700 animate-pulse">🤖 Thinking...</div>
            </div>
          )}
          {result && !loading && (
            <div className="bg-white comic-panel rounded-xl p-4">
              <p className="font-extrabold text-blue-900 text-sm mb-2">ComicBot says:</p>
              <p className="font-bold text-gray-800 text-sm whitespace-pre-line">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
