'use client';
import { BubbleType } from '@/types';

interface Props {
  onSelect: (type: BubbleType, text: string) => void;
  onClose: () => void;
}

const BUBBLES: Array<{ type: BubbleType; label: string; emoji: string; desc: string }> = [
  { type: 'speech', label: 'Speech', emoji: '💬', desc: 'Normal talking' },
  { type: 'shout', label: 'Shout', emoji: '📣', desc: 'Yelling!' },
  { type: 'thought', label: 'Thought', emoji: '💭', desc: 'Thinking...' },
  { type: 'whisper', label: 'Whisper', emoji: '🤫', desc: 'Quiet voice' },
];

const SOUND_EFFECTS = ['POW!', 'ZAP!', 'BOOM!', 'WHOOSH!', 'CRASH!', 'BANG!', 'OMG!', 'WOW!', 'YIKES!', 'KAPOW!'];

export default function BubblePicker({ onSelect, onClose }: Props) {
  const [step, setStep] = useState<'type' | 'text'>('type');
  const [selectedType, setSelectedType] = useState<BubbleType>('speech');
  const [text, setText] = useState('');

  function handleTypeSelect(type: BubbleType) {
    setSelectedType(type);
    setStep('text');
  }

  function handleSoundEffect(sfx: string) {
    onSelect('shout', sfx);
  }

  function handleSubmit() {
    if (text.trim()) {
      onSelect(selectedType, text.trim());
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50">
      <div className="bg-white rounded-t-3xl border-t-4 border-amber-900 w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-amber-900">
            {step === 'type' ? 'Add Bubble 💬' : 'Type Your Text ✏️'}
          </h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        {step === 'type' ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {BUBBLES.map(b => (
                <button key={b.type} onClick={() => handleTypeSelect(b.type)}
                  className="btn-ink bg-amber-50 p-3 rounded-xl text-left">
                  <div className="text-2xl mb-1">{b.emoji}</div>
                  <div className="font-extrabold text-amber-900">{b.label}</div>
                  <div className="text-xs text-amber-700">{b.desc}</div>
                </button>
              ))}
            </div>
            <p className="font-extrabold text-amber-800 text-sm mb-2">Sound Effects ⚡</p>
            <div className="flex gap-2 flex-wrap">
              {SOUND_EFFECTS.map(sfx => (
                <button key={sfx} onClick={() => handleSoundEffect(sfx)}
                  className="btn-ink bg-yellow-300 text-amber-900 px-3 py-1 rounded-lg font-display text-lg">
                  {sfx}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="speech-bubble mb-4 min-h-16 flex items-center">
              <p className="font-bold text-gray-800">{text || 'Your text here...'}</p>
            </div>
            <textarea
              placeholder="Type what they say..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full border-2 border-amber-300 rounded-xl px-3 py-2 font-bold text-lg mb-3 outline-none h-24 resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setStep('type')}
                className="btn-ink bg-gray-100 text-gray-700 py-3 rounded-xl flex-1 font-bold">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={!text.trim()}
                className="btn-ink bg-orange-500 text-white py-3 rounded-xl flex-1 font-extrabold disabled:opacity-40">
                Add it! ✨
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Need to import useState
import { useState } from 'react';
