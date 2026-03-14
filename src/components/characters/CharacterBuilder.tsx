'use client';
import { useState } from 'react';
import { Character } from '@/types';
import CharacterSVG, { SPECIES, CharacterSpecies } from './CharacterSVG';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSave: (char: Character & { species: CharacterSpecies }) => void;
  onClose: () => void;
  existing?: Character & { species?: CharacterSpecies };
}

// Color palettes
const HUMAN_SKIN   = ['#ffcc99','#f4a56a','#c68642','#8d5524','#fce4d6','#ffb347'];
const HUMAN_HAIR   = ['#1a1a1a','#5c3317','#f4a460','#ffd700','#ff6b6b','#9370db','#4169e1','#ffffff'];
const OUTFIT_COLORS= ['#4a90e2','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e','#ff69b4','#00ced1'];
const ANIMAL_BODY: Record<CharacterSpecies, string[]> = {
  human:   ['#ffcc99','#f4a56a','#c68642','#8d5524'],
  cat:     ['#f4a056','#888888','#1a1a2e','#ffffff','#f4d03f','#e8b4b8'],
  dog:     ['#c8a068','#8b4513','#f5f5dc','#1a1a2e','#d2691e','#deb887'],
  rabbit:  ['#e8d8c8','#ffffff','#f8c8c8','#888888','#c8c8c8','#f4d03f'],
  bear:    ['#8b6340','#c8a478','#1a1a2e','#d4a054','#6b3a1f','#f5deb3'],
  fox:     ['#e8621a','#c8401a','#d4601a','#8b3a10','#f4821a','#e87830'],
  frog:    ['#5aad3c','#3c8a28','#78dd58','#2e6e1e','#a0dd60','#4e9a30'],
  penguin: ['#1a1a2e','#2e2e4e','#1a3050','#0a0a1e','#2a2a3e'],
};
const ANIMAL_ACCENT: Record<CharacterSpecies, string[]> = {
  human:   HUMAN_HAIR,
  cat:     ['#fff5e8','#ffffff','#ffd8b0','#ffe4c4','#f5e6d3','#fcebd0'],
  dog:     ['#a07840','#d2b48c','#ffffff','#8b7355','#c8b080','#b8a070'],
  rabbit:  ['#f8c0b8','#ffb6c1','#f4a0a0','#ffe4e1','#ffc0cb','#ff9999'],
  bear:    ['#c8a478','#d4b088','#e8c098','#b89060','#a87848','#f0d0a0'],
  fox:     ['#ffffff','#f5f5f5','#fffaf0','#ffefd5','#fff8dc','#fffff0'],
  frog:    ['#78dd58','#a0dd70','#90dd60','#b0e880','#68cc48','#88d860'],
  penguin: ['#ffffff','#f8f8f8','#fffaf0','#f0f8ff','#f5fffa'],
};

const BODY_SHAPES: Array<{ key: Character['bodyShape']; label: string }> = [
  { key: 'round', label: '⭕ Round' },
  { key: 'square', label: '🟦 Square' },
  { key: 'tall', label: '📏 Tall' },
  { key: 'small', label: '🔵 Small' },
];
const EYE_STYLES: Array<{ key: Character['eyeStyle']; label: string }> = [
  { key: 'happy', label: '😊 Happy' },
  { key: 'cool', label: '😎 Cool' },
  { key: 'surprised', label: '😲 Wow' },
  { key: 'sleepy', label: '😴 Sleepy' },
];
const ACCESSORIES: Array<{ key: Character['accessory']; label: string }> = [
  { key: 'none', label: '🚫 None' },
  { key: 'hat', label: '🎩 Hat' },
  { key: 'glasses', label: '👓 Glasses' },
  { key: 'cape', label: '🦸 Cape' },
  { key: 'crown', label: '👑 Crown' },
];

export default function CharacterBuilder({ onSave, onClose, existing }: Props) {
  const defaultSpecies: CharacterSpecies = existing?.species || 'human';
  const [species, setSpecies] = useState<CharacterSpecies>(defaultSpecies);
  const [char, setChar] = useState<Character>({
    id: existing?.id || uuidv4(),
    name: existing?.name || '',
    species: defaultSpecies,
    bodyShape: existing?.bodyShape || 'round',
    skinColor: existing?.skinColor || (defaultSpecies === 'human' ? '#ffcc99' : ANIMAL_BODY[defaultSpecies][0]),
    hairColor: existing?.hairColor || (defaultSpecies === 'human' ? '#1a1a1a' : ANIMAL_ACCENT[defaultSpecies][0]),
    outfitColor: existing?.outfitColor || '#4a90e2',
    eyeStyle: existing?.eyeStyle || 'happy',
    accessory: existing?.accessory || 'none',
  });

  function update(key: keyof Character, value: string) {
    setChar(prev => ({ ...prev, [key]: value }));
  }

  function handleSpeciesChange(s: CharacterSpecies) {
    setSpecies(s);
    // Reset colors to species defaults
    setChar(prev => ({
      ...prev,
      skinColor:  s === 'human' ? '#ffcc99' : ANIMAL_BODY[s][0],
      hairColor:  s === 'human' ? '#1a1a1a' : ANIMAL_ACCENT[s][0],
    }));
  }

  const bodyColors   = species === 'human' ? HUMAN_SKIN   : ANIMAL_BODY[species];
  const accentColors = species === 'human' ? HUMAN_HAIR   : ANIMAL_ACCENT[species];
  const bodyLabel    = species === 'human' ? 'Skin Color'   : 'Body Color';
  const accentLabel  = species === 'human' ? 'Hair Color'   : 'Accent Color';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50">
      <div className="bg-amber-50 rounded-t-3xl border-t-4 border-amber-900 w-full"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="p-4 pb-10">
          {/* Handle + header */}
          <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-4"/>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-amber-900">Character Builder 🎨</h2>
            <button onClick={onClose} className="text-2xl text-amber-700">✕</button>
          </div>

          {/* Preview */}
          <div className="bg-white comic-panel rounded-2xl p-4 flex flex-col items-center mb-4">
            <CharacterSVG character={{ ...char, species }} size={100}/>
            <input type="text" placeholder="Give them a name..."
              value={char.name} onChange={e => update('name', e.target.value)}
              className="mt-3 text-center font-extrabold text-amber-900 text-lg bg-transparent border-b-2 border-amber-400 outline-none w-full"/>
          </div>

          {/* Species picker */}
          <Section title="Species">
            <div className="grid grid-cols-4 gap-2">
              {SPECIES.map(s => (
                <button key={s.key} onClick={() => handleSpeciesChange(s.key)}
                  className={`btn-ink py-2 px-1 rounded-xl text-sm font-bold flex flex-col items-center gap-0.5 ${species === s.key ? 'bg-amber-400 text-amber-900' : 'bg-white text-gray-600'}`}>
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Body color */}
          <Section title={bodyLabel}>
            <div className="flex gap-2 flex-wrap">
              {bodyColors.map(c => (
                <button key={c} onClick={() => update('skinColor', c)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${char.skinColor === c ? 'border-amber-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
              ))}
            </div>
          </Section>

          {/* Accent color */}
          <Section title={accentLabel}>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map(c => (
                <button key={c} onClick={() => update('hairColor', c)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${char.hairColor === c ? 'border-amber-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
              ))}
            </div>
          </Section>

          {/* Outfit color */}
          <Section title="Outfit Color">
            <div className="flex gap-2 flex-wrap">
              {OUTFIT_COLORS.map(c => (
                <button key={c} onClick={() => update('outfitColor', c)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${char.outfitColor === c ? 'border-amber-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
              ))}
            </div>
          </Section>

          {/* Eyes */}
          <Section title="Eye Style">
            <div className="grid grid-cols-4 gap-2">
              {EYE_STYLES.map(s => (
                <button key={s.key} onClick={() => update('eyeStyle', s.key)}
                  className={`btn-ink py-2 rounded-lg text-sm font-bold ${char.eyeStyle === s.key ? 'bg-amber-400' : 'bg-white'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Accessory */}
          <Section title="Accessory">
            <div className="grid grid-cols-3 gap-2">
              {ACCESSORIES.map(s => (
                <button key={s.key} onClick={() => update('accessory', s.key)}
                  className={`btn-ink py-2 rounded-lg text-sm font-bold ${char.accessory === s.key ? 'bg-amber-400' : 'bg-white'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Body shape (humans only) */}
          {species === 'human' && (
            <Section title="Body Shape">
              <div className="grid grid-cols-4 gap-2">
                {BODY_SHAPES.map(s => (
                  <button key={s.key} onClick={() => update('bodyShape', s.key)}
                    className={`btn-ink py-2 px-1 rounded-lg text-xs font-bold ${char.bodyShape === s.key ? 'bg-amber-400' : 'bg-white'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </Section>
          )}

          <button onClick={() => { if (char.name.trim()) onSave({ ...char, species }); }}
            disabled={!char.name.trim()}
            className="w-full btn-ink bg-orange-500 text-white py-5 rounded-2xl text-2xl font-extrabold mt-4 disabled:opacity-40 disabled:cursor-not-allowed">
            Save Character! ✨
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="font-extrabold text-amber-800 text-sm mb-2">{title}</p>
      {children}
    </div>
  );
}
