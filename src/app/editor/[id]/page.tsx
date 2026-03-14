'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getComic, updateComic } from '@/lib/comicsService';
import { Comic, Character, ComicPanel, TextBubble, BubbleType, PageCharacter, CharacterPose } from '@/types';
import CharacterBuilder from '@/components/characters/CharacterBuilder';
import CharacterSVG, { POSES } from '@/components/characters/CharacterSVG';
import ComicBot from '@/components/editor/ComicBot';
import BubblePicker from '@/components/editor/BubblePicker';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const BG_COLORS = ['#ffffff','#fff8f0','#e8f4fd','#f0fdf4','#fef9c3','#fce7f3','#1a1a2e','#2d5016','#4a1a4a'];
type ActiveTool = 'draw' | 'erase' | 'move';
type ActivePanel = 'draw' | 'chars' | 'bubbles' | 'bg';

interface SelectedItem { type: 'char' | 'bubble'; id: string; }

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  const [comic, setComic]             = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [tool, setTool]               = useState<ActiveTool>('draw');
  const [penColor, setPenColor]       = useState('#1a1a2e');
  const [penSize, setPenSize]         = useState(4);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [showCharBuilder, setShowCharBuilder]   = useState(false);
  const [showBubblePicker, setShowBubblePicker] = useState(false);
  const [showBot, setShowBot]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('draw');

  // ── Selection is SEPARATE from dragging ──────────────────────────
  // selected: which item shows controls in the bottom panel (persists until user taps empty space)
  // dragging: which item is currently being moved (only active during pointer down+move)
  const [selected, setSelected]           = useState<SelectedItem | null>(null);
  const isDraggingRef                     = useRef(false);
  const draggingIdRef                     = useRef<string | null>(null);
  const draggingTypeRef                   = useRef<'char' | 'bubble' | null>(null);
  const dragOffset                        = useRef({ x: 0, y: 0 });
  const lastPos                           = useRef<{ x: number; y: number } | null>(null);
  // keep comic in a ref so drag move handler always has fresh data
  const comicRef = useRef<Comic | null>(null);
  comicRef.current = comic;

  useEffect(() => { if (id && id !== 'new') loadComic(); }, [id]);

  useEffect(() => {
    const page = comic?.pages[currentPage];
    if (!page || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (page.drawingData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = page.drawingData;
    }
  }, [currentPage, comic?.id]);

  async function loadComic() {
    const data = await getComic(id as string);
    if (data) {
      setComic(data);
      if (data.pages.length === 0) { const c = addNewPage(data); setComic(c); }
    }
  }

  function addNewPage(c: Comic): Comic {
    const page: ComicPanel = {
      id: uuidv4(), layout: '1', backgroundColor: '#ffffff',
      backgroundPattern: 'none', characters: [], textBubbles: [],
      soundEffects: [], drawingData: '', pageNumber: c.pages.length + 1,
    };
    const updated = { ...c, pages: [...c.pages, page], pageCount: c.pages.length + 1 };
    setCurrentPage(updated.pages.length - 1);
    return updated;
  }

  async function saveComic(c: Comic) {
    setSaving(true);
    try {
      let pages = [...c.pages];
      if (canvasRef.current && pages[currentPage]) {
        pages[currentPage] = { ...pages[currentPage], drawingData: canvasRef.current.toDataURL() };
      }
      await updateComic(c.id, { pages, pageCount: c.pageCount, characters: c.characters });
      setComic({ ...c, pages });
      toast.success('Saved! 💾');
    } catch (e) { console.error(e); toast.error('Save failed'); }
    setSaving(false);
  }

  // ── Drawing ───────────────────────────────────────────────────────
  function getCanvasPos(e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const src  = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    return {
      x: (src.clientX - rect.left) * (canvas.width  / rect.width),
      y: (src.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }
  function startDraw(e: React.TouchEvent | React.MouseEvent) {
    if (tool === 'move' || !canvasRef.current) return;
    e.preventDefault(); setIsDrawing(true);
    lastPos.current = getCanvasPos(e, canvasRef.current);
  }
  function draw(e: React.TouchEvent | React.MouseEvent) {
    if (!isDrawing || tool === 'move' || !canvasRef.current || !lastPos.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d')!;
    const pos = getCanvasPos(e, canvasRef.current);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'erase' ? (comicRef.current?.pages[currentPage]?.backgroundColor || '#ffffff') : penColor;
    ctx.lineWidth   = tool === 'erase' ? penSize * 5 : penSize;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    lastPos.current = pos;
  }
  function endDraw() { setIsDrawing(false); lastPos.current = null; }

  // ── Drag (move tool) ──────────────────────────────────────────────
  // Called from the item itself on pointer down
  function startItemDrag(
    e: React.TouchEvent | React.MouseEvent,
    type: 'char' | 'bubble',
    itemId: string,
    currentX: number,
    currentY: number
  ) {
    e.stopPropagation();
    // Select this item (persists)
    setSelected({ type, id: itemId });
    // Start drag tracking
    isDraggingRef.current    = true;
    draggingIdRef.current    = itemId;
    draggingTypeRef.current  = type;
    const src  = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    const area = canvasAreaRef.current!.getBoundingClientRect();
    dragOffset.current = {
      x: src.clientX - area.left - (currentX / 100) * area.width,
      y: src.clientY - area.top  - (currentY / 100) * area.height,
    };
  }

  // Called on the canvas AREA during pointer move
  function onAreaPointerMove(e: React.TouchEvent | React.MouseEvent) {
    if (!isDraggingRef.current || !draggingIdRef.current || !comicRef.current) return;
    const src  = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    const area = canvasAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const x = Math.max(2, Math.min(95, ((src.clientX - rect.left - dragOffset.current.x) / rect.width)  * 100));
    const y = Math.max(2, Math.min(92, ((src.clientY - rect.top  - dragOffset.current.y) / rect.height) * 100));

    const c = comicRef.current;
    if (draggingTypeRef.current === 'char') {
      setComic({ ...c, pages: c.pages.map((p, i) => i !== currentPage ? p :
        { ...p, characters: p.characters.map(ch => ch.characterId === draggingIdRef.current ? { ...ch, x, y } : ch) }) });
    } else {
      setComic({ ...c, pages: c.pages.map((p, i) => i !== currentPage ? p :
        { ...p, textBubbles: p.textBubbles.map(b => b.id === draggingIdRef.current ? { ...b, x, y } : b) }) });
    }
  }

  // Called on the canvas AREA on pointer UP — only stops dragging, does NOT clear selection
  function onAreaPointerUp() {
    isDraggingRef.current   = false;
    draggingIdRef.current   = null;
    draggingTypeRef.current = null;
  }

  // Tap on empty canvas area in move mode → deselect
  function onAreaClick(e: React.MouseEvent | React.TouchEvent) {
    if ((e.target as HTMLElement) === canvasAreaRef.current || (e.target as HTMLElement) === canvasRef.current) {
      setSelected(null);
    }
  }

  // ── Update helpers ────────────────────────────────────────────────
  function updateChar(charId: string, patch: Partial<PageCharacter>) {
    if (!comic) return;
    setComic({ ...comic, pages: comic.pages.map((p, i) => i !== currentPage ? p :
      { ...p, characters: p.characters.map(c => c.characterId === charId ? { ...c, ...patch } : c) }) });
  }
  function updateBubble(bubbleId: string, patch: Partial<TextBubble>) {
    if (!comic) return;
    setComic({ ...comic, pages: comic.pages.map((p, i) => i !== currentPage ? p :
      { ...p, textBubbles: p.textBubbles.map(b => b.id === bubbleId ? { ...b, ...patch } : b) }) });
  }
  function removeChar(charId: string) {
    if (!comic) return;
    setComic({ ...comic, pages: comic.pages.map((p, i) => i !== currentPage ? p :
      { ...p, characters: p.characters.filter(c => c.characterId !== charId) }) });
    if (selected?.id === charId) setSelected(null);
  }
  function removeBubble(bubbleId: string) {
    if (!comic) return;
    setComic({ ...comic, pages: comic.pages.map((p, i) => i !== currentPage ? p :
      { ...p, textBubbles: p.textBubbles.filter(b => b.id !== bubbleId) }) });
    if (selected?.id === bubbleId) setSelected(null);
  }

  function handleAddChar(char: Character) {
    if (!comic) return;
    const existingIdx = comic.characters.findIndex(c => c.id === char.id);
    let chars = [...comic.characters];
    if (existingIdx >= 0) chars[existingIdx] = char; else chars = [...chars, char];
    const pages = comic.pages.map((p, i) => {
      if (i !== currentPage) return p;
      if (p.characters.find(c => c.characterId === char.id)) return p;
      return { ...p, characters: [...p.characters, { characterId: char.id, x: 40, y: 40, size: 70, flipped: false, pose: 'standing' as CharacterPose }] };
    });
    setComic({ ...comic, characters: chars, pages });
    setShowCharBuilder(false);
    toast.success(`${char.name} added! 🎉`);
  }

  function handleAddBubble(type: BubbleType, text: string) {
    if (!comic) return;
    const bubble: TextBubble = { id: uuidv4(), type, text, x: 10, y: 10, width: 45, fontSize: 13 };
    const pages = comic.pages.map((p, i) => i === currentPage ? { ...p, textBubbles: [...p.textBubbles, bubble] } : p);
    setComic({ ...comic, pages });
    setShowBubblePicker(false);
    toast.success('Bubble added! 💬');
  }

  const page      = comic?.pages[currentPage];
  const selChar   = selected?.type === 'char'   ? page?.characters.find(c => c.characterId === selected.id) : null;
  const selBubble = selected?.type === 'bubble' ? page?.textBubbles.find(b => b.id === selected.id)        : null;
  const showControls = tool === 'move' && selected && (selChar || selBubble);

  return (
    <div className="flex flex-col h-screen bg-amber-50 overflow-hidden">

      {/* Header */}
      <div className="bg-amber-400 border-b-4 border-amber-900 px-4 pt-10 pb-2 flex items-center justify-between shrink-0">
        <button onClick={() => router.push('/library')} className="font-extrabold text-amber-900 text-xl px-1">←</button>
        <h1 className="font-display text-xl text-amber-900 truncate max-w-[150px]">{comic?.title || '...'}</h1>
        <button onClick={() => comic && saveComic(comic)}
          className="btn-ink bg-white text-amber-900 px-3 py-1 rounded-lg text-sm font-extrabold">
          {saving ? '⏳' : '💾 Save'}
        </button>
      </div>

      {/* Page tabs */}
      <div className="flex overflow-x-auto gap-2 px-3 py-2 bg-white border-b-2 border-amber-200 shrink-0">
        {comic?.pages.map((p, i) => (
          <button key={p.id} onClick={() => { setCurrentPage(i); setSelected(null); }}
            className={`shrink-0 w-10 h-10 rounded-lg font-extrabold text-sm btn-ink ${i === currentPage ? 'bg-amber-400 text-amber-900' : 'bg-white text-gray-600'}`}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => { if (comic) { const c = addNewPage(comic); setComic(c); }}}
          className="shrink-0 w-10 h-10 rounded-lg btn-ink bg-orange-100 text-orange-700 font-extrabold text-xl">+</button>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasAreaRef}
        className="flex-1 relative overflow-hidden"
        style={{ backgroundColor: page?.backgroundColor || '#fff', cursor: tool === 'move' ? 'default' : 'crosshair' }}
        onMouseMove={onAreaPointerMove}
        onMouseUp={onAreaPointerUp}
        onTouchMove={onAreaPointerMove}
        onTouchEnd={onAreaPointerUp}
        onClick={onAreaClick}
      >
        {/* Drawing canvas */}
        <canvas ref={canvasRef} width={800} height={600}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none', pointerEvents: tool === 'move' ? 'none' : 'auto' }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />

        {/* Characters */}
        {page?.characters.map(pc => {
          const char = comic?.characters.find(c => c.id === pc.characterId);
          if (!char) return null;
          const isSelected = selected?.type === 'char' && selected.id === pc.characterId;
          return (
            <div key={pc.characterId}
              className="absolute select-none"
              style={{
                left: `${pc.x}%`, top: `${pc.y}%`,
                transform: `translate(-50%,-50%) scaleX(${pc.flipped ? -1 : 1})`,
                cursor: tool === 'move' ? 'grab' : 'default',
                zIndex: isSelected ? 50 : 10,
                outline: isSelected && tool === 'move' ? '3px dashed #f97316' : 'none',
                outlineOffset: '6px', borderRadius: '4px',
              }}
              onMouseDown={tool === 'move' ? (e) => startItemDrag(e, 'char', pc.characterId, pc.x, pc.y) : undefined}
              onTouchStart={tool === 'move' ? (e) => startItemDrag(e, 'char', pc.characterId, pc.x, pc.y) : undefined}
            >
              <CharacterSVG character={char} pose={pc.pose || 'standing'} size={pc.size || 70}/>
              {isSelected && tool === 'move' && (
                <button
                  className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full text-base font-bold z-30 flex items-center justify-center shadow-md"
                  onMouseDown={e => { e.stopPropagation(); removeChar(pc.characterId); }}
                  onTouchStart={e => { e.stopPropagation(); removeChar(pc.characterId); }}
                >×</button>
              )}
            </div>
          );
        })}

        {/* Text bubbles */}
        {page?.textBubbles.map(bubble => {
          const isSelected = selected?.type === 'bubble' && selected.id === bubble.id;
          const fs = bubble.fontSize || 13;
          return (
            <div key={bubble.id}
              className="absolute select-none"
              style={{
                left: `${bubble.x}%`, top: `${bubble.y}%`,
                maxWidth: `${bubble.width}%`,
                cursor: tool === 'move' ? 'grab' : 'default',
                zIndex: isSelected ? 50 : 20,
              }}
              onMouseDown={tool === 'move' ? (e) => startItemDrag(e, 'bubble', bubble.id, bubble.x, bubble.y) : undefined}
              onTouchStart={tool === 'move' ? (e) => startItemDrag(e, 'bubble', bubble.id, bubble.x, bubble.y) : undefined}
            >
              <div className={`relative px-3 py-2 font-bold bg-white border-2 border-gray-900
                ${bubble.type === 'shout'   ? 'bg-yellow-300 font-display' : ''}
                ${bubble.type === 'thought' ? 'rounded-3xl border-dotted' : 'rounded-xl'}
                ${bubble.type === 'whisper' ? 'border-dashed opacity-80'  : ''}
                ${isSelected && tool === 'move' ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
              `} style={{ fontSize: `${fs}px`, lineHeight: 1.3 }}>
                {bubble.text}
                {(bubble.type === 'speech' || bubble.type === 'whisper') && (
                  <div className="absolute -bottom-2 left-4 w-0 h-0"
                    style={{ borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderTop:'8px solid #1a1a2e' }}/>
                )}
                {bubble.type === 'shout' && (
                  <div className="absolute -bottom-2 left-4 w-0 h-0"
                    style={{ borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'7px solid #1a1a2e' }}/>
                )}
              </div>
              {isSelected && tool === 'move' && (
                <button
                  className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full text-base font-bold z-30 flex items-center justify-center shadow-md"
                  onMouseDown={e => { e.stopPropagation(); removeBubble(bubble.id); }}
                  onTouchStart={e => { e.stopPropagation(); removeBubble(bubble.id); }}
                >×</button>
              )}
            </div>
          );
        })}

        {/* Sound effects */}
        {page?.soundEffects.map((sfx, i) => (
          <div key={i} className="absolute font-display text-2xl pointer-events-none"
            style={{ left:`${sfx.x}%`, top:`${sfx.y}%`, color:sfx.color, transform:'rotate(-10deg)', zIndex:15 }}>
            {sfx.text}
          </div>
        ))}

        {/* Move hint when nothing selected */}
        {tool === 'move' && !selected && (
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">
              ✋ Tap a character or bubble to select it
            </div>
          </div>
        )}
        {tool === 'move' && selected && (
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
              ✅ Selected — use controls below • drag to move • tap empty area to deselect
            </div>
          </div>
        )}
      </div>

      {/* ── Selected item controls — always visible when item is selected ── */}
      {showControls && (
        <div className="bg-purple-50 border-t-2 border-purple-300 px-4 py-3 shrink-0"
          // stop clicks here from bubbling up to the canvas area (which would deselect)
          onClick={e => e.stopPropagation()}>
          {selChar && (() => {
            const char = comic?.characters.find(c => c.id === selChar.characterId);
            return (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-extrabold text-purple-900 text-sm">🦸 {char?.name} — controls</p>
                  <button onClick={() => setSelected(null)} className="text-purple-400 text-lg font-bold">✕</button>
                </div>
                {/* Size */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-extrabold text-purple-700 w-10">Size</span>
                  <input type="range" min="30" max="160" step="5"
                    value={selChar.size || 70}
                    onChange={e => updateChar(selChar.characterId, { size: +e.target.value })}
                    className="flex-1" />
                  <span className="text-xs font-bold text-purple-600 w-10 text-right">{selChar.size || 70}px</span>
                </div>
                {/* Flip */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => updateChar(selChar.characterId, { flipped: !selChar.flipped })}
                    className={`btn-ink px-4 py-2 rounded-xl text-sm font-bold ${selChar.flipped ? 'bg-purple-400 text-purple-900' : 'bg-white text-gray-700'}`}>
                    ↔ Flip {selChar.flipped ? '(ON)' : '(OFF)'}
                  </button>
                </div>
                {/* Pose */}
                <p className="text-xs font-extrabold text-purple-700 mb-1">Pose</p>
                <div className="flex gap-1 flex-wrap">
                  {POSES.map(p => (
                    <button key={p.key}
                      onClick={() => updateChar(selChar.characterId, { pose: p.key })}
                      className={`btn-ink px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        (selChar.pose || 'standing') === p.key ? 'bg-purple-400 text-purple-900' : 'bg-white text-gray-600'
                      }`}>
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {selBubble && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-extrabold text-purple-900 text-sm">💬 Bubble — controls</p>
                <button onClick={() => setSelected(null)} className="text-purple-400 text-lg font-bold">✕</button>
              </div>
              {/* Font size */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-extrabold text-purple-700 w-16">Text size</span>
                <input type="range" min="9" max="30" step="1"
                  value={selBubble.fontSize || 13}
                  onChange={e => updateBubble(selBubble.id, { fontSize: +e.target.value })}
                  className="flex-1" />
                <span className="text-xs font-bold text-purple-600 w-10 text-right">{selBubble.fontSize || 13}px</span>
              </div>
              {/* Width */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-purple-700 w-16">Width</span>
                <input type="range" min="15" max="85" step="5"
                  value={selBubble.width || 45}
                  onChange={e => updateBubble(selBubble.id, { width: +e.target.value })}
                  className="flex-1" />
                <span className="text-xs font-bold text-purple-600 w-10 text-right">{selBubble.width || 45}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="bg-white border-t-4 border-amber-900 shrink-0">
        <div className="flex border-b-2 border-amber-100">
          {([
            { key: 'draw',    icon: '✏️', label: 'Draw'    },
            { key: 'chars',   icon: '🦸', label: 'Chars'   },
            { key: 'bubbles', icon: '💬', label: 'Bubbles' },
            { key: 'bg',      icon: '🎨', label: 'BG'      },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActivePanel(t.key)}
              className={`flex-1 py-2 text-xs font-extrabold flex flex-col items-center gap-0.5 ${
                activePanel === t.key ? 'text-orange-600 bg-orange-50' : 'text-gray-500'
              }`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="p-3">
          {activePanel === 'draw' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {([
                  { t: 'draw'  as ActiveTool, icon: '✏️', label: 'Draw'  },
                  { t: 'erase' as ActiveTool, icon: '🧹', label: 'Erase' },
                  { t: 'move'  as ActiveTool, icon: '✋', label: 'Move'  },
                ]).map(btn => (
                  <button key={btn.t} onClick={() => { setTool(btn.t); if (btn.t !== 'move') setSelected(null); }}
                    className={`btn-ink px-3 py-2 rounded-lg text-sm font-bold ${tool === btn.t ? 'bg-amber-400' : 'bg-white'}`}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
              {tool !== 'move' && (
                <div className="flex items-center gap-2 flex-wrap">
                  {['#1a1a2e','#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#ffffff','#ff6b9d'].map(c => (
                    <button key={c} onClick={() => { setPenColor(c); setTool('draw'); }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${penColor === c ? 'border-amber-900 scale-125' : 'border-gray-300'}`}
                      style={{ backgroundColor: c }}/>
                  ))}
                  <input type="range" min="2" max="24" value={penSize}
                    onChange={e => setPenSize(+e.target.value)} className="w-20 ml-1"/>
                  <span className="text-xs font-bold text-gray-500">{penSize}px</span>
                </div>
              )}
              {tool === 'move' && (
                <p className="text-xs text-amber-700 font-bold">
                  Tap any character or bubble on the canvas → controls appear above this bar
                </p>
              )}
            </div>
          )}

          {activePanel === 'chars' && (
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={() => setShowCharBuilder(true)}
                className="btn-ink bg-amber-400 text-amber-900 px-3 py-2 rounded-xl font-extrabold text-sm">
                + New Character
              </button>
              {comic?.characters.map(char => (
                <button key={char.id}
                  onClick={() => {
                    if (!comic || !page) return;
                    if (page.characters.find(c => c.characterId === char.id)) { toast('Already on this page!'); return; }
                    const pages = comic.pages.map((p, i) => i !== currentPage ? p : {
                      ...p, characters: [...p.characters, { characterId: char.id, x: 50, y: 50, size: 70, flipped: false, pose: 'standing' as CharacterPose }]
                    });
                    setComic({ ...comic, pages });
                    toast.success(`${char.name} added!`);
                  }}
                  className="btn-ink bg-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <CharacterSVG character={char} size={28}/>
                  {char.name}
                </button>
              ))}
              {(comic?.characters.length ?? 0) > 0 && (
                <p className="text-xs text-gray-400 w-full mt-1">Switch to ✋ Move → tap a character to resize / change pose</p>
              )}
            </div>
          )}

          {activePanel === 'bubbles' && (
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={() => setShowBubblePicker(true)}
                className="btn-ink bg-blue-400 text-blue-900 px-3 py-2 rounded-xl font-extrabold text-sm">+ Add Bubble</button>
              <button onClick={() => setShowBot(true)}
                className="btn-ink bg-purple-400 text-purple-900 px-3 py-2 rounded-xl font-extrabold text-sm">🤖 ComicBot</button>
              {(page?.textBubbles.length ?? 0) > 0 && (
                <p className="text-xs text-gray-400 w-full mt-1">Switch to ✋ Move → tap a bubble to resize it</p>
              )}
            </div>
          )}

          {activePanel === 'bg' && (
            <div className="flex gap-2 flex-wrap items-center">
              {BG_COLORS.map(c => (
                <button key={c}
                  onClick={() => {
                    if (!comic || !page) return;
                    const pages = comic.pages.map((p, i) => i === currentPage ? { ...p, backgroundColor: c } : p);
                    setComic({ ...comic, pages });
                  }}
                  className="w-9 h-9 rounded-lg transition-transform"
                  style={{
                    backgroundColor: c,
                    border: page?.backgroundColor === c ? '3px solid #f97316' : '2px solid #d1d5db',
                    transform: page?.backgroundColor === c ? 'scale(1.15)' : 'scale(1)',
                  }}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCharBuilder  && <CharacterBuilder onSave={handleAddChar}    onClose={() => setShowCharBuilder(false)}  />}
      {showBubblePicker && <BubblePicker     onSelect={handleAddBubble} onClose={() => setShowBubblePicker(false)} />}
      {showBot          && <ComicBot comicTitle={comic?.title}          onClose={() => setShowBot(false)}          />}
    </div>
  );
}
