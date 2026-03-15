'use client';
import React from 'react';

export interface Scene {
  key: string;
  label: string;
  emoji: string;
  bgColor: string; // fallback solid color
}

export const SCENES: Scene[] = [
  { key: 'city',       label: 'City Day',    emoji: '🏙️',  bgColor: '#b0d0e8' },
  { key: 'city_night', label: 'City Night',  emoji: '🌃',  bgColor: '#0d1a3a' },
  { key: 'park',       label: 'Park',        emoji: '🌳',  bgColor: '#87ceeb' },
  { key: 'playground', label: 'Playground',  emoji: '🛝',  bgColor: '#87ceeb' },
  { key: 'farm',       label: 'Farm',        emoji: '🌾',  bgColor: '#87ceeb' },
  { key: 'school',     label: 'School',      emoji: '🏫',  bgColor: '#f5e6c8' },
  { key: 'daycare',    label: 'Daycare',     emoji: '🧸',  bgColor: '#d0eaf5' },
  { key: 'hospital',   label: 'Hospital',    emoji: '🏥',  bgColor: '#4ecdc4' },
  { key: 'jail',       label: 'Jail',        emoji: '🔒',  bgColor: '#2a6060' },
  { key: 'desert',     label: 'Desert',      emoji: '🌵',  bgColor: '#e8a030' },
  { key: 'blank',      label: 'Blank',       emoji: '⬜',  bgColor: '#ffffff' },
  { key: 'cream',      label: 'Cream',       emoji: '🟡',  bgColor: '#fff8f0' },
];

// ── City Day ──────────────────────────────────────────────────────────────────
function CityDaySVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Sky */}
      <rect width="800" height="480" fill="#b8d8f0"/>
      {/* Clouds */}
      <ellipse cx="120" cy="80" rx="60" ry="28" fill="white" opacity="0.9"/>
      <ellipse cx="160" cy="70" rx="50" ry="24" fill="white" opacity="0.9"/>
      <ellipse cx="90" cy="85" rx="40" ry="20" fill="white" opacity="0.9"/>
      <ellipse cx="580" cy="60" rx="70" ry="28" fill="white" opacity="0.9"/>
      <ellipse cx="620" cy="52" rx="55" ry="22" fill="white" opacity="0.9"/>
      {/* Background skyline */}
      <rect x="0" y="160" width="800" height="200" fill="#9ab8cc" opacity="0.5"/>
      <rect x="30" y="120" width="60" height="240" fill="#8aacbe" opacity="0.6"/>
      <rect x="120" y="100" width="40" height="260" fill="#8aacbe" opacity="0.6"/>
      <rect x="680" y="90" width="50" height="270" fill="#8aacbe" opacity="0.6"/>
      <rect x="720" y="110" width="35" height="250" fill="#8aacbe" opacity="0.6"/>
      {/* Road */}
      <rect x="0" y="400" width="800" height="80" fill="#b0b8b0"/>
      <rect x="0" y="396" width="800" height="8" fill="#9a9e9a"/>
      {/* Road dashes */}
      {[0,100,200,300,400,500,600,700].map(x=><rect key={x} x={x+20} y="432" width="60" height="8" rx="4" fill="white" opacity="0.8"/>)}
      {/* Sidewalk */}
      <rect x="0" y="370" width="800" height="32" fill="#d0ccc0"/>
      {/* Building 1 - Red */}
      <rect x="20" y="180" width="130" height="190" fill="#d44a2a" rx="2"/>
      {[200,240,280,320].map(y=>[40,80,110].map(x=><rect key={`${x}${y}`} x={x} y={y} width="28" height="32" rx="2" fill="#c0dcec" opacity="0.9"/>))}
      <rect x="75" y="350" width="40" height="20" fill="#8b4a20"/>
      {/* Building 2 - Yellow tall */}
      <rect x="180" y="140" width="100" height="230" fill="#e8c040" rx="2"/>
      {[165,200,240,280,320].map(y=>[200,240,265].map(x=><rect key={`${x}${y}`} x={x} y={y} width="24" height="28" rx="2" fill="#c0dcec" opacity="0.9"/>))}
      {/* Building 3 - Brown with roof */}
      <rect x="310" y="160" width="90" height="210" fill="#a06840" rx="2"/>
      <polygon points="310,160 355,110 400,160" fill="#804820"/>
      <circle cx="355" cy="148" r="12" fill="#c0dcec"/>
      {[185,220,260,300].map(y=>[325,360].map(x=><rect key={`${x}${y}`} x={x} y={y} width="22" height="26" rx="2" fill="#c0dcec" opacity="0.9"/>))}
      {/* Building 4 - Slanted yellow */}
      <rect x="430" y="200" width="110" height="170" fill="#e8c840" rx="2"/>
      {[220,260,300,340].map(y=>[448,488,522].map(x=><rect key={`${x}${y}`} x={x} y={y} width="20" height="24" rx="2" fill="#c0dcec" opacity="0.9"/>))}
      <rect x="465" y="340" width="30" height="30" fill="#508030" rx="2"/>
      {/* Building 5 - Right yellow */}
      <rect x="620" y="170" width="100" height="200" fill="#ddc030" rx="2"/>
      {[195,235,275,315].map(y=>[638,672].map(x=><rect key={`${x}${y}`} x={x} y={y} width="22" height="26" rx="2" fill="#c0dcec" opacity="0.9"/>))}
      {/* Trees */}
      <rect x="155" y="330" width="8" height="40" fill="#6b4020"/>
      <ellipse cx="159" cy="318" rx="22" ry="20" fill="#e8a828"/>
      <rect x="555" y="330" width="8" height="40" fill="#6b4020"/>
      <ellipse cx="559" cy="318" rx="20" ry="18" fill="#508030"/>
      <rect x="600" y="340" width="7" height="30" fill="#6b4020"/>
      <ellipse cx="603" cy="330" rx="16" ry="14" fill="#608838"/>
    </svg>
  );
}

// ── City Night ────────────────────────────────────────────────────────────────
function CityNightSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <rect width="800" height="480" fill="#0a1628"/>
      {/* Stars */}
      {[[80,40],[160,25],[250,55],[380,20],[450,45],[560,30],[650,50],[720,22],[100,90],[300,80],[500,70],[700,85]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2" fill="white" opacity="0.8"/>)}
      {/* Background skyline silhouette */}
      <rect x="0" y="80" width="800" height="280" fill="#0d2240"/>
      {[30,90,150,600,680,730].map((x,i)=><rect key={i} x={x} y={[100,80,120,90,110,85][i]} width={[40,30,45,35,25,40][i]} height={300} fill="#0a1830"/>)}
      {/* Buildings with lit windows */}
      {/* Left building */}
      <rect x="20" y="150" width="130" height="280" fill="#1a2a4a"/>
      {[[40,170],[80,170],[110,170],[40,210],[80,210],[110,210],[40,250],[110,250],[80,290],[40,330],[110,330]].map(([x,y],i)=><rect key={i} x={x} y={y} width="22" height="28" rx="2" fill={i%3===0?"#f4a020":i%3===1?"#f0e060":"#f4a020"} opacity="0.9"/>)}
      {/* Center hotel building */}
      <rect x="260" y="100" width="280" height="330" fill="#1a3060"/>
      <rect x="310" y="80" width="180" height="50" fill="#1a3060"/>
      {/* Hotel sign neon */}
      <rect x="520" y="100" width="40" height="160" fill="#1a2040" rx="4" stroke="#ff40a0" strokeWidth="3"/>
      {['H','O','T','E','L'].map((l,i)=><text key={l} x="536" y={130+i*30} fill="#ff40a0" fontSize="18" fontWeight="bold" fontFamily="Arial">{l}</text>)}
      {/* Hotel windows arched */}
      {[320,370,420,470].map(x=><rect key={x} x={x} y="140" width="32" height="44" rx="16 16 0 0" fill="#f4c060" opacity="0.8"/>)}
      {/* Other windows */}
      {[[280,220],[340,220],[400,220],[460,220],[280,270],[340,270],[400,270],[460,270],[340,320],[400,320]].map(([x,y],i)=><rect key={i} x={x} y={y} width="28" height="32" rx="3" fill={i%2===0?"#f4a020":"#f0e060"} opacity="0.85"/>)}
      {/* Street lamp left */}
      <rect x="192" y="270" width="8" height="130" fill="#888"/>
      <circle cx="196" cy="268" r="14" fill="#f4d060" opacity="0.8"/>
      <circle cx="196" cy="268" r="8" fill="#fff8c0"/>
      {/* Street lamp right */}
      <rect x="596" y="270" width="8" height="130" fill="#888"/>
      <circle cx="600" cy="268" r="14" fill="#f4d060" opacity="0.8"/>
      <circle cx="600" cy="268" r="8" fill="#fff8c0"/>
      {/* Bench */}
      <rect x="360" y="380" width="80" height="8" rx="4" fill="#4a80c0"/>
      <rect x="368" y="388" width="10" height="20" rx="2" fill="#4a80c0"/>
      <rect x="422" y="388" width="10" height="20" rx="2" fill="#4a80c0"/>
      {/* Awning */}
      <rect x="270" y="310" width="260" height="20" rx="4" fill="#e84060"/>
      {[290,320,350,380,410,440,470,500].map(x=><line key={x} x1={x} y1="310" x2={x} y2="330" stroke="white" strokeWidth="3"/>)}
      {/* Sidewalk / road */}
      <rect x="0" y="400" width="800" height="40" fill="#1a1a2a"/>
      <rect x="0" y="440" width="800" height="40" fill="#141420"/>
      {/* Neon glow overlays */}
      <ellipse cx="196" cy="268" rx="40" ry="40" fill="#f4d060" opacity="0.08"/>
      <ellipse cx="600" cy="268" rx="40" ry="40" fill="#f4d060" opacity="0.08"/>
    </svg>
  );
}

// ── Park ─────────────────────────────────────────────────────────────────────
function ParkSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Sky */}
      <rect width="800" height="480" fill="#87ceeb"/>
      {/* Clouds */}
      {[[100,80,55,25],[200,65,45,20],[500,70,65,28],[640,55,50,22]].map(([x,y,rx,ry],i)=><ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="white" opacity="0.9"/>)}
      {/* Distant mountains/rocks */}
      <ellipse cx="650" cy="300" rx="80" ry="40" fill="#8b6040"/>
      <ellipse cx="700" cy="290" rx="60" ry="35" fill="#7a5030"/>
      <ellipse cx="620" cy="310" rx="50" ry="30" fill="#7a5030"/>
      {/* Dirt path */}
      <ellipse cx="400" cy="390" rx="200" ry="60" fill="#c8a868"/>
      <rect x="0" y="380" width="200" height="30" fill="#c8a868"/>
      <rect x="600" y="380" width="200" height="30" fill="#c8a868"/>
      {/* Ground */}
      <rect x="0" y="310" width="800" height="170" fill="#5cb85c"/>
      <ellipse cx="400" cy="310" rx="400" ry="30" fill="#5cb85c"/>
      {/* Darker grass patches */}
      <ellipse cx="150" cy="360" rx="80" ry="15" fill="#4da84d" opacity="0.6"/>
      <ellipse cx="650" cy="370" rx="70" ry="12" fill="#4da84d" opacity="0.6"/>
      {/* Flowers */}
      {[[390,360],[420,370],[440,355],[350,375],[480,368]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="5" fill="white"/>)}
      {[[390,360],[420,370],[440,355],[350,375],[480,368]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" fill="#f4d020"/>)}
      {/* Bush left */}
      <ellipse cx="80" cy="315" rx="55" ry="40" fill="#3a8c3a"/>
      <ellipse cx="110" cy="308" rx="40" ry="35" fill="#4da84d"/>
      {/* Grass tufts */}
      {[[200,320],[300,330],[500,325],[600,318]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="12" ry="8" fill="#3a8c3a"/>)}
    </svg>
  );
}

// ── Playground ───────────────────────────────────────────────────────────────
function PlaygroundSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Sky */}
      <rect width="800" height="480" fill="#a8d8f0"/>
      {/* Mountains */}
      <polygon points="0,300 150,180 300,300" fill="#6a8aaa"/>
      <polygon points="200,300 380,160 560,300" fill="#7a9aba"/>
      <polygon points="500,300 660,200 800,300" fill="#6a8aaa"/>
      {/* Trees background */}
      {[560,620,680,730].map((x,i)=>[<rect key={`t${i}`} x={x} y="260" width="10" height="60" fill="#4a6020"/>,<ellipse key={`e${i}`} cx={x+5} cy="252" rx="22" ry="20" fill="#508030"/>])}
      {/* Ground - brown sand */}
      <rect x="0" y="310" width="800" height="170" fill="#c8a060"/>
      <rect x="0" y="308" width="800" height="12" fill="#b09050"/>
      {/* Green strip */}
      <rect x="0" y="290" width="800" height="22" fill="#60a840"/>
      {/* Hedge borders */}
      <rect x="0" y="430" width="300" height="30" fill="#4a8030" rx="4"/>
      <rect x="500" y="430" width="300" height="30" fill="#4a8030" rx="4"/>
      {/* Climbing structure LEFT */}
      <rect x="40" y="240" width="16" height="100" fill="#e84040" rx="4"/>
      <rect x="140" y="250" width="16" height="90" fill="#4040e8" rx="4"/>
      <rect x="40" y="240" width="116" height="20" rx="6" fill="#e84040"/>
      {/* House on top */}
      <rect x="55" y="200" width="80" height="44" rx="4" fill="#40c040"/>
      <polygon points="50,200 96,170 145,200" fill="#e84040"/>
      {/* Circle window */}
      <circle cx="96" cy="218" r="12" fill="#40a0e0"/>
      {/* Slide */}
      <rect x="145" y="246" width="16" height="70" rx="4" fill="#f4a020" transform="rotate(35 145 246)"/>
      {/* Seesaw */}
      <rect x="330" y="350" width="140" height="14" rx="7" fill="#4040e8" transform="rotate(-8 330 350)"/>
      <rect x="392" y="330" width="12" height="50" rx="4" fill="#888"/>
      <polygon points="380,380 404,380 392,358" fill="#888"/>
      {/* Triangle cone */}
      <polygon points="400,310 420,350 380,350" fill="#f4c020"/>
      {/* Lamppost */}
      <rect x="492" y="230" width="14" height="180" fill="#2a2a2a" rx="3"/>
      <ellipse cx="499" cy="228" rx="22" ry="22" fill="#f0f0f0" stroke="#2a2a2a" strokeWidth="3"/>
      <ellipse cx="499" cy="228" rx="14" ry="14" fill="#f8f8d0"/>
      <rect x="478" y="206" width="42" height="10" rx="4" fill="#2a2a2a"/>
      {/* Swing set */}
      <rect x="590" y="220" width="12" height="170" rx="4" fill="#e84040" transform="rotate(-5 590 220)"/>
      <rect x="700" y="220" width="12" height="170" rx="4" fill="#40c040" transform="rotate(5 700 220)"/>
      <rect x="590" y="218" width="122" height="12" rx="4" fill="#d04040"/>
      {/* Swings */}
      <line x1="615" y1="230" x2="620" y2="320" stroke="#888" strokeWidth="3"/>
      <line x1="645" y1="230" x2="640" y2="320" stroke="#888" strokeWidth="3"/>
      <rect x="615" y="318" width="30" height="10" rx="5" fill="#c88040"/>
      <line x1="665" y1="230" x2="672" y2="320" stroke="#888" strokeWidth="3"/>
      <line x1="695" y1="230" x2="688" y2="320" stroke="#888" strokeWidth="3"/>
      <rect x="666" y="318" width="28" height="10" rx="5" fill="#4080c0"/>
      {/* Trash can */}
      <rect x="780" y="350" width="35" height="48" rx="4" fill="#888" stroke="#666" strokeWidth="2"/>
      <rect x="775" y="346" width="45" height="10" rx="3" fill="#666"/>
      {[[784,365],[790,372],[796,365]].map(([x,y],i)=><line key={i} x1={x} y1="356" x2={x} y2="394" stroke="#aaa" strokeWidth="2"/>)}
    </svg>
  );
}

// ── Farm ─────────────────────────────────────────────────────────────────────
function FarmSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <rect width="800" height="480" fill="#7ec8e3"/>
      {/* Clouds */}
      {[[80,60,60,25],[200,50,50,20],[550,65,70,28],[680,50,55,22]].map(([x,y,rx,ry],i)=><ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="white" opacity="0.95"/>)}
      {/* Hills */}
      <ellipse cx="400" cy="320" rx="450" ry="80" fill="#7ac940"/>
      <rect x="0" y="320" width="800" height="160" fill="#7ac940"/>
      {/* Path */}
      <path d="M340,480 L380,300 L420,300 L460,480 Z" fill="#c8a060"/>
      {/* Fence left */}
      {[60,100,140,180,220].map(x=>[
        <rect key={`fl${x}`} x={x} y="310" width="8" height="60" rx="3" fill="#d4a870"/>,
        <rect key={`flt${x}`} x={x-2} y="308" width="12" height="8" rx="2" fill="#c09060"/>
      ])}
      <rect x="60" y="325" width="170" height="8" rx="4" fill="#c09060"/>
      <rect x="60" y="348" width="170" height="8" rx="4" fill="#c09060"/>
      {/* Fence right */}
      {[540,580,620,660,700].map(x=>[
        <rect key={`fr${x}`} x={x} y="310" width="8" height="60" rx="3" fill="#d4a870"/>,
        <rect key={`frt${x}`} x={x-2} y="308" width="12" height="8" rx="2" fill="#c09060"/>
      ])}
      <rect x="540" y="325" width="170" height="8" rx="4" fill="#c09060"/>
      <rect x="540" y="348" width="170" height="8" rx="4" fill="#c09060"/>
      {/* Barn 1 */}
      <rect x="80" y="170" width="160" height="150" fill="#c83020"/>
      <polygon points="60,170 160,100 280,170" fill="#a02010"/>
      <rect x="140" y="240" width="60" height="80" fill="#8b4020"/>
      <rect x="153" y="240" width="2" height="80" fill="#6b3010"/>
      {/* Barn windows */}
      <rect x="95" y="190" width="45" height="40" rx="4" fill="#c0d8e8"/>
      <rect x="200" y="190" width="45" height="40" rx="4" fill="#c0d8e8"/>
      <line x1="117" y1="190" x2="117" y2="230" stroke="#888" strokeWidth="2"/>
      <line x1="95" y1="210" x2="140" y2="210" stroke="#888" strokeWidth="2"/>
      {/* Barn 2 smaller */}
      <rect x="280" y="200" width="120" height="120" fill="#c83020"/>
      <polygon points="265,200 340,145 415,200" fill="#a02010"/>
      <rect x="310" y="260" width="60" height="60" fill="#8b4020"/>
      {/* Windmill */}
      <rect x="490" y="130" width="24" height="200" rx="4" fill="#8b5020"/>
      <rect x="466" y="270" width="72" height="16" rx="4" fill="#8b5020"/>
      {/* Windmill cap */}
      <polygon points="490,130 502,90 514,130" fill="#6b3820"/>
      <rect x="486" y="125" width="28" height="16" rx="3" fill="#6b3820"/>
      <circle cx="502" cy="190" r="10" fill="#6b3820"/>
      {/* Blades */}
      {[0,90,180,270].map(a=><rect key={a} x="498" y="120" width="8" height="70" rx="4" fill="#c8a060" transform={`rotate(${a} 502 190)`}/>)}
      {/* Haystacks */}
      <ellipse cx="60" cy="338" rx="55" ry="30" fill="#d4a020"/>
      <ellipse cx="60" cy="322" rx="42" ry="24" fill="#e8b828"/>
      <ellipse cx="730" cy="338" rx="55" ry="30" fill="#d4a020"/>
      <ellipse cx="730" cy="322" rx="42" ry="24" fill="#e8b828"/>
      <ellipse cx="640" cy="345" rx="45" ry="25" fill="#d4a020"/>
      <ellipse cx="640" cy="332" rx="35" ry="20" fill="#e8b828"/>
    </svg>
  );
}

// ── School ────────────────────────────────────────────────────────────────────
function SchoolSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Walls */}
      <rect width="800" height="480" fill="#f0e8d0"/>
      {/* Ceiling line */}
      <rect x="0" y="0" width="800" height="60" fill="#e8dcc0"/>
      {/* Bunting flags */}
      <line x1="0" y1="30" x2="800" y2="30" stroke="#c0a870" strokeWidth="2"/>
      {[0,80,160,240,320,400,480,560,640,720].map((x,i)=>{
        const colors=['#e84040','#f4c020','#40c040','#4080e8','#e840a0'];
        return <polygon key={i} points={`${x+10},20 ${x+70},20 ${x+40},55`} fill={colors[i%5]} opacity="0.9"/>;
      })}
      {/* Wooden floor */}
      <rect x="0" y="380" width="800" height="100" fill="#a06828"/>
      {[0,80,160,240,320,400,480,560,640,720].map(x=><rect key={x} x={x} y="380" width="80" height="100" fill="none" stroke="#8b5a20" strokeWidth="2"/>)}
      {[0,80,160,240,320,400,480,560,640,720].map(x=><line key={x} x1={x+40} y1="380" x2={x+40} y2="480" stroke="#9a6428" strokeWidth="1" strokeDasharray="4,4"/>)}
      {/* Wall base */}
      <rect x="0" y="360" width="800" height="24" fill="#d0b880"/>
      {/* Bookshelf LEFT */}
      <rect x="30" y="100" width="140" height="260" rx="4" fill="#c8a060" stroke="#a87840" strokeWidth="3"/>
      {/* Shelf boards */}
      {[185,250,315].map(y=><rect key={y} x="30" y={y} width="140" height="8" rx="2" fill="#a87840"/>)}
      {/* Books */}
      {[[40,100,18,82,'#e84040'],[62,100,14,82,'#4080e8'],[80,100,20,82,'#40a040'],[104,100,16,82,'#e8a020'],[124,100,18,82,'#9040c0'],[146,100,20,82,'#e84060']].map(([x,y,w,h,c],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={c as string}/>)}
      {[[40,198,22,50,'#4080e8'],[66,198,16,50,'#40c040'],[86,198,20,50,'#e84040'],[110,198,18,50,'#e8a020']].map(([x,y,w,h,c],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={c as string}/>)}
      {/* Cabinet bottom */}
      <rect x="40" y="330" width="110" height="30" rx="3" fill="#e8e0d0" stroke="#a87840" strokeWidth="2"/>
      {[[62,342],[102,342]].map(([x,y])=><circle key={x} cx={x} cy={y} r="5" fill="#c8a860"/>)}
      {/* Blackboard CENTER */}
      <rect x="240" y="80" width="320" height="220" rx="6" fill="#a07040" stroke="#806030" strokeWidth="6"/>
      <rect x="255" y="92" width="290" height="196" rx="4" fill="#2a9090"/>
      {/* Chalkboard highlight */}
      <ellipse cx="400" cy="190" rx="100" ry="70" fill="#38a0a0" opacity="0.4"/>
      {/* Blackboard frame top detail */}
      <rect x="240" y="298" width="320" height="18" rx="3" fill="#806030"/>
      {/* Clock */}
      <circle cx="660" cy="120" r="48" fill="white" stroke="#40a0c0" strokeWidth="4"/>
      <circle cx="660" cy="120" r="40" fill="white"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=>{
        const r1=32,r2=38,rad=a*Math.PI/180;
        return <line key={a} x1={660+r1*Math.sin(rad)} y1={120-r1*Math.cos(rad)} x2={660+r2*Math.sin(rad)} y2={120-r2*Math.cos(rad)} stroke="#666" strokeWidth="2"/>;
      })}
      <line x1="660" y1="120" x2="660" y2="88" stroke="#222" strokeWidth="3" strokeLinecap="round"/>
      <line x1="660" y1="120" x2="682" y2="122" stroke="#e84040" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="660" cy="120" r="4" fill="#222"/>
      {/* Poster/chart on wall right */}
      <rect x="700" y="80" width="80" height="100" rx="4" fill="white" stroke="#c0a060" strokeWidth="3"/>
      {/* Simple chart in poster */}
      {[[712,170,8,40,'#4080e8'],[726,150,8,60,'#e84040'],[740,160,8,50,'#40c040'],[754,140,8,70,'#f4a020']].map(([x,y,w,h,c])=><rect key={x} x={x} y={y} width={w} height={h} fill={c as string} rx="2"/>)}
      <line x1="706" y1="180" x2="774" y2="180" stroke="#888" strokeWidth="2"/>
      {/* Teacher desk RIGHT */}
      <rect x="570" y="270" width="220" height="90" rx="6" fill="#c89040" stroke="#a07030" strokeWidth="3"/>
      <rect x="580" y="356" width="30" height="30" rx="4" fill="#a07030"/>
      <rect x="760" y="356" width="30" height="30" rx="4" fill="#a07030"/>
      {/* Books on desk */}
      {[[590,248,20,26,'#4080e8'],[614,244,20,30,'#e84040'],[638,250,20,24,'#40a040'],[662,246,20,28,'#9040c0']].map(([x,y,w,h,c])=><rect key={x} x={x} y={y} width={w} height={h} rx="2" fill={c as string}/>)}
      {/* Globe */}
      <circle cx="730" cy="252" r="28" fill="#4080c0" stroke="#306090" strokeWidth="3"/>
      <ellipse cx="730" cy="252" rx="28" ry="10" fill="none" stroke="#306090" strokeWidth="1.5"/>
      <ellipse cx="730" cy="252" rx="10" ry="28" fill="none" stroke="#306090" strokeWidth="1.5"/>
      <ellipse cx="730" cy="240" rx="14" ry="8" fill="#60a840" opacity="0.8"/>
      <ellipse cx="718" cy="260" rx="10" ry="6" fill="#60a840" opacity="0.8"/>
      <rect x="726" y="278" width="8" height="16" rx="2" fill="#a07030"/>
      <ellipse cx="730" cy="296" rx="18" ry="5" fill="#a07030"/>
    </svg>
  );
}

// ── Daycare ───────────────────────────────────────────────────────────────────
function DaycareSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Walls */}
      <rect width="800" height="480" fill="#d0eaf8"/>
      <rect x="0" y="0" width="800" height="20" fill="#c0d8e8"/>
      {/* Curtain rod */}
      <rect x="180" y="20" width="440" height="12" rx="4" fill="#c0a060"/>
      {/* Left curtain */}
      <path d="M180,32 Q220,100 190,200 Q180,300 200,380 L280,380 Q260,280 270,180 Q280,80 240,32 Z" fill="#e84040"/>
      <rect x="190" y="370" width="80" height="18" rx="6" fill="#c83020"/>
      {/* Right curtain */}
      <path d="M620,32 Q580,100 610,200 Q620,300 600,380 L520,380 Q540,280 530,180 Q520,80 560,32 Z" fill="#e84040"/>
      <rect x="530" y="370" width="80" height="18" rx="6" fill="#c83020"/>
      {/* Window */}
      <rect x="225" y="60" width="350" height="280" rx="4" fill="#d8eefc" stroke="#b0c8d8" strokeWidth="4"/>
      {/* Window sky outside */}
      <rect x="229" y="64" width="342" height="272" fill="#c8e8f8"/>
      {/* Clouds outside */}
      <ellipse cx="310" cy="120" rx="50" ry="22" fill="white" opacity="0.9"/>
      <ellipse cx="350" cy="112" rx="40" ry="18" fill="white" opacity="0.9"/>
      <ellipse cx="530" cy="130" rx="45" ry="20" fill="white" opacity="0.9"/>
      {/* Bushes outside window */}
      <ellipse cx="270" cy="300" rx="50" ry="35" fill="#60a030"/>
      <ellipse cx="330" cy="290" rx="40" ry="30" fill="#70b040"/>
      <ellipse cx="490" cy="295" rx="45" ry="32" fill="#60a030"/>
      <ellipse cx="550" cy="302" rx="38" ry="28" fill="#70b040"/>
      {/* Window cross */}
      <rect x="225" y="196" width="350" height="6" fill="#b0c8d8"/>
      <rect x="396" y="60" width="6" height="280" fill="#b0c8d8"/>
      {/* Bunting flags top */}
      <line x1="0" y1="25" x2="800" y2="25" stroke="#c0a070" strokeWidth="2"/>
      {[0,60,120,180,240,300,360,420,480,540,600,660,720].map((x,i)=>{
        const colors=['#e84040','#f4c020','#40c040','#4080e8','#e840a0','#f4a020'];
        return <polygon key={i} points={`${x+5},16 ${x+55},16 ${x+30},48`} fill={colors[i%6]} opacity="0.9"/>;
      })}
      {/* Floor */}
      <rect x="0" y="390" width="800" height="90" fill="#e8d8b0"/>
      {[0,100,200,300,400,500,600,700].map(x=><rect key={x} x={x} y="390" width="100" height="90" fill="none" stroke="#d0c090" strokeWidth="1"/>)}
      {/* Shelf LEFT */}
      <rect x="20" y="100" width="160" height="280" rx="4" fill="white" stroke="#c0a060" strokeWidth="3"/>
      {[180,250,320].map(y=><rect key={y} x="20" y={y} width="160" height="8" rx="2" fill="#d0b870"/>)}
      {/* Teddy bear on shelf */}
      <circle cx="65" cy="130" r="22" fill="#9060c0"/>
      <circle cx="52" cy="115" r="10" fill="#9060c0"/>
      <circle cx="78" cy="115" r="10" fill="#9060c0"/>
      <circle cx="60" cy="128" r="5" fill="#7040a0"/>
      <circle cx="70" cy="128" r="5" fill="#7040a0"/>
      <path d="M60,137 Q65,142 70,137" stroke="#7040a0" strokeWidth="2" fill="none"/>
      {/* Box on shelf */}
      <rect x="95" y="110" width="44" height="40" rx="3" fill="#f4a020"/>
      <line x1="95" y1="130" x2="139" y2="130" stroke="#e89010" strokeWidth="2"/>
      <line x1="117" y1="110" x2="117" y2="150" stroke="#e89010" strokeWidth="2"/>
      {/* Toy cars on shelf 2 */}
      <rect x="30" y="200" width="40" height="20" rx="5" fill="#4080e8"/>
      <circle cx="38" cy="220" r="7" fill="#222"/>
      <circle cx="62" cy="220" r="7" fill="#222"/>
      <rect x="80" y="202" width="40" height="20" rx="5" fill="#e84040"/>
      <circle cx="88" cy="222" r="7" fill="#222"/>
      <circle cx="112" cy="222" r="7" fill="#222"/>
      {/* Books shelf 3 */}
      {[[30,270,16,42,'#e84040'],[50,268,14,44,'#4080e8'],[68,272,18,40,'#40c040'],[90,266,16,46,'#f4a020'],[110,270,16,42,'#9040c0']].map(([x,y,w,h,c])=><rect key={x} x={x} y={y} width={w} height={h} rx="2" fill={c as string}/>)}
      {/* Floor toys */}
      {/* Block pyramid */}
      <polygon points="40,410 80,380 120,410" fill="#f4a020"/>
      <rect x="50" y="410" width="70" height="30" rx="3" fill="#e84040"/>
      {/* Train */}
      <rect x="310" y="390" width="60" height="36" rx="5" fill="#e84040"/>
      <rect x="290" y="400" width="30" height="26" rx="4" fill="#c83020"/>
      <rect x="370" y="400" width="40" height="26" rx="4" fill="#40c040"/>
      <rect x="410" y="408" width="30" height="18" rx="3" fill="#4080e8"/>
      {[[302,426],[322,426],[342,426],[362,426],[382,426],[402,426],[422,426]].map(([x,y])=><circle key={x} cx={x} cy={y} r="9" fill="#222"/>)}
      {/* Toy airplane */}
      <ellipse cx="230" cy="410" rx="44" ry="12" fill="#40c040"/>
      <polygon points="274,405 290,410 274,415" fill="#40c040"/>
      <rect x="210" y="398" width="8" height="24" rx="3" fill="#30a030"/>
      {/* Color pyramid/stacking toy */}
      {([[560,430,60,16,'#e84040'],[565,416,50,16,'#f4a020'],[570,402,40,16,'#f4e020'],[575,388,30,16,'#40c040'],[580,374,20,16,'#4080e8']] as [number,number,number,number,string][]).map(([x,y,w,h,c])=><rect key={y} x={x} y={y} width={w} height={h} rx={h/2} fill={c}/>)}
      <rect x="587" y="366" width="6" height="12" rx="3" fill="#888"/>
      {/* Round rug */}
      <ellipse cx="700" cy="440" rx="70" ry="35" fill="#9040c0" opacity="0.7"/>
      <ellipse cx="700" cy="440" rx="50" ry="25" fill="#c060e0" opacity="0.7"/>
      {/* Chair right */}
      <rect x="730" y="310" width="55" height="60" rx="4" fill="#40c040"/>
      <rect x="720" y="360" width="75" height="8" rx="4" fill="#30a030"/>
      <rect x="726" y="368" width="14" height="22" rx="3" fill="#30a030"/>
      <rect x="776" y="368" width="14" height="22" rx="3" fill="#30a030"/>
      {/* Papers on wall */}
      <rect x="640" y="100" width="60" height="72" rx="3" fill="white" stroke="#d0b870" strokeWidth="2" transform="rotate(3 640 100)"/>
      <line x1="648" y1="118" x2="692" y2="118" stroke="#4080e8" strokeWidth="2"/>
      <line x1="648" y1="128" x2="685" y2="128" stroke="#e84040" strokeWidth="2"/>
      <rect x="720" y="95" width="55" height="66" rx="3" fill="white" stroke="#d0b870" strokeWidth="2" transform="rotate(-4 720 95)"/>
      <ellipse cx="745" cy="120" rx="18" ry="12" fill="#40c040" opacity="0.7"/>
      <line x1="730" y1="140" x2="765" y2="140" stroke="#888" strokeWidth="1.5"/>
    </svg>
  );
}

// ── Hospital ──────────────────────────────────────────────────────────────────
function HospitalSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Walls */}
      <rect width="800" height="480" fill="#4ecdc4"/>
      {/* Ceiling */}
      <rect x="0" y="0" width="800" height="50" fill="#d8f0f0"/>
      {/* Ceiling tiles */}
      {[0,100,200,300,400,500,600,700].map((x,i)=>[0,50].map(y=><rect key={`${x}${y}`} x={x} y={y} width="100" height="50" fill="none" stroke="#c0e0e0" strokeWidth="1"/>))}
      {/* Floor */}
      <rect x="0" y="400" width="800" height="80" fill="#f0ece0"/>
      {[0,100,200,300,400,500,600,700].map(x=><rect key={x} x={x} y="400" width="100" height="80" fill="none" stroke="#e0d8c8" strokeWidth="1"/>)}
      {/* Left wall desk */}
      <rect x="20" y="200" width="140" height="180" rx="4" fill="#c89050" stroke="#a87040" strokeWidth="3"/>
      <rect x="20" y="370" width="30" height="30" rx="3" fill="#a87040"/>
      <rect x="130" y="370" width="30" height="30" rx="3" fill="#a87040"/>
      {/* Drawers */}
      {[210,250,290,330].map(y=><rect key={y} x="30" y={y} width="120" height="32" rx="3" fill="#d8a060" stroke="#a87040" strokeWidth="1"/>)}
      {[210,250,290,330].map(y=><rect key={y} x="82" y={y+12} width="26" height="10" rx="4" fill="#a87040"/>)}
      {/* Computer on desk */}
      <rect x="35" y="170" width="70" height="46" rx="4" fill="#888" stroke="#666" strokeWidth="2"/>
      <rect x="40" y="175" width="60" height="36" rx="2" fill="#2a6080"/>
      <rect x="62" y="215" width="18" height="8" rx="2" fill="#888"/>
      <rect x="50" y="222" width="42" height="4" rx="2" fill="#888"/>
      {/* Windows LEFT */}
      <rect x="30" y="60" width="120" height="100" rx="4" fill="#e8f0f8" stroke="#b0c8d8" strokeWidth="4"/>
      <rect x="34" y="64" width="112" height="92" fill="#d8eaf8"/>
      <rect x="30" y="106" width="120" height="6" fill="#b0c8d8"/>
      <rect x="87" y="60" width="6" height="100" fill="#b0c8d8"/>
      {/* Curtain/shade */}
      <rect x="30" y="60" width="120" height="30" fill="#f0f0f0" opacity="0.8"/>
      {/* EXAMINATION TABLE center */}
      <rect x="280" y="280" width="240" height="80" rx="8" fill="#e8e4d8" stroke="#c0bcb0" strokeWidth="3"/>
      <rect x="280" y="278" width="240" height="20" rx="4" fill="#f0ece0"/>
      {/* Table legs */}
      <rect x="290" y="358" width="20" height="40" rx="4" fill="#b0a890"/>
      <rect x="490" y="358" width="20" height="40" rx="4" fill="#b0a890"/>
      <rect x="290" y="390" width="220" height="10" rx="4" fill="#a09880"/>
      {/* Red accents on table */}
      <rect x="280" y="310" width="8" height="50" rx="3" fill="#c83020"/>
      <rect x="512" y="310" width="8" height="50" rx="3" fill="#c83020"/>
      {/* Cabinets RIGHT */}
      <rect x="560" y="60" width="180" height="160" rx="4" fill="#c89050" stroke="#a87040" strokeWidth="3"/>
      {/* Cabinet doors */}
      <rect x="568" y="68" width="76" height="80" rx="3" fill="#d8a060" stroke="#a87040" strokeWidth="1"/>
      <rect x="652" y="68" width="76" height="80" rx="3" fill="#d8a060" stroke="#a87040" strokeWidth="1"/>
      {/* Handles */}
      <rect x="596" y="104" width="20" height="8" rx="4" fill="#a87040"/>
      <rect x="680" y="104" width="20" height="8" rx="4" fill="#a87040"/>
      {/* Lower cabinet */}
      <rect x="560" y="226" width="180" height="80" rx="4" fill="#c89050" stroke="#a87040" strokeWidth="3"/>
      <rect x="568" y="234" width="76" height="64" rx="3" fill="#d8a060" stroke="#a87040" strokeWidth="1"/>
      <rect x="652" y="234" width="76" height="64" rx="3" fill="#d8a060" stroke="#a87040" strokeWidth="1"/>
      <rect x="596" y="262" width="20" height="8" rx="4" fill="#a87040"/>
      <rect x="680" y="262" width="20" height="8" rx="4" fill="#a87040"/>
      {/* Countertop */}
      <rect x="555" y="220" width="190" height="12" rx="4" fill="#e0c080"/>
      {/* Red fire extinguisher on wall */}
      <rect x="240" y="160" width="28" height="60" rx="8" fill="#c83020" stroke="#a02010" strokeWidth="2"/>
      <rect x="246" y="148" width="16" height="16" rx="3" fill="#888"/>
      <path d="M254,148 Q260,130 270,128" stroke="#888" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Wall art / poster */}
      <rect x="390" y="80" width="100" height="120" rx="4" fill="white" stroke="#c0a060" strokeWidth="3"/>
      {/* Simple medical poster drawing */}
      <circle cx="440" cy="130" r="28" fill="#f0e0d8"/>
      <ellipse cx="440" cy="152" rx="22" ry="14" fill="#f0e0d8"/>
      <line x1="430" y1="166" x2="425" y2="190" stroke="#d0a880" strokeWidth="4" strokeLinecap="round"/>
      <line x1="450" y1="166" x2="455" y2="190" stroke="#d0a880" strokeWidth="4" strokeLinecap="round"/>
      {/* Windows RIGHT */}
      <rect x="650" y="310" width="100" height="80" rx="4" fill="#e8f0f8" stroke="#b0c8d8" strokeWidth="4"/>
      <rect x="654" y="314" width="92" height="72" fill="#d8eaf8"/>
      <rect x="650" y="348" width="100" height="6" fill="#b0c8d8"/>
      <rect x="697" y="310" width="6" height="80" fill="#b0c8d8"/>
      <rect x="650" y="310" width="100" height="24" fill="#f0f0f0" opacity="0.8"/>
      {/* Hanging light */}
      <rect x="390" y="0" width="6" height="40" fill="#888"/>
      <ellipse cx="393" cy="44" rx="20" ry="14" fill="#f8f8e0" stroke="#ccc" strokeWidth="2"/>
      <ellipse cx="393" cy="42" rx="16" ry="10" fill="white"/>
      {/* Red chair */}
      <rect x="178" y="300" width="70" height="60" rx="4" fill="#c83020"/>
      <rect x="168" y="352" width="90" height="10" rx="4" fill="#a02010"/>
      <rect x="172" y="360" width="18" height="30" rx="3" fill="#a02010"/>
      <rect x="240" y="360" width="18" height="30" rx="3" fill="#a02010"/>
    </svg>
  );
}

// ── Jail ──────────────────────────────────────────────────────────────────────
function JailSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Walls - dark teal bricks */}
      <rect width="800" height="480" fill="#2a6060"/>
      {/* Brick pattern */}
      {Array.from({length:12},(_,row)=>Array.from({length:10},(_,col)=>{
        const x=col*80+(row%2===0?0:40),y=row*40;
        return <rect key={`${row}${col}`} x={x} y={y} width="76" height="36" rx="2" fill="none" stroke="#1e5050" strokeWidth="2" opacity="0.5"/>;
      }))}
      {/* Cracks */}
      <path d="M100,200 L110,240 L105,280" stroke="#1e4848" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M600,150 L610,190 L605,220" stroke="#1e4848" strokeWidth="2" fill="none" opacity="0.6"/>
      {/* Graffiti on wall */}
      <text x="560" y="200" fill="#1e4848" fontSize="18" fontFamily="Arial" opacity="0.6">👹🎭</text>
      {/* Floor - cracked concrete */}
      <rect x="0" y="400" width="800" height="80" fill="#4a5050"/>
      <line x1="150" y1="400" x2="200" y2="480" stroke="#3a4040" strokeWidth="2"/>
      <line x1="400" y1="410" x2="380" y2="480" stroke="#3a4040" strokeWidth="2"/>
      <line x1="600" y1="405" x2="630" y2="480" stroke="#3a4040" strokeWidth="2"/>
      {/* Ceiling */}
      <rect x="0" y="0" width="800" height="40" fill="#2a5050"/>
      {/* Light beam from window */}
      <polygon points="480,130 600,130 680,400 360,400" fill="#d0e8c0" opacity="0.12"/>
      {/* HIGH WINDOW with bars */}
      <rect x="480" y="80" width="160" height="120" rx="4" fill="#c0d8e0" stroke="#888" strokeWidth="6"/>
      <rect x="484" y="84" width="152" height="112" fill="#a8c8d8"/>
      {/* Light coming through */}
      <rect x="484" y="84" width="152" height="112" fill="#e8f0c8" opacity="0.4"/>
      {/* Window bars */}
      {[510,540,570,600,630].map(x=><rect key={x} x={x} y="78" width="8" height="128" rx="3" fill="#e8e0c8" stroke="#ccc" strokeWidth="1"/>)}
      <rect x="480" y="120" width="160" height="8" fill="#e8e0c8" stroke="#ccc" strokeWidth="1"/>
      <rect x="480" y="148" width="160" height="8" fill="#e8e0c8" stroke="#ccc" strokeWidth="1"/>
      {/* Bolts on window frame */}
      {[[478,78],[638,78],[478,198],[638,198]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#888"/>)}
      {/* CELL BARS - main barrier */}
      <rect x="120" y="60" width="20" height="360" rx="4" fill="#d8d0b0" stroke="#c0b890" strokeWidth="2"/>
      <rect x="160" y="60" width="20" height="360" rx="4" fill="#d8d0b0" stroke="#c0b890" strokeWidth="2"/>
      <rect x="200" y="60" width="20" height="360" rx="4" fill="#d8d0b0" stroke="#c0b890" strokeWidth="2"/>
      <rect x="240" y="60" width="20" height="360" rx="4" fill="#d8d0b0" stroke="#c0b890" strokeWidth="2"/>
      <rect x="280" y="60" width="20" height="360" rx="4" fill="#d8d0b0" stroke="#c0b890" strokeWidth="2"/>
      {/* Door in bars */}
      <rect x="110" y="55" width="200" height="380" rx="6" fill="none" stroke="#c0b890" strokeWidth="5"/>
      {/* Door handle */}
      <rect x="294" y="225" width="28" height="10" rx="4" fill="#c0b890"/>
      {/* Horizontal bar supports */}
      {[120,220,320,420].map(y=><rect key={y} x="110" y={y} width="200" height="10" rx="4" fill="#c0b890"/>)}
      {/* BED */}
      <rect x="480" y="280" width="260" height="110" rx="6" fill="#808080" stroke="#666" strokeWidth="3"/>
      {/* Bed chains */}
      <rect x="490" y="270" width="12" height="30" rx="4" fill="#f4a020" stroke="#e09010" strokeWidth="1"/>
      <rect x="720" y="270" width="12" height="30" rx="4" fill="#f4a020" stroke="#e09010" strokeWidth="1"/>
      <line x1="496" y1="260" x2="496" y2="280" stroke="#888" strokeWidth="3"/>
      <line x1="726" y1="260" x2="726" y2="280" stroke="#888" strokeWidth="3"/>
      {/* Pillow */}
      <rect x="490" y="288" width="80" height="50" rx="8" fill="#f0e8d0" stroke="#d0c8b0" strokeWidth="2"/>
      <rect x="495" y="293" width="70" height="40" rx="6" fill="#f8f0e0"/>
      {/* Blanket */}
      <rect x="490" y="338" width="240" height="50" rx="6" fill="#c83020"/>
      <rect x="490" y="338" width="240" height="10" rx="4" fill="#e84040"/>
      {/* Nightstand */}
      <rect x="420" y="300" width="60" height="100" rx="4" fill="#606868" stroke="#506060" strokeWidth="2"/>
      <rect x="425" y="310" width="50" height="40" rx="2" fill="#708080" stroke="#506060" strokeWidth="1"/>
      <rect x="443" y="326" width="14" height="8" rx="3" fill="#506060"/>
      {/* Sink LEFT */}
      <rect x="20" y="240" width="70" height="55" rx="6" fill="#809090" stroke="#607070" strokeWidth="3"/>
      <ellipse cx="55" cy="280" rx="25" ry="14" fill="#6a8080"/>
      <rect x="48" y="240" width="14" height="16" rx="3" fill="#e84040"/>
      <rect x="48" y="255" width="14" height="8" rx="2" fill="#e84040" opacity="0.6"/>
      {/* Toilet paper */}
      <circle cx="35" cy="224" r="16" fill="#f0ece0" stroke="#c8c4b0" strokeWidth="2"/>
      <circle cx="35" cy="224" r="6" fill="white"/>
      {/* Sink RIGHT */}
      <rect x="710" y="240" width="70" height="55" rx="6" fill="#809090" stroke="#607070" strokeWidth="3"/>
      <ellipse cx="745" cy="280" rx="25" ry="14" fill="#6a8080"/>
      <rect x="738" y="240" width="14" height="16" rx="3" fill="#e84040"/>
      <rect x="738" y="255" width="14" height="8" rx="2" fill="#e84040" opacity="0.6"/>
    </svg>
  );
}

// ── Desert ────────────────────────────────────────────────────────────────────
function DesertSVG() {
  return (
    <svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="desertSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c030"/>
          <stop offset="60%" stopColor="#f4d040"/>
          <stop offset="100%" stopColor="#e8a820"/>
        </linearGradient>
      </defs>
      <rect width="800" height="480" fill="url(#desertSky)"/>
      {/* Sun */}
      <circle cx="400" cy="90" r="55" fill="#fff0a0" opacity="0.9"/>
      <circle cx="400" cy="90" r="42" fill="#fff8c0"/>
      {/* Sun glow */}
      <circle cx="400" cy="90" r="70" fill="#f4e060" opacity="0.2"/>
      {/* Horizontal light bands */}
      {[140,160,180,200].map(y=><rect key={y} x="0" y={y} width="800" height="6" fill="#f0c820" opacity="0.15"/>)}
      {/* Background mountains */}
      <polygon points="0,300 100,220 200,280 300,200 400,240 500,190 600,230 700,200 800,250 800,340 0,340" fill="#b08050" opacity="0.6"/>
      <polygon points="0,320 150,250 300,290 450,240 600,270 750,240 800,270 800,360 0,360" fill="#c09060" opacity="0.7"/>
      {/* Rock formations LEFT */}
      <ellipse cx="80" cy="320" rx="70" ry="50" fill="#8b6040"/>
      <ellipse cx="60" cy="310" rx="45" ry="38" fill="#9a7050"/>
      <ellipse cx="110" cy="308" rx="35" ry="30" fill="#7a5030"/>
      {/* Tall rock spires LEFT */}
      <rect x="20" y="220" width="28" height="140" rx="8" fill="#8b6040"/>
      <ellipse cx="34" cy="220" rx="14" ry="18" fill="#7a5030"/>
      <rect x="60" y="240" width="22" height="120" rx="6" fill="#9a7050"/>
      {/* Rock formations RIGHT */}
      <ellipse cx="720" cy="320" rx="70" ry="50" fill="#8b6040"/>
      <ellipse cx="740" cy="310" rx="45" ry="38" fill="#9a7050"/>
      <ellipse cx="690" cy="308" rx="38" ry="32" fill="#7a5030"/>
      <rect x="750" y="225" width="26" height="135" rx="7" fill="#8b6040"/>
      <ellipse cx="763" cy="225" rx="13" ry="16" fill="#7a5030"/>
      <rect x="710" y="245" width="20" height="115" rx="6" fill="#9a7050"/>
      {/* Mid rocks */}
      <ellipse cx="350" cy="340" rx="50" ry="25" fill="#9a7050"/>
      <ellipse cx="450" cy="345" rx="40" ry="20" fill="#8b6040"/>
      {/* Ground */}
      <rect x="0" y="340" width="800" height="140" fill="#c8a050"/>
      <ellipse cx="400" cy="340" rx="400" ry="20" fill="#d4a858"/>
      {/* Ground texture - dirt patches */}
      {[[100,380,30,8],[250,360,25,6],[500,370,35,8],[650,385,28,7],[180,400,20,5],[550,395,22,6]].map(([x,y,rx,ry],i)=><ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#b89040" opacity="0.5"/>)}
      {/* Cactus plants (bush-like) */}
      {[[120,350],[680,345],[310,358],[490,352]].map(([x,y],i)=>[
        <ellipse key={`c${i}`} cx={x} cy={y} rx="16" ry="20" fill="#508030"/>,
        <ellipse key={`c2${i}`} cx={x-14} cy={y+8} rx="12" ry="14" fill="#60a040"/>,
        <ellipse key={`c3${i}`} cx={x+14} cy={y+8} rx="12" ry="14" fill="#60a040"/>,
      ])}
      {/* Small rocks / boulders */}
      {[[200,370,18,10],[380,380,14,8],[560,372,16,9],[700,382,12,7]].map(([x,y,rx,ry],i)=><ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#9a7050"/>)}
      {/* Dry grass tufts */}
      {[[160,355],[280,362],[430,358],[580,360],[720,355]].map(([x,y],i)=>[
        <line key={`g1${i}`} x1={x} y1={y} x2={x-8} y2={y-18} stroke="#a08030" strokeWidth="2" strokeLinecap="round"/>,
        <line key={`g2${i}`} x1={x} y1={y} x2={x+8} y2={y-18} stroke="#a08030" strokeWidth="2" strokeLinecap="round"/>,
        <line key={`g3${i}`} x1={x} y1={y} x2={x} y2={y-22} stroke="#b09040" strokeWidth="2" strokeLinecap="round"/>,
      ])}
    </svg>
  );
}

// ── Scene renderer ────────────────────────────────────────────────────────────
export function SceneBackground({ sceneKey }: { sceneKey: string }) {
  switch (sceneKey) {
    case 'city':       return <CityDaySVG/>;
    case 'city_night': return <CityNightSVG/>;
    case 'park':       return <ParkSVG/>;
    case 'playground': return <PlaygroundSVG/>;
    case 'farm':       return <FarmSVG/>;
    case 'school':     return <SchoolSVG/>;
    case 'daycare':    return <DaycareSVG/>;
    case 'hospital':   return <HospitalSVG/>;
    case 'jail':       return <JailSVG/>;
    case 'desert':     return <DesertSVG/>;
    default:           return null;
  }
}
