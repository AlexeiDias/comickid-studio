'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getComic, updateComic } from '@/lib/comicsService';
import { Comic, Character, ComicPanel, TextBubble, BubbleType, PageCharacter, CharacterPose } from '@/types';
import CharacterBuilder from '@/components/characters/CharacterBuilder';
import CharacterSVG, { POSES } from '@/components/characters/CharacterSVG';
import { SceneBackground, SCENES } from '@/components/editor/SceneBackgrounds';
import ComicBot from '@/components/editor/ComicBot';
import BubblePicker from '@/components/editor/BubblePicker';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

type ShapeTool = 'rect' | 'circle' | 'triangle' | 'star' | 'oval';
const SHAPES: Array<{ key: ShapeTool; label: string; emoji: string }> = [
  { key: 'rect',     label: 'Square',   emoji: '⬜' },
  { key: 'circle',   label: 'Circle',   emoji: '⭕' },
  { key: 'triangle', label: 'Triangle', emoji: '🔺' },
  { key: 'star',     label: 'Star',     emoji: '⭐' },
  { key: 'oval',     label: 'Oval',     emoji: '🫧' },
];

type ActiveTool = 'draw' | 'erase' | 'move' | 'shape';
type ActivePanel = 'draw' | 'chars' | 'bubbles' | 'bg';
interface SelectedItem { type: 'char' | 'bubble'; id: string; }

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const spikes = 5, innerR = r * 0.45;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r); rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
  }
  ctx.lineTo(cx, cy - r);
  ctx.closePath();
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  const [comic, setComic]             = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [tool, setTool]               = useState<ActiveTool>('draw');
  const [shapeTool, setShapeTool]     = useState<ShapeTool>('rect');
  const [penColor, setPenColor]       = useState('#1a1a2e');
  const [penSize, setPenSize]         = useState(4);
  const [fillShape, setFillShape]     = useState(false);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [showCharBuilder, setShowCharBuilder]   = useState(false);
  const [showBubblePicker, setShowBubblePicker] = useState(false);
  const [showBot, setShowBot]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('draw');
  const [selected, setSelected]       = useState<SelectedItem | null>(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false); // ✅ FIX 2

  const isDraggingRef   = useRef(false);
  const draggingIdRef   = useRef<string | null>(null);
  const draggingTypeRef = useRef<'char' | 'bubble' | null>(null);
  const dragOffset      = useRef({ x: 0, y: 0 });
  const lastPos         = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef     = useRef<ImageData | null>(null);
  const shapeStartRef   = useRef<{ x: number; y: number } | null>(null);
  const comicRef        = useRef<Comic | null>(null);
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

  function addNewPage(c: Comic, copyFrom?: ComicPanel): Comic {
    const source = copyFrom;
    const page: ComicPanel = {
      id: uuidv4(),
      layout: source?.layout || '1',
      backgroundColor: source?.backgroundColor || '#ffffff',
      backgroundPattern: source?.backgroundPattern || 'none',
      sceneKey: source?.sceneKey || 'blank',
      // ✅ FIX 2: Deep copy characters and bubbles with new IDs for bubbles
      characters: source ? source.characters.map(c => ({ ...c })) : [],
      textBubbles: source ? source.textBubbles.map(b => ({ ...b, id: uuidv4() })) : [],
      soundEffects: source ? source.soundEffects.map(s => ({ ...s })) : [],
      drawingData: '',  // canvas drawing is NOT copied (would need async)
      pageNumber: c.pages.length + 1,
    };
    const updated = { ...c, pages: [...c.pages, page], pageCount: c.pages.length + 1 };
    setCurrentPage(updated.pages.length - 1);
    return updated;
  }

  // ✅ FIX 2: Copy current page to new page
  function handleCopyPage() {
    if (!comic) return;
    const sourcePage = comic.pages[currentPage];
    // Save canvas before copying
    if (canvasRef.current) {
      const drawingData = canvasRef.current.toDataURL();
      const pages = [...comic.pages];
      pages[currentPage] = { ...pages[currentPage], drawingData };
      const updated = addNewPage({ ...comic, pages }, pages[currentPage]);
      // Now copy canvas drawing to new page
      const newPage = updated.pages[updated.pages.length - 1];
      newPage.drawingData = drawingData; // copy drawing too
      setComic(updated);
      // Restore drawing on new page after render
      setTimeout(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = drawingData;
      }, 100);
    } else {
      const updated = addNewPage(comic, sourcePage);
      setComic(updated);
    }
    setShowCopyConfirm(false);
    toast.success('Page copied! ✂️ Modify away!');
  }

  async function saveComic(c: Comic) {
    setSaving(true);
    try {
      let pages = [...c.pages];
      if (canvasRef.current && pages[currentPage]) {
        pages[currentPage] = { ...pages[currentPage], drawingData: canvasRef.current.toDataURL() };
      }
      await updateComic(c.id, { pages, pageCount: c.pageCount, characters: c.characters, title: c.title });
      setComic({ ...c, pages });
      toast.success('Saved! 💾');
    } catch (e) { console.error(e); toast.error('Save failed'); }
    setSaving(false);
  }

  async function handleTitleSave(newTitle: string) {
    if (!comic || !newTitle.trim()) return;
    const updated = { ...comic, title: newTitle.trim() };
    setComic(updated);
    setEditingTitle(false);
    await updateComic(comic.id, { title: newTitle.trim() });
  }

  // ── Canvas helpers ─────────────────────────────────────────────────
  function getCanvasPos(e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const src  = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  }

  function startDraw(e: React.TouchEvent | React.MouseEvent) {
    if (tool === 'move' || !canvasRef.current) return;
    e.preventDefault();
    const pos = getCanvasPos(e, canvasRef.current);
    if (tool === 'shape') {
      const ctx = canvasRef.current.getContext('2d')!;
      snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      shapeStartRef.current = pos;
    }
    setIsDrawing(true);
    lastPos.current = pos;
  }

  function draw(e: React.TouchEvent | React.MouseEvent) {
    if (!isDrawing || tool === 'move' || !canvasRef.current || !lastPos.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d')!;
    const pos = getCanvasPos(e, canvasRef.current);

    if (tool === 'erase') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.lineWidth = penSize * 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.restore();
      lastPos.current = pos;
      return;
    }

    if (tool === 'shape' && shapeStartRef.current && snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      const sx = shapeStartRef.current.x, sy = shapeStartRef.current.y;
      const x = Math.min(sx, pos.x), y = Math.min(sy, pos.y);
      const w = Math.abs(pos.x - sx), h = Math.abs(pos.y - sy);
      ctx.strokeStyle = penColor; ctx.fillStyle = penColor; ctx.lineWidth = penSize; ctx.lineCap = 'round';
      if (shapeTool === 'rect') { if (fillShape) ctx.fillRect(x,y,w,h); else ctx.strokeRect(x,y,w,h); }
      else if (shapeTool === 'circle') { const r = Math.min(w,h)/2; ctx.beginPath(); ctx.arc(x+r,y+r,r,0,Math.PI*2); if (fillShape) ctx.fill(); else ctx.stroke(); }
      else if (shapeTool === 'oval')   { ctx.beginPath(); ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2); if (fillShape) ctx.fill(); else ctx.stroke(); }
      else if (shapeTool === 'triangle') { ctx.beginPath(); ctx.moveTo(x+w/2,y); ctx.lineTo(x+w,y+h); ctx.lineTo(x,y+h); ctx.closePath(); if (fillShape) ctx.fill(); else ctx.stroke(); }
      else if (shapeTool === 'star')   { drawStar(ctx,x+w/2,y+h/2,Math.min(w,h)/2); if (fillShape) ctx.fill(); else ctx.stroke(); }
      lastPos.current = pos;
      return;
    }

    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = penColor; ctx.lineWidth = penSize; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw() { setIsDrawing(false); shapeStartRef.current = null; snapshotRef.current = null; lastPos.current = null; }

  // ── Drag ──────────────────────────────────────────────────────────
  function startItemDrag(e: React.TouchEvent|React.MouseEvent, type:'char'|'bubble', itemId:string, cx:number, cy:number) {
    e.stopPropagation();
    setSelected({ type, id: itemId });
    isDraggingRef.current=true; draggingIdRef.current=itemId; draggingTypeRef.current=type;
    const src='touches' in e?e.touches[0]:(e as React.MouseEvent);
    const area=canvasAreaRef.current!.getBoundingClientRect();
    dragOffset.current={x:src.clientX-area.left-(cx/100)*area.width,y:src.clientY-area.top-(cy/100)*area.height};
  }

  function onAreaPointerMove(e: React.TouchEvent|React.MouseEvent) {
    if (!isDraggingRef.current||!draggingIdRef.current||!comicRef.current) return;
    const src='touches' in e?e.touches[0]:(e as React.MouseEvent);
    const area=canvasAreaRef.current; if (!area) return;
    const rect=area.getBoundingClientRect();
    const x=Math.max(2,Math.min(95,((src.clientX-rect.left-dragOffset.current.x)/rect.width)*100));
    const y=Math.max(2,Math.min(92,((src.clientY-rect.top-dragOffset.current.y)/rect.height)*100));
    const c=comicRef.current;
    if (draggingTypeRef.current==='char') setComic({...c,pages:c.pages.map((p,i)=>i!==currentPage?p:{...p,characters:p.characters.map(ch=>ch.characterId===draggingIdRef.current?{...ch,x,y}:ch)})});
    else setComic({...c,pages:c.pages.map((p,i)=>i!==currentPage?p:{...p,textBubbles:p.textBubbles.map(b=>b.id===draggingIdRef.current?{...b,x,y}:b)})});
  }

  function onAreaPointerUp() { isDraggingRef.current=false; draggingIdRef.current=null; draggingTypeRef.current=null; }
  function onAreaClick(e: React.MouseEvent|React.TouchEvent) {
    if ((e.target as HTMLElement)===canvasAreaRef.current||(e.target as HTMLElement)===canvasRef.current) setSelected(null);
  }

  function updateChar(charId:string,patch:Partial<PageCharacter>) {
    if (!comic) return;
    setComic({...comic,pages:comic.pages.map((p,i)=>i!==currentPage?p:{...p,characters:p.characters.map(c=>c.characterId===charId?{...c,...patch}:c)})});
  }
  function updateBubble(bubbleId:string,patch:Partial<TextBubble>) {
    if (!comic) return;
    setComic({...comic,pages:comic.pages.map((p,i)=>i!==currentPage?p:{...p,textBubbles:p.textBubbles.map(b=>b.id===bubbleId?{...b,...patch}:b)})});
  }
  function removeChar(charId:string) {
    if (!comic) return;
    setComic({...comic,pages:comic.pages.map((p,i)=>i!==currentPage?p:{...p,characters:p.characters.filter(c=>c.characterId!==charId)})});
    if (selected?.id===charId) setSelected(null);
  }
  function removeBubble(bubbleId:string) {
    if (!comic) return;
    setComic({...comic,pages:comic.pages.map((p,i)=>i!==currentPage?p:{...p,textBubbles:p.textBubbles.filter(b=>b.id!==bubbleId)})});
    if (selected?.id===bubbleId) setSelected(null);
  }

  function handleAddChar(char: Character) {
    if (!comic) return;
    const existingIdx=comic.characters.findIndex(c=>c.id===char.id);
    let chars=[...comic.characters];
    if (existingIdx>=0) chars[existingIdx]=char; else chars=[...chars,char];
    const pages=comic.pages.map((p,i)=>{
      if (i!==currentPage) return p;
      if (p.characters.find(c=>c.characterId===char.id)) return p;
      return {...p,characters:[...p.characters,{characterId:char.id,x:40,y:40,size:70,flipped:false,pose:'standing' as CharacterPose}]};
    });
    setComic({...comic,characters:chars,pages});
    setShowCharBuilder(false);
    toast.success(`${char.name} added! 🎉`);
  }

  function handleAddBubble(type:BubbleType,text:string) {
    if (!comic) return;
    const bubble:TextBubble={id:uuidv4(),type,text,x:10,y:10,width:45,fontSize:13};
    const pages=comic.pages.map((p,i)=>i===currentPage?{...p,textBubbles:[...p.textBubbles,bubble]}:p);
    setComic({...comic,pages});
    setShowBubblePicker(false);
    toast.success('Bubble added! 💬');
  }

  const page=comic?.pages[currentPage];
  const pageSceneKey=page?.sceneKey||'blank';
  const hasScene = pageSceneKey !== 'blank' && pageSceneKey !== 'cream' && pageSceneKey !== '';
  const selChar=selected?.type==='char'?page?.characters.find(c=>c.characterId===selected.id):null;
  const selBubble=selected?.type==='bubble'?page?.textBubbles.find(b=>b.id===selected.id):null;
  const showControls=tool==='move'&&selected&&(selChar||selBubble);

  return (
    <div className="flex flex-col h-screen bg-amber-50 overflow-hidden">

      {/* Header */}
      <div className="bg-amber-400 border-b-4 border-amber-900 px-4 pt-10 pb-2 flex items-center justify-between shrink-0">
        <button onClick={()=>router.push('/library')} className="font-extrabold text-amber-900 text-xl px-1">←</button>
        {editingTitle?(
          <input autoFocus defaultValue={comic?.title}
            className="font-display text-xl text-amber-900 bg-white/80 rounded-lg px-2 py-0.5 outline-none border-2 border-amber-900 max-w-[160px]"
            onBlur={e=>handleTitleSave(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')handleTitleSave((e.target as HTMLInputElement).value);}}/>
        ):(
          <button onClick={()=>setEditingTitle(true)} className="font-display text-xl text-amber-900 truncate max-w-[150px] flex items-center gap-1">
            {comic?.title||'...'}<span className="text-sm">✏️</span>
          </button>
        )}
        <button onClick={()=>comic&&saveComic(comic)}
          className="btn-ink bg-white text-amber-900 px-3 py-1 rounded-lg text-sm font-extrabold">
          {saving?'⏳':'💾 Save'}
        </button>
      </div>

      {/* Page tabs + copy button */}
      <div className="flex overflow-x-auto gap-2 px-3 py-2 bg-white border-b-2 border-amber-200 shrink-0 items-center">
        {comic?.pages.map((p,i)=>(
          <button key={p.id} onClick={()=>{setCurrentPage(i);setSelected(null);}}
            className={`shrink-0 w-10 h-10 rounded-lg font-extrabold text-sm btn-ink ${i===currentPage?'bg-amber-400 text-amber-900':'bg-white text-gray-600'}`}>
            {i+1}
          </button>
        ))}
        {/* + blank page */}
        <button onClick={()=>{if(comic){const c=addNewPage(comic);setComic(c);}}}
          className="shrink-0 w-10 h-10 rounded-lg btn-ink bg-orange-100 text-orange-700 font-extrabold text-xl" title="New blank page">+</button>
        {/* ✅ FIX 2: Copy current page */}
        <button onClick={()=>setShowCopyConfirm(true)}
          className="shrink-0 btn-ink bg-blue-100 text-blue-700 font-extrabold text-xs px-2 py-2 rounded-lg" title="Copy this page">
          📋 Copy
        </button>
      </div>

      {/* Canvas area */}
      <div ref={canvasAreaRef} className="flex-1 relative overflow-hidden"
        style={{ backgroundColor: hasScene ? 'transparent' : (page?.backgroundColor||'#fff'), cursor:tool==='move'?'default':'crosshair' }}
        onMouseMove={tool==='move'?onAreaPointerMove:undefined}
        onMouseUp={tool==='move'?onAreaPointerUp:undefined}
        onTouchMove={tool==='move'?onAreaPointerMove:undefined}
        onTouchEnd={tool==='move'?onAreaPointerUp:undefined}
        onClick={onAreaClick}
      >
        {/* ✅ FIX 1: SVG scene background behind canvas */}
        {hasScene && <SceneBackground sceneKey={pageSceneKey}/>}
        {!hasScene && <div className="absolute inset-0" style={{backgroundColor:page?.backgroundColor||'#fff'}}/>}

        {/* Transparent drawing canvas on top */}
        <canvas ref={canvasRef} width={800} height={600}
          className="absolute inset-0 w-full h-full"
          style={{touchAction:'none',pointerEvents:tool==='move'?'none':'auto',backgroundColor:'transparent'}}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />

        {/* Characters */}
        {page?.characters.map(pc=>{
          const char=comic?.characters.find(c=>c.id===pc.characterId);
          if (!char) return null;
          const isSelected=selected?.type==='char'&&selected.id===pc.characterId;
          return (
            <div key={pc.characterId} className="absolute select-none"
              style={{left:`${pc.x}%`,top:`${pc.y}%`,transform:`translate(-50%,-50%) scaleX(${pc.flipped?-1:1})`,
                cursor:tool==='move'?'grab':'default',zIndex:isSelected?50:10,
                outline:isSelected&&tool==='move'?'3px dashed #f97316':'none',outlineOffset:'6px',borderRadius:'4px'}}
              onMouseDown={tool==='move'?(e)=>startItemDrag(e,'char',pc.characterId,pc.x,pc.y):undefined}
              onTouchStart={tool==='move'?(e)=>startItemDrag(e,'char',pc.characterId,pc.x,pc.y):undefined}>
              <CharacterSVG character={char} pose={pc.pose||'standing'} size={pc.size||70}/>
              {isSelected&&tool==='move'&&(
                <button className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full text-base font-bold z-30 flex items-center justify-center shadow-md"
                  onMouseDown={e=>{e.stopPropagation();removeChar(pc.characterId);}}
                  onTouchStart={e=>{e.stopPropagation();removeChar(pc.characterId);}}>×</button>
              )}
            </div>
          );
        })}

        {/* Bubbles */}
        {page?.textBubbles.map(bubble=>{
          const isSelected=selected?.type==='bubble'&&selected.id===bubble.id;
          const fs=bubble.fontSize||13;
          return (
            <div key={bubble.id} className="absolute select-none"
              style={{left:`${bubble.x}%`,top:`${bubble.y}%`,maxWidth:`${bubble.width}%`,cursor:tool==='move'?'grab':'default',zIndex:isSelected?50:20}}
              onMouseDown={tool==='move'?(e)=>startItemDrag(e,'bubble',bubble.id,bubble.x,bubble.y):undefined}
              onTouchStart={tool==='move'?(e)=>startItemDrag(e,'bubble',bubble.id,bubble.x,bubble.y):undefined}>
              <div className={`relative px-3 py-2 font-bold bg-white border-2 border-gray-900
                ${bubble.type==='shout'?'bg-yellow-300 font-display':''}
                ${bubble.type==='thought'?'rounded-3xl border-dotted':'rounded-xl'}
                ${bubble.type==='whisper'?'border-dashed opacity-80':''}
                ${isSelected&&tool==='move'?'ring-2 ring-orange-500 ring-offset-2':''}
              `} style={{fontSize:`${fs}px`,lineHeight:1.3}}>
                {bubble.text}
                {(bubble.type==='speech'||bubble.type==='whisper')&&(<div className="absolute -bottom-2 left-4 w-0 h-0" style={{borderLeft:'7px solid transparent',borderRight:'7px solid transparent',borderTop:'8px solid #1a1a2e'}}/>)}
                {bubble.type==='shout'&&(<div className="absolute -bottom-2 left-4 w-0 h-0" style={{borderLeft:'6px solid transparent',borderRight:'6px solid transparent',borderTop:'7px solid #1a1a2e'}}/>)}
              </div>
              {isSelected&&tool==='move'&&(
                <button className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full text-base font-bold z-30 flex items-center justify-center shadow-md"
                  onMouseDown={e=>{e.stopPropagation();removeBubble(bubble.id);}}
                  onTouchStart={e=>{e.stopPropagation();removeBubble(bubble.id);}}>×</button>
              )}
            </div>
          );
        })}

        {tool==='move'&&!selected&&(
          <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none z-50">
            <div className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">✋ Tap a character or bubble to select</div>
          </div>
        )}

        {/* ── Floating right-side controls panel — overlays canvas, no height stolen ── */}
        {showControls&&(
          <div
            className="absolute top-2 right-2 z-50 w-44 rounded-2xl overflow-hidden"
            style={{maxHeight:'calc(100% - 16px)',overflowY:'auto',backgroundColor:'rgba(245,240,255,0.97)',border:'3px solid #7c3aed',boxShadow:'0 4px 16px rgba(0,0,0,0.25)'}}
            onClick={e=>e.stopPropagation()}
            onMouseDown={e=>e.stopPropagation()}
            onTouchStart={e=>e.stopPropagation()}
          >
            <div className="p-3">
              {/* Close + label */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-purple-900 text-xs">
                  {selChar ? `🦸 ${comic?.characters.find(c=>c.id===selChar.characterId)?.name}` : '💬 Bubble'}
                </span>
                <button onClick={()=>setSelected(null)} className="text-purple-400 text-base font-bold leading-none">✕</button>
              </div>

              {/* ── Character controls ── */}
              {selChar&&(()=>{
                return (<>
                  {/* Size */}
                  <p className="text-xs font-extrabold text-purple-700 mb-1">Size</p>
                  <div className="flex items-center gap-1 mb-1">
                    <input type="range" min="30" max="160" step="5"
                      value={selChar.size||70}
                      onChange={e=>updateChar(selChar.characterId,{size:+e.target.value})}
                      className="flex-1 h-5"/>
                  </div>
                  <p className="text-xs text-purple-600 text-right mb-3">{selChar.size||70}px</p>

                  {/* Flip */}
                  <button onClick={()=>updateChar(selChar.characterId,{flipped:!selChar.flipped})}
                    className={`w-full btn-ink py-2 rounded-lg text-xs font-bold mb-3 ${selChar.flipped?'bg-purple-400 text-purple-900':'bg-white text-gray-700'}`}>
                    ↔ Flip {selChar.flipped?'ON':'OFF'}
                  </button>

                  {/* Delete */}
                  <button onClick={()=>removeChar(selChar.characterId)}
                    className="w-full btn-ink py-2 rounded-lg text-xs font-bold bg-red-100 text-red-600 mb-3">
                    🗑 Remove
                  </button>

                  {/* Poses — vertical list so it doesn't go wide */}
                  <p className="text-xs font-extrabold text-purple-700 mb-1">Pose</p>
                  <div className="flex flex-col gap-1">
                    {POSES.map(p=>(
                      <button key={p.key}
                        onClick={()=>updateChar(selChar.characterId,{pose:p.key})}
                        className={`btn-ink px-2 py-1.5 rounded-lg text-xs font-bold text-left flex items-center gap-1 ${(selChar.pose||'standing')===p.key?'bg-purple-400 text-purple-900':'bg-white text-gray-600'}`}>
                        {p.emoji} {p.label}
                      </button>
                    ))}
                  </div>
                </>);
              })()}

              {/* ── Bubble controls ── */}
              {selBubble&&(<>
                <p className="text-xs font-extrabold text-purple-700 mb-1">Text size</p>
                <input type="range" min="9" max="30" step="1"
                  value={selBubble.fontSize||13}
                  onChange={e=>updateBubble(selBubble.id,{fontSize:+e.target.value})}
                  className="w-full h-5 mb-1"/>
                <p className="text-xs text-purple-600 text-right mb-3">{selBubble.fontSize||13}px</p>

                <p className="text-xs font-extrabold text-purple-700 mb-1">Width</p>
                <input type="range" min="15" max="85" step="5"
                  value={selBubble.width||45}
                  onChange={e=>updateBubble(selBubble.id,{width:+e.target.value})}
                  className="w-full h-5 mb-1"/>
                <p className="text-xs text-purple-600 text-right mb-3">{selBubble.width||45}%</p>

                {/* Delete bubble */}
                <button onClick={()=>removeBubble(selBubble.id)}
                  className="w-full btn-ink py-2 rounded-lg text-xs font-bold bg-red-100 text-red-600">
                  🗑 Remove
                </button>
              </>)}
            </div>
          </div>
        )}
      </div>

      {/* Controls panel is now a floating sidebar — see inside canvas area */}

      {/* Toolbar */}
      <div className="bg-white border-t-4 border-amber-900 shrink-0">
        <div className="flex border-b-2 border-amber-100">
          {([{key:'draw',icon:'✏️',label:'Draw'},{key:'chars',icon:'🦸',label:'Chars'},{key:'bubbles',icon:'💬',label:'Bubbles'},{key:'bg',icon:'🌄',label:'Scene'}] as const).map(t=>(
            <button key={t.key} onClick={()=>setActivePanel(t.key)}
              className={`flex-1 py-2 text-xs font-extrabold flex flex-col items-center gap-0.5 ${activePanel===t.key?'text-orange-600 bg-orange-50':'text-gray-500'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="p-3">
          {activePanel==='draw'&&(
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {([{t:'draw' as ActiveTool,icon:'✏️',label:'Draw'},{t:'erase' as ActiveTool,icon:'🧹',label:'Erase'},{t:'shape' as ActiveTool,icon:'🔷',label:'Shape'},{t:'move' as ActiveTool,icon:'✋',label:'Move'}]).map(btn=>(
                  <button key={btn.t} onClick={()=>{setTool(btn.t);if(btn.t!=='move')setSelected(null);}}
                    className={`btn-ink px-3 py-2 rounded-lg text-sm font-bold ${tool===btn.t?'bg-amber-400':'bg-white'}`}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
              {tool==='shape'&&(
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {SHAPES.map(s=>(
                      <button key={s.key} onClick={()=>setShapeTool(s.key)}
                        className={`btn-ink px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${shapeTool===s.key?'bg-blue-400 text-blue-900':'bg-white text-gray-700'}`}>
                        {s.emoji} {s.label}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={fillShape} onChange={e=>setFillShape(e.target.checked)} className="w-4 h-4"/>
                    Fill shape
                  </label>
                </div>
              )}
              {tool!=='move'&&(
                <div className="flex items-center gap-2 flex-wrap">
                  {['#1a1a2e','#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#ffffff','#ff6b9d','#ff8c00','#00ced1'].map(c=>(
                    <button key={c} onClick={()=>{setPenColor(c);if(tool==='erase')setTool('draw');}}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${penColor===c?'border-amber-900 scale-125':'border-gray-300'}`}
                      style={{backgroundColor:c}}/>
                  ))}
                  <input type="range" min="2" max="24" value={penSize} onChange={e=>setPenSize(+e.target.value)} className="w-20 ml-1"/>
                  <span className="text-xs font-bold text-gray-500">{penSize}px</span>
                </div>
              )}
              {tool==='move'&&<p className="text-xs text-amber-700 font-bold">Tap any character or bubble → controls appear above</p>}
            </div>
          )}

          {activePanel==='chars'&&(
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={()=>setShowCharBuilder(true)} className="btn-ink bg-amber-400 text-amber-900 px-3 py-2 rounded-xl font-extrabold text-sm">+ New Character</button>
              {comic?.characters.map(char=>(
                <button key={char.id}
                  onClick={()=>{
                    if(!comic||!page) return;
                    if(page.characters.find(c=>c.characterId===char.id)){toast('Already on this page!');return;}
                    const pages=comic.pages.map((p,i)=>i!==currentPage?p:{...p,characters:[...p.characters,{characterId:char.id,x:50,y:50,size:70,flipped:false,pose:'standing' as CharacterPose}]});
                    setComic({...comic,pages}); toast.success(`${char.name} added!`);
                  }}
                  className="btn-ink bg-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <CharacterSVG character={char} size={28}/>{char.name}
                </button>
              ))}
              {(comic?.characters.length??0)>0&&<p className="text-xs text-gray-400 w-full mt-1">Switch to ✋ Move → tap to resize/pose</p>}
            </div>
          )}

          {activePanel==='bubbles'&&(
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={()=>setShowBubblePicker(true)} className="btn-ink bg-blue-400 text-blue-900 px-3 py-2 rounded-xl font-extrabold text-sm">+ Add Bubble</button>
              <button onClick={()=>setShowBot(true)} className="btn-ink bg-purple-400 text-purple-900 px-3 py-2 rounded-xl font-extrabold text-sm">🤖 ComicBot</button>
              {(page?.textBubbles.length??0)>0&&<p className="text-xs text-gray-400 w-full mt-1">Switch to ✋ Move → tap bubble to resize</p>}
            </div>
          )}

          {/* ✅ FIX 1: Scene selector with SVG previews */}
          {activePanel==='bg'&&(
            <div className="flex flex-col gap-2">
              <p className="text-xs font-extrabold text-gray-600 mb-1">Choose a Scene</p>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {SCENES.map(s=>{
                  const isActive=(page?.sceneKey||'blank')===s.key;
                  return (
                    <button key={s.key}
                      onClick={()=>{
                        if(!comic||!page) return;
                        const pages=comic.pages.map((p,i)=>i===currentPage?{...p,sceneKey:s.key,backgroundColor:s.bgColor}:p);
                        setComic({...comic,pages});
                      }}
                      className={`relative rounded-xl overflow-hidden border-4 transition-all ${isActive?'border-orange-500':'border-transparent'}`}
                      style={{height:'60px'}}>
                      {/* Mini scene preview */}
                      <div className="absolute inset-0" style={{backgroundColor:s.bgColor}}>
                        <svg viewBox="0 0 800 480" style={{width:'100%',height:'100%',opacity:0.7}}>
                          {/* Mini preview just shows the bg color with emoji */}
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-white text-xs font-extrabold drop-shadow">{s.label}</span>
                      </div>
                      {isActive&&<div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ FIX 2: Copy page confirmation modal */}
      {showCopyConfirm&&(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl border-4 border-amber-900 p-6 mx-4 max-w-sm w-full">
            <h2 className="font-display text-2xl text-amber-900 mb-2">Copy this page? 📋</h2>
            <p className="text-amber-800 font-bold mb-4">
              A copy of page {currentPage+1} will be added as a new page — same scene, characters, and bubbles. You can then change whatever you need!
            </p>
            <div className="flex gap-3">
              <button onClick={()=>setShowCopyConfirm(false)} className="btn-ink bg-gray-100 text-gray-700 py-3 rounded-xl flex-1 font-bold">Cancel</button>
              <button onClick={handleCopyPage} className="btn-ink bg-orange-500 text-white py-3 rounded-xl flex-1 font-extrabold">Yes, copy it! ✂️</button>
            </div>
          </div>
        </div>
      )}

      {showCharBuilder  &&<CharacterBuilder onSave={handleAddChar} onClose={()=>setShowCharBuilder(false)}/>}
      {showBubblePicker &&<BubblePicker onSelect={handleAddBubble} onClose={()=>setShowBubblePicker(false)}/>}
      {showBot          &&<ComicBot comicTitle={comic?.title} onClose={()=>setShowBot(false)}/>}
    </div>
  );
}
