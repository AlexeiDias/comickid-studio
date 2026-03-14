import { Character } from '@/types';

export type CharacterPose = 'standing' | 'sitting' | 'lying' | 'running' | 'walking' | 'jumping' | 'crawling';
export type CharacterSpecies = 'human' | 'cat' | 'dog' | 'rabbit' | 'bear' | 'fox' | 'frog' | 'penguin';

export const POSES: Array<{ key: CharacterPose; label: string; emoji: string }> = [
  { key: 'standing', label: 'Standing', emoji: '🧍' },
  { key: 'sitting',  label: 'Sitting',  emoji: '🪑' },
  { key: 'lying',    label: 'Lying',    emoji: '😴' },
  { key: 'running',  label: 'Running',  emoji: '🏃' },
  { key: 'walking',  label: 'Walking',  emoji: '🚶' },
  { key: 'jumping',  label: 'Jumping',  emoji: '🦘' },
  { key: 'crawling', label: 'Crawling', emoji: '🐾' },
];

export const SPECIES: Array<{ key: CharacterSpecies; label: string; emoji: string }> = [
  { key: 'human',   label: 'Human',   emoji: '🧑' },
  { key: 'cat',     label: 'Cat',     emoji: '🐱' },
  { key: 'dog',     label: 'Dog',     emoji: '🐶' },
  { key: 'rabbit',  label: 'Rabbit',  emoji: '🐰' },
  { key: 'bear',    label: 'Bear',    emoji: '🐻' },
  { key: 'fox',     label: 'Fox',     emoji: '🦊' },
  { key: 'frog',    label: 'Frog',    emoji: '🐸' },
  { key: 'penguin', label: 'Penguin', emoji: '🐧' },
];

interface Props {
  character: Partial<Character> & { species?: CharacterSpecies };
  pose?: CharacterPose;
  size?: number;
}

// ─── Shared accessories that work on any head ───────────────────────────────
function HatAcc({ cx, cy, outfitColor }: { cx: number; cy: number; outfitColor: string }) {
  return <>
    <rect x={cx-19} y={cy-22} width="38" height="6" rx="2" fill={outfitColor} stroke="#1a1a2e" strokeWidth="2"/>
    <rect x={cx-13} y={cy-36} width="26" height="15" rx="4" fill={outfitColor} stroke="#1a1a2e" strokeWidth="2"/>
  </>;
}
function CrownAcc({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M${cx-18},${cy-20} L${cx-13},${cy-32} L${cx-6},${cy-22} L${cx},${cy-34} L${cx+6},${cy-22} L${cx+13},${cy-32} L${cx+18},${cy-20} Z`}
    fill="#ffd23f" stroke="#1a1a2e" strokeWidth="2"/>;
}
function GlassesAcc({ cx, cy }: { cx: number; cy: number }) {
  return <>
    <circle cx={cx-9} cy={cy} r="7" fill="none" stroke="#1a1a2e" strokeWidth="2"/>
    <circle cx={cx+9} cy={cy} r="7" fill="none" stroke="#1a1a2e" strokeWidth="2"/>
    <line x1={cx-2} y1={cy} x2={cx+2} y2={cy} stroke="#1a1a2e" strokeWidth="2"/>
    <line x1={cx-22} y1={cy-2} x2={cx-16} y2={cy-1} stroke="#1a1a2e" strokeWidth="2"/>
    <line x1={cx+16} y1={cy-1} x2={cx+22} y2={cy-2} stroke="#1a1a2e" strokeWidth="2"/>
  </>;
}
function CapeAcc({ bodyX, bodyY, hairColor }: { bodyX: number; bodyY: number; hairColor: string }) {
  return <path d={`M${bodyX-15},${bodyY} Q${bodyX-25},${bodyY+20} ${bodyX-20},${bodyY+36} Q${bodyX},${bodyY+28} ${bodyX+20},${bodyY+36} Q${bodyX+25},${bodyY+20} ${bodyX+15},${bodyY} Z`}
    fill={hairColor} stroke="#1a1a2e" strokeWidth="2" opacity="0.85"/>;
}

// ─── Eye helpers ────────────────────────────────────────────────────────────
function Eyes({ cx, cy, style }: { cx: number; cy: number; style?: string }) {
  if (style === 'cool')     return <><line x1={cx-10} y1={cy} x2={cx-2} y2={cy} stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round"/><line x1={cx+2} y1={cy} x2={cx+10} y2={cy} stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round"/></>;
  if (style === 'surprised') return <><circle cx={cx-7} cy={cy} r="5" fill="white" stroke="#1a1a2e" strokeWidth="2"/><circle cx={cx+7} cy={cy} r="5" fill="white" stroke="#1a1a2e" strokeWidth="2"/><circle cx={cx-7} cy={cy} r="2.5" fill="#1a1a2e"/><circle cx={cx+7} cy={cy} r="2.5" fill="#1a1a2e"/></>;
  if (style === 'sleepy')    return <><path d={`M${cx-10},${cy} Q${cx-6},${cy+3} ${cx-2},${cy}`} stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d={`M${cx+2},${cy} Q${cx+6},${cy+3} ${cx+10},${cy}`} stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>;
  return <><path d={`M${cx-10},${cy} Q${cx-6},${cy-4} ${cx-2},${cy}`} stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d={`M${cx+2},${cy} Q${cx+6},${cy-4} ${cx+10},${cy}`} stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/></>;
}
function Mouth({ cx, cy }: { cx: number; cy: number }) {
  return <path d={`M${cx-6},${cy} Q${cx},${cy+5} ${cx+6},${cy}`} stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>;
}

// ════════════════════════════════════════════════════════════════════════════
//  HUMAN
// ════════════════════════════════════════════════════════════════════════════
function HumanHead({ cx=40, cy=36, skin='#ffcc99', hair='#333', outfit='#4a90e2', eye='happy', acc='none' }: any) {
  return <g>
    <ellipse cx={cx} cy={cy-4} rx="21" ry="9" fill={hair} stroke="#1a1a2e" strokeWidth="2"/>
    <ellipse cx={cx} cy={cy+2} rx="21" ry="19" fill={skin} stroke="#1a1a2e" strokeWidth="2.5"/>
    <Eyes cx={cx} cy={cy+2} style={eye}/>
    <Mouth cx={cx} cy={cy+10}/>
    {acc==='hat'    && <HatAcc cx={cx} cy={cy-4} outfitColor={outfit}/>}
    {acc==='crown'  && <CrownAcc cx={cx} cy={cy-4}/>}
    {acc==='glasses'&& <GlassesAcc cx={cx} cy={cy+2}/>}
  </g>;
}

function Human({ character, pose, size }: { character: any; pose: CharacterPose; size: number }) {
  const skin   = character.skinColor   || '#ffcc99';
  const hair   = character.hairColor   || '#333';
  const outfit = character.outfitColor || '#4a90e2';
  const eye    = character.eyeStyle    || 'happy';
  const acc    = character.accessory   || 'none';

  if (pose === 'standing') return (
    <svg width={size} height={size*1.35} viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={40} bodyY={56} hairColor={hair}/>}
      <rect x="20" y="56" width="40" height="34" rx="8" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5"/>
      <rect x="22" y="86" width="13" height="18" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="45" y="86" width="13" height="18" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <ellipse cx="12" cy="68" rx="7" ry="12" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-8 12 68)"/>
      <ellipse cx="68" cy="68" rx="7" ry="12" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(8 68 68)"/>
      <HumanHead cx={40} cy={36} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  if (pose === 'sitting') return (
    <svg width={size*1.1} height={size} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="38" width="34" height="28" rx="7" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5"/>
      <ellipse cx="20" cy="48" rx="7" ry="11" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-15 20 48)"/>
      <ellipse cx="74" cy="48" rx="7" ry="11" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(15 74 48)"/>
      <rect x="10" y="62" width="28" height="12" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="8" y="72" width="12" height="16" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="54" y="62" width="28" height="12" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="72" y="72" width="12" height="16" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <HumanHead cx={45} cy={26} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  if (pose === 'lying') return (
    <svg width={size*1.6} height={size*0.75} viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="28" width="60" height="22" rx="10" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5"/>
      <rect x="80" y="30" width="30" height="11" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="80" y="41" width="30" height="9" rx="4" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <ellipse cx="34" cy="26" rx="13" ry="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2"/>
      <HumanHead cx={20} cy={20} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  if (pose === 'running') return (
    <svg width={size} height={size*1.2} viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={45} bodyY={40} hairColor={hair}/>}
      <rect x="30" y="40" width="30" height="28" rx="7" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5" transform="rotate(-10 45 54)"/>
      <ellipse cx="22" cy="52" rx="6" ry="13" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(30 22 52)"/>
      <ellipse cx="65" cy="42" rx="6" ry="13" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-40 65 42)"/>
      <rect x="24" y="66" width="12" height="26" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(35 30 66)"/>
      <rect x="46" y="64" width="12" height="26" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-20 52 64)"/>
      <HumanHead cx={50} cy={28} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  if (pose === 'walking') return (
    <svg width={size} height={size*1.35} viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={40} bodyY={52} hairColor={hair}/>}
      <rect x="22" y="52" width="36" height="30" rx="7" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5" transform="rotate(-3 40 67)"/>
      <ellipse cx="16" cy="60" rx="6" ry="13" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-25 16 60)"/>
      <ellipse cx="64" cy="64" rx="6" ry="13" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(20 64 64)"/>
      <rect x="18" y="78" width="13" height="26" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-15 24 78)"/>
      <rect x="46" y="78" width="13" height="26" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(18 52 78)"/>
      <HumanHead cx={40} cy={36} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  if (pose === 'jumping') return (
    <svg width={size*1.1} height={size*1.2} viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={45} bodyY={36} hairColor={hair}/>}
      <rect x="28" y="36" width="34" height="26" rx="7" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5"/>
      <ellipse cx="18" cy="30" rx="6" ry="14" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-35 18 30)"/>
      <ellipse cx="72" cy="30" rx="6" ry="14" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(35 72 30)"/>
      <rect x="20" y="60" width="13" height="22" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-30 26 60)"/>
      <rect x="56" y="60" width="13" height="22" rx="6" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(30 62 60)"/>
      <HumanHead cx={45} cy={22} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
  // crawling
  return (
    <svg width={size*1.5} height={size} viewBox="0 0 110 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="32" width="50" height="20" rx="9" fill={outfit} stroke="#1a1a2e" strokeWidth="2.5"/>
      <rect x="10" y="28" width="22" height="11" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-10 21 33)"/>
      <rect x="70" y="30" width="18" height="10" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(8 79 35)"/>
      <rect x="14" y="48" width="11" height="18" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(10 19 48)"/>
      <rect x="68" y="48" width="11" height="18" rx="5" fill={outfit} stroke="#1a1a2e" strokeWidth="2" transform="rotate(-10 73 48)"/>
      <HumanHead cx={20} cy={20} skin={skin} hair={hair} outfit={outfit} eye={eye} acc={acc}/>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ANIMAL BASE — builds a generic animal with species-specific head
// ════════════════════════════════════════════════════════════════════════════

function AnimalHead({ species, cx, cy, bodyColor, accentColor, eye, acc, outfit }: {
  species: CharacterSpecies; cx: number; cy: number;
  bodyColor: string; accentColor: string; eye: string; acc: string; outfit: string;
}) {
  const renderHead = () => {
    switch (species) {

      case 'cat': return <>
        {/* Head */}
        <circle cx={cx} cy={cy} r="22" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Ears */}
        <polygon points={`${cx-20},${cy-14} ${cx-12},${cy-32} ${cx-4},${cy-16}`} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <polygon points={`${cx-18},${cy-15} ${cx-12},${cy-27} ${cx-6},${cy-17}`} fill={accentColor} stroke="none"/>
        <polygon points={`${cx+4},${cy-16} ${cx+12},${cy-32} ${cx+20},${cy-14}`} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <polygon points={`${cx+6},${cy-17} ${cx+12},${cy-27} ${cx+18},${cy-15}`} fill={accentColor} stroke="none"/>
        {/* Muzzle */}
        <ellipse cx={cx} cy={cy+8} rx="10" ry="7" fill={accentColor} stroke="#1a1a2e" strokeWidth="1.5"/>
        {/* Nose */}
        <ellipse cx={cx} cy={cy+5} rx="3" ry="2" fill="#ff9999" stroke="#1a1a2e" strokeWidth="1.5"/>
        {/* Whiskers */}
        <line x1={cx-22} y1={cy+7} x2={cx-10} y2={cy+8} stroke="#1a1a2e" strokeWidth="1.5"/>
        <line x1={cx-22} y1={cy+11} x2={cx-10} y2={cy+10} stroke="#1a1a2e" strokeWidth="1.5"/>
        <line x1={cx+10} y1={cy+8} x2={cx+22} y2={cy+7} stroke="#1a1a2e" strokeWidth="1.5"/>
        <line x1={cx+10} y1={cy+10} x2={cx+22} y2={cy+11} stroke="#1a1a2e" strokeWidth="1.5"/>
        <Eyes cx={cx} cy={cy-2} style={eye}/>
      </>;

      case 'dog': return <>
        <circle cx={cx} cy={cy} r="22" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Floppy ears */}
        <ellipse cx={cx-20} cy={cy+4} rx="9" ry="16" fill={accentColor} stroke="#1a1a2e" strokeWidth="2" transform={`rotate(-15 ${cx-20} ${cy+4})`}/>
        <ellipse cx={cx+20} cy={cy+4} rx="9" ry="16" fill={accentColor} stroke="#1a1a2e" strokeWidth="2" transform={`rotate(15 ${cx+20} ${cy+4})`}/>
        {/* Snout */}
        <ellipse cx={cx} cy={cy+9} rx="12" ry="9" fill={accentColor} stroke="#1a1a2e" strokeWidth="1.5"/>
        {/* Nose */}
        <ellipse cx={cx} cy={cy+4} rx="5" ry="4" fill="#1a1a2e"/>
        <ellipse cx={cx-1} cy={cy+3} rx="1.5" ry="1" fill="white" opacity="0.6"/>
        {/* Tongue */}
        <path d={`M${cx-4},${cy+12} Q${cx},${cy+18} ${cx+4},${cy+12}`} fill="#ff9999" stroke="#1a1a2e" strokeWidth="1.5"/>
        <Eyes cx={cx} cy={cy-4} style={eye}/>
      </>;

      case 'rabbit': return <>
        <circle cx={cx} cy={cy+2} r="20" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Long upright ears */}
        <ellipse cx={cx-10} cy={cy-28} rx="8" ry="20" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <ellipse cx={cx-10} cy={cy-28} rx="4" ry="16" fill={accentColor} stroke="none"/>
        <ellipse cx={cx+10} cy={cy-28} rx="8" ry="20" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <ellipse cx={cx+10} cy={cy-28} rx="4" ry="16" fill={accentColor} stroke="none"/>
        {/* Muzzle */}
        <ellipse cx={cx} cy={cy+10} rx="9" ry="7" fill={accentColor} stroke="#1a1a2e" strokeWidth="1.5"/>
        <ellipse cx={cx} cy={cy+7} rx="3" ry="2.5" fill="#ff9999" stroke="#1a1a2e" strokeWidth="1.5"/>
        {/* Whiskers */}
        <line x1={cx-20} y1={cy+9} x2={cx-8} y2={cy+10} stroke="#1a1a2e" strokeWidth="1.5"/>
        <line x1={cx+8} y1={cy+10} x2={cx+20} y2={cy+9} stroke="#1a1a2e" strokeWidth="1.5"/>
        <Eyes cx={cx} cy={cy-2} style={eye}/>
      </>;

      case 'bear': return <>
        <circle cx={cx} cy={cy} r="24" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Round ears */}
        <circle cx={cx-18} cy={cy-20} r="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <circle cx={cx-18} cy={cy-20} r="5" fill={accentColor} stroke="none"/>
        <circle cx={cx+18} cy={cy-20} r="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <circle cx={cx+18} cy={cy-20} r="5" fill={accentColor} stroke="none"/>
        {/* Muzzle */}
        <ellipse cx={cx} cy={cy+10} rx="13" ry="10" fill={accentColor} stroke="#1a1a2e" strokeWidth="1.5"/>
        <ellipse cx={cx} cy={cy+5} rx="5" ry="4" fill="#1a1a2e"/>
        <ellipse cx={cx-1} cy={cy+4} rx="1.5" ry="1" fill="white" opacity="0.5"/>
        <Eyes cx={cx} cy={cy-2} style={eye}/>
      </>;

      case 'fox': return <>
        <circle cx={cx} cy={cy} r="21" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Pointy ears */}
        <polygon points={`${cx-20},${cy-12} ${cx-10},${cy-34} ${cx-2},${cy-14}`} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <polygon points={`${cx-17},${cy-14} ${cx-10},${cy-28} ${cx-4},${cy-16}`} fill={accentColor} stroke="none"/>
        <polygon points={`${cx+2},${cy-14} ${cx+10},${cy-34} ${cx+20},${cy-12}`} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <polygon points={`${cx+4},${cy-16} ${cx+10},${cy-28} ${cx+17},${cy-14}`} fill={accentColor} stroke="none"/>
        {/* White muzzle patch */}
        <ellipse cx={cx} cy={cy+8} rx="11" ry="9" fill="white" stroke="#1a1a2e" strokeWidth="1.5"/>
        <ellipse cx={cx} cy={cy+4} rx="4" ry="3" fill="#1a1a2e"/>
        <ellipse cx={cx-1} cy={cy+3} rx="1.5" ry="1" fill="white" opacity="0.5"/>
        {/* Whiskers */}
        <line x1={cx-22} y1={cy+7} x2={cx-10} y2={cy+8} stroke="#1a1a2e" strokeWidth="1.5"/>
        <line x1={cx+10} y1={cy+8} x2={cx+22} y2={cy+7} stroke="#1a1a2e" strokeWidth="1.5"/>
        <Eyes cx={cx} cy={cy-3} style={eye}/>
      </>;

      case 'frog': return <>
        {/* Wide head */}
        <ellipse cx={cx} cy={cy+4} rx="24" ry="18" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* Bulgy eyes on top */}
        <circle cx={cx-12} cy={cy-14} r="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        <circle cx={cx+12} cy={cy-14} r="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
        {/* Pupils */}
        <circle cx={cx-12} cy={cy-14} r="5" fill="#1a1a2e"/>
        <circle cx={cx+12} cy={cy-14} r="5" fill="#1a1a2e"/>
        <circle cx={cx-10} cy={cy-16} r="2" fill="white" opacity="0.6"/>
        <circle cx={cx+14} cy={cy-16} r="2" fill="white" opacity="0.6"/>
        {/* Wide smile */}
        <path d={`M${cx-16},${cy+8} Q${cx},${cy+18} ${cx+16},${cy+8}`} fill={accentColor} stroke="#1a1a2e" strokeWidth="2"/>
        {/* Nostrils */}
        <circle cx={cx-4} cy={cy+2} r="2" fill="#1a1a2e" opacity="0.5"/>
        <circle cx={cx+4} cy={cy+2} r="2" fill="#1a1a2e" opacity="0.5"/>
      </>;

      case 'penguin': return <>
        <circle cx={cx} cy={cy} r="20" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
        {/* White face patch */}
        <ellipse cx={cx} cy={cy+4} rx="13" ry="15" fill="white" stroke="none"/>
        {/* Beak */}
        <polygon points={`${cx-5},${cy+8} ${cx+5},${cy+8} ${cx},${cy+16}`} fill="#f39c12" stroke="#1a1a2e" strokeWidth="1.5"/>
        <Eyes cx={cx} cy={cy-4} style={eye}/>
      </>;

      default: return null;
    }
  };

  return <g>
    {renderHead()}
    {acc==='hat'    && <HatAcc cx={cx} cy={cy-14} outfitColor={outfit}/>}
    {acc==='crown'  && <CrownAcc cx={cx} cy={cy-16}/>}
    {acc==='glasses'&& <GlassesAcc cx={cx} cy={cy}/>}
  </g>;
}

// ─── Animal body builder per pose ───────────────────────────────────────────
function Animal({ character, pose, size }: { character: any; pose: CharacterPose; size: number }) {
  const species     = (character.species || 'cat') as CharacterSpecies;
  const bodyColor   = character.skinColor   || defaultBodyColor(species);
  const accentColor = character.hairColor   || defaultAccentColor(species);
  const outfit      = character.outfitColor || '#4a90e2';
  const eye         = character.eyeStyle    || 'happy';
  const acc         = character.accessory   || 'none';

  const headProps = { species, bodyColor, accentColor, eye, acc, outfit };

  // Shared body parts
  const Body = ({ x=18, y=54, w=44, h=32, r=10 }: any) => <rect x={x} y={y} width={w} height={h} rx={r} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>;
  const Limb = ({ x=0, y=0, w=12, h=22, rx=6, rot=0, cx=0, cy=0 }: any) => <rect x={x} y={y} width={w} height={h} rx={rx} fill={bodyColor} stroke="#1a1a2e" strokeWidth="2" transform={rot?`rotate(${rot} ${cx} ${cy})`:undefined}/>;
  // Tail
  const Tail = ({ tx=62, ty=62 }: any) => {
    if (species === 'cat') return <path d={`M${tx},${ty} Q${tx+16},${ty-20} ${tx+10},${ty-36}`} fill="none" stroke={bodyColor} strokeWidth="7" strokeLinecap="round"/>;
    if (species === 'dog') return <path d={`M${tx},${ty} Q${tx+20},${ty-14} ${tx+16},${ty-28}`} fill="none" stroke={bodyColor} strokeWidth="8" strokeLinecap="round"/>;
    if (species === 'rabbit') return <ellipse cx={tx+6} cy={ty-4} rx="7" ry="6" fill="white" stroke="#1a1a2e" strokeWidth="1.5"/>;
    if (species === 'fox')  return <path d={`M${tx},${ty} Q${tx+18},${ty-10} ${tx+22},${ty-28}`} fill="none" stroke={accentColor} strokeWidth="9" strokeLinecap="round"/>;
    if (species === 'bear') return <ellipse cx={tx+5} cy={ty} rx="6" ry="5" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>;
    return null;
  };

  if (pose === 'standing') return (
    <svg width={size} height={size*1.4} viewBox="0 0 80 112" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={40} bodyY={54} hairColor={accentColor}/>}
      <Body/>
      <Tail/>
      <Limb x={4}  y={58} w={13} h={26} rot={-8}  cx={4}  cy={58}/>
      <Limb x={63} y={58} w={13} h={26} rot={8}   cx={63} cy={58}/>
      <Limb x={20} y={82} w={13} h={20} rx={6}/>
      <Limb x={47} y={82} w={13} h={20} rx={6}/>
      <AnimalHead cx={40} cy={34} {...headProps}/>
    </svg>
  );

  if (pose === 'sitting') return (
    <svg width={size*1.1} height={size} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <Body x={26} y={36} w={38} h={30} r={10}/>
      <Tail tx={65} ty={60}/>
      {/* Arms */}
      <Limb x={12} y={44} w={13} h={22} rot={-15} cx={12} cy={44}/>
      <Limb x={66} y={44} w={13} h={22} rot={15}  cx={66} cy={44}/>
      {/* Legs tucked */}
      <rect x={12} y={62} width="26" height="13" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x={52} y={62} width="26" height="13" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <Tail tx={65} ty={64}/>
      <AnimalHead cx={45} cy={24} {...headProps}/>
    </svg>
  );

  if (pose === 'lying') return (
    <svg width={size*1.7} height={size*0.75} viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="26" width="68" height="24" rx="12" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
      <Tail tx={96} ty={36}/>
      {/* Legs folded */}
      <rect x="34" y="46" width="22" height="10" rx="5" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="72" y="46" width="22" height="10" rx="5" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <AnimalHead cx={20} cy={22} {...headProps}/>
    </svg>
  );

  if (pose === 'running') return (
    <svg width={size*1.1} height={size} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={48} bodyY={36} hairColor={accentColor}/>}
      <rect x="28" y="36" width="38" height="24" rx="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5" transform="rotate(-12 47 48)"/>
      <Tail tx={64} ty={44}/>
      {/* Front legs reaching forward */}
      <Limb x={10} y={38} w={12} h={24} rot={-40} cx={16} cy={38}/>
      <Limb x={60} y={32} w={12} h={24} rot={30}  cx={66} cy={32}/>
      {/* Back legs pushing off */}
      <Limb x={18} y={58} w={12} h={22} rot={30}  cx={24} cy={58}/>
      <Limb x={56} y={54} w={12} h={22} rot={-20} cx={62} cy={54}/>
      <AnimalHead cx={52} cy={22} {...headProps}/>
    </svg>
  );

  if (pose === 'walking') return (
    <svg width={size} height={size*1.1} viewBox="0 0 85 90" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="36" width="40" height="26" rx="10" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5" transform="rotate(-5 42 49)"/>
      <Tail tx={62} ty={50}/>
      <Limb x={8}  y={46} w={12} h={22} rot={-20} cx={8}  cy={46}/>
      <Limb x={64} y={50} w={12} h={22} rot={15}  cx={64} cy={50}/>
      <Limb x={18} y={58} w={12} h={22} rot={-15} cx={18} cy={58}/>
      <Limb x={52} y={58} w={12} h={22} rot={18}  cx={52} cy={58}/>
      <AnimalHead cx={42} cy={22} {...headProps}/>
    </svg>
  );

  if (pose === 'jumping') return (
    <svg width={size*1.1} height={size*1.1} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      {acc==='cape'&&<CapeAcc bodyX={45} bodyY={32} hairColor={accentColor}/>}
      <rect x="28" y="32" width="34" height="26" rx="9" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
      <Tail tx={62} ty={46}/>
      {/* Arms up */}
      <Limb x={10} y={28} w={12} h={22} rot={-40} cx={10} cy={28}/>
      <Limb x={68} y={28} w={12} h={22} rot={40}  cx={68} cy={28}/>
      {/* Legs splayed */}
      <Limb x={18} y={56} w={13} h={22} rot={-28} cx={18} cy={56}/>
      <Limb x={58} y={56} w={13} h={22} rot={28}  cx={58} cy={56}/>
      <AnimalHead cx={45} cy={18} {...headProps}/>
    </svg>
  );

  // crawling — on all fours, natural for animals
  return (
    <svg width={size*1.6} height={size*0.85} viewBox="0 0 130 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="24" width="60" height="26" rx="12" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2.5"/>
      <Tail tx={88} ty={36}/>
      {/* Front legs */}
      <rect x="12" y="38" width="12" height="22" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="38" y="46" width="12" height="20" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      {/* Back legs */}
      <rect x="68" y="46" width="12" height="20" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <rect x="92" y="38" width="12" height="22" rx="6" fill={bodyColor} stroke="#1a1a2e" strokeWidth="2"/>
      <AnimalHead cx={18} cy={18} {...headProps}/>
    </svg>
  );
}

// ─── Default colors per species ──────────────────────────────────────────────
function defaultBodyColor(s: CharacterSpecies): string {
  const map: Record<CharacterSpecies, string> = {
    human: '#ffcc99', cat: '#f4a056', dog: '#c8a068', rabbit: '#e8d8c8',
    bear: '#8b6340', fox: '#e8621a', frog: '#5aad3c', penguin: '#1a1a2e',
  };
  return map[s];
}
function defaultAccentColor(s: CharacterSpecies): string {
  const map: Record<CharacterSpecies, string> = {
    human: '#333', cat: '#fff5e8', dog: '#a07840', rabbit: '#f8c0b8',
    bear: '#c8a478', fox: '#ffffff', frog: '#78dd58', penguin: '#1a1a2e',
  };
  return map[s];
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ════════════════════════════════════════════════════════════════════════════
export default function CharacterSVG({ character, pose = 'standing', size = 80 }: Props) {
  const species = (character as any).species as CharacterSpecies | undefined;
  if (!species || species === 'human') {
    return <Human character={character} pose={pose} size={size} />;
  }
  return <Animal character={character} pose={pose} size={size} />;
}
