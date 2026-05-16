import { useState, useCallback } from "react";

// ─── THEME ─────────────────────────────────────────────────────
const C = {
  bg: "#07090F",
  s1: "#0D1320",
  s2: "#111827",
  s3: "#162035",
  b1: "#1E2D45",
  b2: "#263650",
  grn: "#00E96A",
  grn2: "#00B855",
  yel: "#FFD726",
  red: "#FF3D5A",
  blu: "#2B8FFF",
  txt: "#F0F6FF",
  t2: "#A8BDD4",
  t3: "#52697F",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: ${C.bg}; font-family: 'Inter', sans-serif; color: ${C.txt}; -webkit-font-smoothing: antialiased; }
  .shell { max-width: 430px; margin: 0 auto; min-height: 100vh; background: ${C.bg}; display: flex; flex-direction: column; position: relative; }
  .screen { flex: 1; overflow-y: auto; padding-bottom: 88px; }
  .screen::-webkit-scrollbar { display: none; }
  input, select, textarea, button { font-family: 'Inter', sans-serif; }
  input::placeholder { color: ${C.t3}; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  .fade-up { animation: fadeUp .3s ease both; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 99px; background: ${C.b1}; cursor: pointer; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${C.grn}; box-shadow: 0 0 10px rgba(0,233,106,.4); cursor: pointer; }
`;

// ─── SHARED COMPONENTS ─────────────────────────────────────────
const S = ({ children, style }) => <span style={style}>{children}</span>;

const Btn = ({ children, onClick, style, variant = "green" }) => {
  const base = { border: "none", borderRadius: 14, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
  const vars = {
    green: { background: C.grn, color: C.bg },
    blue:  { background: C.blu, color: "#fff" },
    ghost: { background: "rgba(255,255,255,.06)", color: C.t2, border: `1.5px solid ${C.b1}` },
    red:   { background: `rgba(255,61,90,.12)`, color: C.red, border: `1.5px solid rgba(255,61,90,.3)` },
    yel:   { background: C.yel, color: C.bg },
  };
  return <button style={{ ...base, ...vars[variant], ...style }} onClick={onClick}>{children}</button>;
};

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: C.t3, marginBottom: 7 }}>{label}</div>}
    <input style={{ width: "100%", background: C.s2, border: `1.5px solid ${C.b1}`, borderRadius: 13, padding: "13px 15px", fontSize: 15, color: C.txt, outline: "none" }} {...props} />
  </div>
);

const Pill = ({ children, color = C.grn, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, color, background: bg || `${color}20`, border: `1px solid ${color}40` }}>
    {children}
  </span>
);

const Dot = ({ color = C.grn }) => (
  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", animation: "pulse 1.4s infinite" }} />
);

const SecLabel = ({ children, style }) => (
  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "3px", textTransform: "uppercase", color: C.t3, padding: "0 20px", marginBottom: 12, ...style }}>{children}</div>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{ background: C.s2, border: `1.5px solid ${C.b1}`, borderRadius: 18, overflow: "hidden", cursor: onClick ? "pointer" : "default", ...style }}>
    {children}
  </div>
);

// ─── GAME CARD ──────────────────────────────────────────────────
const LEVEL_COLOR = { "Casual":"#52697F", "Intermediário":"#2B8FFF", "Sério":"#FF3D5A" };

const GameCard = ({ game, onEnter }) => (
  <Card onClick={onEnter} style={{ margin: "0 20px 10px" }}>
    {/* Top: team + slots */}
    <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 46, height: 46, minWidth: 46, borderRadius: 12, background: game.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{game.icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: C.txt, lineHeight: 1.2 }}>{game.name}</div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{game.mod}</div>
        </div>
      </div>
      <Pill color={game.slots === 1 ? C.red : C.grn}>{game.slots === 1 ? "ÚLTIMA VAGA" : `${game.slots} vagas`}</Pill>
    </div>

    {/* Info chips: data, hora, local */}
    <div style={{ padding: "0 16px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
      {[`📅 ${game.date}`, `🕐 ${game.time}`, `📍 ${game.place}`].map(t => (
        <span key={t} style={{ background: C.b1, borderRadius: 7, padding: "4px 9px", fontSize: 12, color: C.t2 }}>{t}</span>
      ))}
    </div>

    {/* Tags: nível, duração, árbitro, goleiro */}
    <div style={{ padding: "0 16px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
      {/* Nível */}
      <span style={{ background: `${LEVEL_COLOR[game.level]}18`, color: LEVEL_COLOR[game.level], border: `1px solid ${LEVEL_COLOR[game.level]}40`, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
        {game.level === "Casual" ? "😎" : game.level === "Intermediário" ? "💪" : "🔥"} {game.level}
      </span>
      {/* Duração */}
      <span style={{ background: "rgba(167,139,250,.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,.25)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
        ⏱ {game.dur}
      </span>
      {/* Goleiro */}
      <span style={{ background: game.goalkeeper ? "rgba(255,215,38,.1)" : "rgba(255,255,255,.04)", color: game.goalkeeper ? C.yel : C.t3, border: `1px solid ${game.goalkeeper ? "rgba(255,215,38,.25)" : C.b1}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
        🥅 {game.goalkeeper ? "Com goleiro" : "Sem goleiro"}
      </span>
      {/* Árbitro */}
      <span style={{ background: game.referee ? "rgba(0,233,106,.08)" : "rgba(255,255,255,.04)", color: game.referee ? C.grn : C.t3, border: `1px solid ${game.referee ? "rgba(0,233,106,.2)" : C.b1}`, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>
        📋 {game.referee ? "Com árbitro" : "Sem árbitro"}
      </span>
    </div>

    {/* Footer: preço + botão */}
    <div style={{ background: "#0C1120", borderTop: `1px solid ${C.b1}`, padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, color: C.grn, lineHeight: 1 }}>R${game.price}</div>
        <div style={{ fontSize: 10, color: C.t3, marginTop: 1 }}>por jogador · {game.totalPlayers} no total</div>
      </div>
      <button onClick={e => { e.stopPropagation(); onEnter(); }} style={{ background: C.grn, color: C.bg, border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Entrar →</button>
    </div>
  </Card>
);

// ─── DATA ───────────────────────────────────────────────────────
const GAMES = [
  { id:1, name:"Esquadrão FC",   mod:"Society 7", level:"Intermediário", icon:"🦅", iconBg:"rgba(43,143,255,.15)", date:"Sáb 17/05", time:"16h", place:"Arena Tarumã",   slots:2, price:35, dur:"1h30", referee:false, goalkeeper:true,  totalPlayers:14 },
  { id:2, name:"Los Compadres",  mod:"Fut 5",     level:"Casual",        icon:"🔥", iconBg:"rgba(255,61,90,.12)",  date:"Sex 16/05", time:"20h", place:"Fut Arena CIC",   slots:1, price:25, dur:"1h",   referee:false, goalkeeper:false, totalPlayers:10 },
  { id:3, name:"Pelé FC",        mod:"Society 7", level:"Sério",         icon:"⭐", iconBg:"rgba(255,215,38,.1)",  date:"Dom 18/05", time:"10h", place:"Complex Sports",  slots:3, price:40, dur:"2h",   referee:true,  goalkeeper:true,  totalPlayers:14 },
];

const WEEK_GAMES = [
  { day:"SEX 16/05", name:"Pelada CIC", time:"20h · Fut 5", paid:3, total:10, color:C.t3 },
  { day:"SÁB 17/05", name:"Pelada do Xaxim", time:"15h · Society 7", paid:8, total:14, color:C.yel, highlight:true },
  { day:"DOM 18/05", name:"Racha Domingo", time:"10h · Society 7", paid:0, total:0, color:C.t3, pending:true },
];

const SHOP = [
  { icon:"⚽", name:"Bola Penalty S11", brand:"Campo/Society", price:"R$ 129" },
  { icon:"👟", name:"Chuteira Predator", brand:"Society", price:"R$ 289" },
  { icon:"🥅", name:"Luvas Reusch Pro", brand:"Goleiro", price:"R$ 159" },
  { icon:"🦵", name:"Caneleira Nike", brand:"Leve", price:"R$ 59" },
  { icon:"👕", name:"Camisa racha.app", brand:"Oficial", price:"R$ 89", highlight:true },
];

const PLAYERS = [
  { id:1, n:"Rodrigo Maia", p:"Atacante", i:"RM", c:"#1E3A5F", s:"confirmed", paid:true },
  { id:2, n:"Lucas Ferreira", p:"Meia", i:"LF", c:"#2D1B4E", s:"pending", paid:false },
  { id:3, n:"Gabriel Santos", p:"Zagueiro", i:"GS", c:"#1A3A2A", s:"pending", paid:false },
  { id:4, n:"Felipe Costa", p:"Lateral", i:"FC", c:"#3A1A1A", s:"declined", paid:false },
  { id:5, n:"André Moura", p:"Volante", i:"AM", c:"#1F2A3A", s:"not_sent", paid:false },
  { id:6, n:"Thiago Lima", p:"Goleiro", i:"TL", c:"#2A2A1A", s:"confirmed", paid:true },
  { id:7, n:"Carlos Alves", p:"Atacante", i:"CA", c:"#3A1F1A", s:"not_sent", paid:false },
  { id:8, n:"Diego Nunes", p:"Meia", i:"DN", c:"#1A2A3A", s:"confirmed", paid:true },
];

const RANK = [
  { i:"RM", n:"Rodrigo Maia", t:"🔴", pts:47, g:23, a:11, pr:87, c:"#1E3A5F" },
  { i:"LF", n:"Lucas Ferreira", t:"🔴", pts:34, g:14, a:8,  pr:82, c:"#2D1B4E" },
  { i:"DN", n:"Diego Nunes",    t:"🔵", pts:29, g:11, a:9,  pr:79, c:"#1A2838" },
  { i:"GS", n:"Gabriel Santos", t:"🔵", pts:24, g:6,  a:5,  pr:91, c:"#1A3A2A" },
  { i:"AM", n:"André Moura",    t:"🟡", pts:19, g:8,  a:3,  pr:74, c:"#1F2A3A" },
  { i:"FC", n:"Felipe Costa",   t:"🔵", pts:15, g:4,  a:6,  pr:68, c:"#3A1A1A" },
];

// ─── SCREENS ────────────────────────────────────────────────────

// LOGIN
function Login({ onLogin }) {
  const [name, setName] = useState("");
  const enter = () => { if (name.trim()) onLogin(name.trim()); };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 24px", paddingTop:"max(60px, env(safe-area-inset-top))", paddingBottom: 32, overflowY:"auto" }}>
      <div style={{ position:"absolute", top:"-80px", left:"50%", transform:"translateX(-50%)", width:280, height:280, background:"radial-gradient(ellipse,rgba(0,233,106,.07),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:52, marginBottom:8 }}>⚽</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:48, fontWeight:800, letterSpacing:3, marginBottom:5, color:C.txt }}>racha<span style={{ color:C.grn }}>.</span>app</div>
        <div style={{ fontSize:14, color:C.t2 }}>Organiza. Convoca. Joga.</div>
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", color:C.t3, textAlign:"center", marginBottom:14 }}>Entrar com</div>
      {[["🇬","Continuar com Google","#1E2D45"],["🍎","Continuar com Apple","#1E2D45"],["💬","Continuar com WhatsApp","rgba(37,211,102,.1)"]].map(([ico,lbl,bg],i) => (
        <button key={i} onClick={() => onLogin(lbl.split(" ").pop())} style={{ width:"100%", background:bg, border:`1.5px solid ${i===2?"rgba(37,211,102,.3)":C.b1}`, borderRadius:15, padding:"15px 18px", display:"flex", alignItems:"center", gap:13, cursor:"pointer", marginBottom:9, transition:"border-color .15s" }}>
          <span style={{ fontSize:22 }}>{ico}</span>
          <span style={{ fontSize:15, fontWeight:700, color: i===2?"#25D366":C.txt, flex:1, textAlign:"left" }}>{lbl}</span>
          <span style={{ color:C.t3, fontSize:18 }}>›</span>
        </button>
      ))}
      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" }}>
        <div style={{ flex:1, height:1, background:C.b1 }} />
        <span style={{ fontSize:12, color:C.t3, fontWeight:700 }}>ou use seu celular</span>
        <div style={{ flex:1, height:1, background:C.b1 }} />
      </div>
      <Input label="Seu nome" placeholder="Ex: Matheus" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enter()} autoComplete="given-name" />
      <Input label="WhatsApp" placeholder="(41) 99999-9999" type="tel" />
      <Btn onClick={enter}>Entrar no racha.app →</Btn>
      <div style={{ textAlign:"center", fontSize:12, color:C.t3, marginTop:14, lineHeight:1.6 }}>
        Ao continuar você aceita os <span style={{ color:C.grn }}>Termos</span> e <span style={{ color:C.grn }}>Privacidade</span>
      </div>
    </div>
  );
}

// HOME
const RIVALS = [
  { name:"Esquadrão FC", emoji:"🦅", mod:"Society 7", level:"Intermediário", want:"Sáb 17/05 · 16h", dist:"1,2 km" },
  { name:"Los Compadres", emoji:"🔥", mod:"Fut 5", level:"Casual", want:"Sex 16/05 · 20h", dist:"2,8 km" },
  { name:"Pelé FC", emoji:"⭐", mod:"Society 7", level:"Sério", want:"Dom 18/05 · 10h", dist:"4,1 km" },
  { name:"Feras do Sul", emoji:"🐯", mod:"Society 7", level:"Inter.", want:"Sáb 24/05 · 15h", dist:"5,5 km" },
];

// VENUES DATA
const VENUES = [
  {
    id:1, name:"Donos da Bola", img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80", area:"Xaxim · Curitiba",
    rating:4.8, reviews:142, price:200, priceUnit:"hora",
    sports:["Society 7","Fut 5"], cover:"🏟",
    rentals:[
      { id:"bola", name:"Bola Society", icon:"⚽", price:15, unit:"por jogo", stock:3 },
      { id:"chuteira", name:"Chuteira Society", icon:"👟", price:20, unit:"por jogo", stock:4, sizes:"38-44" },
      { id:"colete", name:"Kit Coletes (14un)", icon:"🦺", price:10, unit:"por jogo", stock:5 },
    ],
    slots:[
      { day:"Sáb", date:"17/05", time:"08h00", available:true  },
      { day:"Sáb", date:"17/05", time:"09h30", available:false },
      { day:"Sáb", date:"17/05", time:"11h00", available:true  },
      { day:"Sáb", date:"17/05", time:"14h00", available:true  },
      { day:"Sáb", date:"17/05", time:"15h30", available:false },
      { day:"Dom", date:"18/05", time:"08h00", available:true  },
      { day:"Dom", date:"18/05", time:"09h30", available:true  },
    ]
  },
  {
    id:2, name:"American Sport", img:"https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80", area:"Portão · Curitiba",
    rating:4.6, reviews:89, price:180, priceUnit:"hora",
    sports:["Society 7","Futsal","Campo 11"], cover:"⚽",
    rentals:[
      { id:"bola", name:"Bola Futsal", icon:"⚽", price:12, unit:"por jogo", stock:2 },
      { id:"chuteira", name:"Chuteira Futsal", icon:"👟", price:18, unit:"por jogo", stock:6, sizes:"37-45" },
    ],
    slots:[
      { day:"Sex", date:"16/05", time:"20h00", available:true  },
      { day:"Sex", date:"16/05", time:"21h30", available:true  },
      { day:"Sáb", date:"17/05", time:"10h00", available:true  },
      { day:"Sáb", date:"17/05", time:"13h00", available:false },
      { day:"Dom", date:"18/05", time:"10h00", available:true  },
    ]
  },
  {
    id:3, name:"Arena CIC", img:"https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80", area:"CIC · Curitiba",
    rating:4.5, reviews:67, price:160, priceUnit:"hora",
    sports:["Fut 5","Futsal"], cover:"🏢",
    rentals:[
      { id:"bola", name:"Bola Fut 5", icon:"⚽", price:10, unit:"por jogo", stock:3 },
      { id:"colete", name:"Kit Coletes (10un)", icon:"🦺", price:8, unit:"por jogo", stock:4 },
    ],
    slots:[
      { day:"Sex", date:"16/05", time:"19h00", available:true  },
      { day:"Sex", date:"16/05", time:"20h30", available:true  },
      { day:"Sáb", date:"17/05", time:"09h00", available:false },
      { day:"Sáb", date:"17/05", time:"16h00", available:true  },
    ]
  },
  {
    id:4, name:"Complex Sports", img:"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", area:"Água Verde · Curitiba",
    rating:4.9, reviews:201, price:250, priceUnit:"hora",
    sports:["Society 7","Campo 11"], cover:"🌿",
    rentals:[
      { id:"bola", name:"Bola Society Premium", icon:"⚽", price:20, unit:"por jogo", stock:5 },
      { id:"chuteira", name:"Chuteira Society", icon:"👟", price:25, unit:"por jogo", stock:8, sizes:"38-46" },
      { id:"colete", name:"Kit Coletes (14un)", icon:"🦺", price:10, unit:"por jogo", stock:3 },
      { id:"shin", name:"Caneleira (par)", icon:"🦵", price:8, unit:"por jogo", stock:10 },
    ],
    slots:[
      { day:"Sáb", date:"17/05", time:"07h00", available:true  },
      { day:"Sáb", date:"17/05", time:"19h30", available:true  },
      { day:"Dom", date:"18/05", time:"08h00", available:false },
      { day:"Dom", date:"18/05", time:"10h00", available:true  },
    ]
  },
];


function Home({ user, goTo, toast }) {
  const hasConvite = true; // simula convite pendente

  return (
    <div style={{ paddingTop:"max(52px, env(safe-area-inset-top))" }}>

      {/* ── HEADER com separador ── */}
      <div style={{ background:"#0D1320", borderBottom:"1px solid #1E2D45", padding:"0 20px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#F0F6FF" }}>
            racha<span style={{ color:"#00E96A" }}>.</span>app
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative", fontSize:20, cursor:"pointer" }} onClick={() => toast("🔔 2 notificações!")}>
              🔔<div style={{ position:"absolute", top:-1, right:-1, width:8, height:8, background:"#FF3D5A", borderRadius:"50%", border:"2px solid #0D1320" }} />
            </div>
            <button onClick={() => goTo("perfil")} style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#00B855,#00E96A)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:15, color:"#07090F", border:"none", cursor:"pointer" }}>
              {user[0]?.toUpperCase()}
            </button>
          </div>
        </div>
        <div style={{ marginTop:10 }}>
          <div style={{ fontSize:12, color:"#A8BDD4" }}>Olá, <b style={{ color:"#F0F6FF" }}>{user}</b> 👋</div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#F0F6FF", marginTop:2 }}>Bora pra próxima pelada?</div>
        </div>
      </div>

      {/* ── 1. CONVITE PENDENTE ── */}
      {hasConvite && (
        <div style={{ margin:"16px 20px 0", background:"linear-gradient(135deg,#0A1020,#111827)", border:"2px solid #2B8FFF", borderRadius:18, padding:18, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-8, bottom:-8, fontSize:60, opacity:.08 }}>📨</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <span style={{ width:6, height:6, background:"#2B8FFF", borderRadius:"50%", display:"inline-block", animation:"pulse 1.4s infinite" }} />
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:2, color:"#2B8FFF", textTransform:"uppercase" }}>Você foi convocado</span>
          </div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:22, color:"#F0F6FF", marginBottom:3 }}>Pelada do Xaxim</div>
          <div style={{ fontSize:12, color:"#A8BDD4", marginBottom:14 }}>Rodrigo te convidou · Sáb 17/05 · 15h · Arena Tarumã</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => goTo("pay-landing")} style={{ flex:2, background:"#2B8FFF", color:"#fff", border:"none", borderRadius:12, padding:12, fontSize:14, fontWeight:800, cursor:"pointer" }}>✅ Aceitar e Pagar R$23</button>
            <button onClick={() => toast("❌ Convite recusado")} style={{ flex:1, background:"rgba(255,255,255,.06)", color:"#A8BDD4", border:"1.5px solid #1E2D45", borderRadius:12, padding:12, fontSize:13, fontWeight:700, cursor:"pointer" }}>Recusar</button>
          </div>
        </div>
      )}

      {/* ── 2. SUA PRÓXIMA PELADA ── */}
      <div style={{ margin:"14px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>⚽ SUA PRÓXIMA PELADA</div>
        <div onClick={() => goTo("convocar")} style={{ background:"linear-gradient(135deg,#071408,#0D2010)", border:"2px solid #00CC55", borderRadius:18, padding:18, cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-10, bottom:-10, fontSize:75, opacity:.07 }}>⚽</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ width:6, height:6, background:"#00E96A", borderRadius:"50%", display:"inline-block", animation:"pulse 1.4s infinite" }} />
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:2, color:"#00E96A", textTransform:"uppercase" }}>Confirmando</span>
            <span style={{ background:"rgba(0,233,106,.12)", color:"#00E96A", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:800, marginLeft:"auto" }}>Sáb 17/05 · 15h</span>
          </div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:22, color:"#F0F6FF", marginBottom:3 }}>Pelada do Xaxim</div>
          <div style={{ fontSize:12, color:"#A8BDD4", marginBottom:12 }}>Arena Tarumã · Society 7 · <b style={{ color:"#00E96A" }}>R$23/jogador</b></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#A8BDD4", marginBottom:5 }}>
            <span>Confirmados</span><strong style={{ color:"#00E96A" }}>8 / 14</strong>
          </div>
          <div style={{ height:5, background:"rgba(255,255,255,.08)", borderRadius:99, overflow:"hidden", marginBottom:14 }}>
            <div style={{ height:"100%", width:"57%", background:"linear-gradient(90deg,#00B855,#00E96A)", borderRadius:99 }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={e=>{e.stopPropagation();goTo("convocar");}} style={{ flex:1, background:"#00E96A", color:"#07090F", border:"none", borderRadius:12, padding:12, fontSize:13, fontWeight:800, cursor:"pointer" }}>Convocar →</button>
            <button onClick={e=>{e.stopPropagation();toast("📋 Copiado!");}} style={{ background:"rgba(255,255,255,.07)", color:"#F0F6FF", border:"1.5px solid #1E2D45", borderRadius:12, padding:"12px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Lista</button>
          </div>
        </div>
      </div>

      {/* ── 3. DOIS BOTÕES ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"14px 20px 0" }}>
        <button onClick={() => goTo("wiz1")} style={{ background:"linear-gradient(160deg,#071610,#0D2A18)", border:"2px solid #00E96A", borderRadius:18, padding:"18px 14px", textAlign:"left", cursor:"pointer", minHeight:155, display:"block", width:"100%", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-8, bottom:-8, fontSize:60, opacity:.08 }}>🏟</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#00E96A", marginBottom:10 }}>
            <span style={{ width:5, height:5, background:"#00E96A", borderRadius:"50%", display:"inline-block", animation:"pulse 1.4s infinite" }} /><span>ORGANIZAR</span>
          </div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:24, fontWeight:800, lineHeight:.95, color:"#F0F6FF", marginBottom:2 }}>CRIA<br/>A</div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:24, fontWeight:800, lineHeight:.95, color:"#00E96A", marginBottom:14 }}>PELADA</div>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#00E96A", color:"#07090F", borderRadius:99, padding:"8px 14px", fontSize:12, fontWeight:800 }}>⚽ Criar</span>
        </button>
        <button onClick={() => goTo("achar")} style={{ background:"linear-gradient(160deg,#07091A,#091525)", border:"2px solid #2B8FFF", borderRadius:18, padding:"18px 14px", textAlign:"left", cursor:"pointer", minHeight:155, display:"block", width:"100%", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-8, bottom:-8, fontSize:60, opacity:.08 }}>📍</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#2B8FFF", marginBottom:10 }}>
            <span style={{ width:5, height:5, background:"#2B8FFF", borderRadius:"50%", display:"inline-block", animation:"pulse 1.4s infinite" }} /><span>ACHAR</span>
          </div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:24, fontWeight:800, lineHeight:.95, color:"#F0F6FF", marginBottom:2 }}>ENTRA<br/>EM</div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:24, fontWeight:800, lineHeight:.95, color:"#2B8FFF", marginBottom:14 }}>JOGO</div>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#2B8FFF", color:"#fff", borderRadius:99, padding:"8px 12px", fontSize:12, fontWeight:800 }}>📍 Perto de mim</span>
        </button>
      </div>

      {/* ── 4. TIMES BUSCANDO DUELO ── */}
      <div style={{ marginTop:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F" }}>⚔️ TIMES BUSCANDO DUELO</div>
          <button onClick={() => goTo("amistosos")} style={{ background:"none", border:"none", color:"#00E96A", fontSize:12, fontWeight:700, cursor:"pointer" }}>Ver todos →</button>
        </div>
        <div style={{ display:"flex", gap:10, padding:"0 20px", overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
          {RIVALS.map((r,i) => (
            <div key={i} onClick={() => toast(`⚔️ Solicitação enviada pra ${r.name}!`)} style={{ flexShrink:0, width:170, background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:14, cursor:"pointer", transition:"border-color .18s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:40, height:40, minWidth:40, borderRadius:11, background:"rgba(43,143,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{r.emoji}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#F0F6FF", lineHeight:1.2 }}>{r.name}</div>
                  <div style={{ fontSize:10, color:"#52697F" }}>{r.mod}</div>
                </div>
              </div>
              <div style={{ fontSize:11, color:"#A8BDD4", marginBottom:3 }}>📅 {r.want}</div>
              <div style={{ fontSize:11, color:"#52697F", marginBottom:10 }}>📍 {r.dist}</div>
              <div style={{ background:"rgba(43,143,255,.12)", color:"#2B8FFF", border:"1px solid rgba(43,143,255,.3)", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:800, textAlign:"center" }}>
                Desafiar
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. VAGAS ABERTAS ── */}
      <div style={{ marginTop:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F" }}>🔥 VAGAS ABERTAS AGORA</div>
          <button onClick={() => goTo("achar")} style={{ background:"none", border:"none", color:"#00E96A", fontSize:12, fontWeight:700, cursor:"pointer" }}>Ver todos →</button>
        </div>
        {GAMES.map(g => <GameCard key={g.id} game={g} onEnter={() => goTo("pay-landing")} />)}
      </div>

      {/* ── 6. JOGOS DA SEMANA ── */}
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F", padding:"0 20px", marginBottom:12 }}>📅 JOGOS DA SEMANA</div>
        <div style={{ display:"flex", gap:10, padding:"0 20px", overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
          {WEEK_GAMES.map((g,i) => (
            <div key={i} onClick={() => goTo("convocar")} style={{ flexShrink:0, width:145, background:"#111827", border:`2px solid ${g.highlight?"#00E96A":"#1E2D45"}`, borderRadius:14, padding:14, cursor:"pointer" }}>
              <div style={{ fontSize:10, fontWeight:800, color:g.highlight?"#FFD726":"#52697F", letterSpacing:1, marginBottom:6 }}>{g.day}</div>
              <div style={{ fontWeight:800, fontSize:14, color:"#F0F6FF", marginBottom:3, lineHeight:1.2 }}>{g.name}</div>
              <div style={{ fontSize:11, color:"#52697F", marginBottom:10 }}>{g.time}</div>
              {g.pending
                ? <div style={{ background:"#1E2D45", borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:800, color:"#52697F", textAlign:"center" }}>A confirmar</div>
                : <div style={{ background:"rgba(0,233,106,.12)", borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:800, color:"#00E96A", textAlign:"center" }}>{g.paid} / {g.total} pagos</div>
              }
            </div>
          ))}
          <div onClick={() => goTo("wiz1")} style={{ flexShrink:0, width:120, background:"#111827", border:"2px dashed #1E2D45", borderRadius:14, padding:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:6 }}>
            <div style={{ fontSize:26 }}>➕</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#52697F" }}>Nova pelada</div>
          </div>
        </div>
      </div>

      {/* ── 7. GANHE / SERVIÇOS ── */}
      <div style={{ marginTop:20, padding:"0 20px" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F", marginBottom:12 }}>💼 GANHE COM O RACHA</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          <button onClick={() => goTo("seja-goleiro")} style={{ background:"linear-gradient(160deg,#0F1809,#192509)", border:"2px solid rgba(255,215,38,.4)", borderRadius:16, padding:16, textAlign:"left", cursor:"pointer", display:"block", width:"100%" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🥅</div>
            <div style={{ fontWeight:800, fontSize:15, color:"#F0F6FF", marginBottom:3 }}>Seja Goleiro</div>
            <div style={{ fontSize:11, color:"#52697F", marginBottom:10 }}>de aluguel na sua região</div>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(255,215,38,.12)", color:"#FFD726", border:"1px solid rgba(255,215,38,.25)", borderRadius:99, padding:"4px 10px", fontSize:11, fontWeight:700 }}>Ganhe R$35/h</span>
          </button>
          <button onClick={() => goTo("seja-arbitro")} style={{ background:"linear-gradient(160deg,#090F1A,#0C1525)", border:"2px solid rgba(43,143,255,.4)", borderRadius:16, padding:16, textAlign:"left", cursor:"pointer", display:"block", width:"100%" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
            <div style={{ fontWeight:800, fontSize:15, color:"#F0F6FF", marginBottom:3 }}>Seja Árbitro</div>
            <div style={{ fontSize:11, color:"#52697F", marginBottom:10 }}>apite jogos na área</div>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(43,143,255,.12)", color:"#2B8FFF", border:"1px solid rgba(43,143,255,.25)", borderRadius:99, padding:"4px 10px", fontSize:11, fontWeight:700 }}>Ver tabela</span>
          </button>
        </div>
      </div>

      {/* ── 8. PRO PLAN TEASER ── */}
      <div style={{ margin:"0 20px 20px", background:"linear-gradient(135deg,#14080A,#200C12)", border:"2px solid rgba(255,61,90,.3)", borderRadius:18, padding:18, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-10, top:-10, fontSize:80, opacity:.08 }}>🏆</div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <span style={{ background:"linear-gradient(135deg,#FF3D5A,#FF6080)", color:"#fff", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800, letterSpacing:.5 }}>PRÓ</span>
          <span style={{ fontWeight:800, fontSize:15, color:"#F0F6FF" }}>Ranking Oficial</span>
        </div>
        <div style={{ fontSize:13, color:"#A8BDD4", lineHeight:1.6, marginBottom:14 }}>
          Tenha estatísticas oficiais, participe do ranking e dispute campeonatos. Jogos com árbitro contam pontos.
        </div>
        <div style={{ display:"flex", gap:16, marginBottom:14 }}>
          {[["🏅","Ranking mensal & anual"],["⚽","Estatísticas por jogo"],["🏁","Jogos com árbitro"],["👕","Cadastro de time"]].map(([ico,lbl])=>(
            <div key={lbl} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#A8BDD4", flexShrink:0 }}>
              <span>{ico}</span><span>{lbl}</span>
            </div>
          ))}
        </div>
        <button onClick={() => toast("🚀 Plano PRÓ em breve!")} style={{ background:"linear-gradient(135deg,#FF3D5A,#FF6080)", color:"#fff", border:"none", borderRadius:12, padding:"11px 20px", fontSize:14, fontWeight:800, cursor:"pointer" }}>
          Quero ser PRÓ →
        </button>
      </div>

      {/* ── 9. EQUIPAMENTOS ── */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F" }}>🛒 EQUIPAMENTOS</div>
          <span style={{ fontSize:10, color:"#52697F", fontWeight:600 }}>Parceiro: Centaurus</span>
        </div>
        <div style={{ display:"flex", gap:10, padding:"0 20px", overflowX:"auto", paddingBottom:4, scrollbarWidth:"none" }}>
          {SHOP.map((s,i) => (
            <div key={i} onClick={() => toast("🛒 Abrindo parceiro...")} style={{ flexShrink:0, width:118, background:s.highlight?"linear-gradient(135deg,#071610,#0D2A18)":"#111827", border:`2px solid ${s.highlight?"rgba(0,233,106,.4)":"#1E2D45"}`, borderRadius:14, overflow:"hidden", cursor:"pointer" }}>
              <div style={{ height:78, background:"#0C1828", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>{s.icon}</div>
              <div style={{ padding:"8px 9px 10px" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#F0F6FF", marginBottom:1, lineHeight:1.2 }}>{s.name}</div>
                <div style={{ fontSize:9, color:"#52697F", marginBottom:5 }}>{s.brand}</div>
                <div style={{ fontSize:17, fontWeight:900, color:s.highlight?"#FFD726":"#00E96A" }}>{s.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:20 }} />
    </div>
  );
}


// WIZARD
function Wizard({ goTo, toast }) {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState("society7");
  const [nivel, setNivel] = useState("casual");
  const [dur, setDur] = useState(60);
  const [jog, setJog] = useState(14);
  const [cancha, setCancha] = useState(200);
  const [gol, setGol] = useState("rev");

  const gkCharged = (gol==="rev"?0:gol==="1gk"?40:80)*(dur/60);
  const gkPaid    = (gol==="rev"?0:gol==="1gk"?35:70)*(dur/60);
  const total     = cancha + gkCharged;
  const pj        = total / jog;
  const fee       = Math.ceil(pj * 0.15);
  const pays      = Math.ceil(pj) + fee;
  const rachaEarns= fee * jog + (gkCharged - gkPaid);

  const OPT = ({id,group,label,desc,em,sel,onSel}) => (
    <div onClick={()=>onSel(id)} style={{ background:sel===id?"rgba(0,233,106,.08)":C.s2, border:`2px solid ${sel===id?C.grn:C.b1}`, borderRadius:18, padding:"18px 14px", cursor:"pointer", transition:"all .18s" }}>
      <div style={{ fontSize:32, marginBottom:10 }}>{em}</div>
      <div style={{ fontWeight:800, fontSize:18, color:sel===id?C.grn:C.txt, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:11, color:C.t3 }}>{desc}</div>
    </div>
  );

  const WizHdr = ({step:s,total:t}) => (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 20px 0", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
      <div onClick={()=>s>1?setStep(s-1):goTo("home")} style={{ width:38, height:38, borderRadius:11, background:C.s2, border:`1.5px solid ${C.b1}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18, flexShrink:0 }}>←</div>
      <div style={{ flex:1, height:3, background:C.b1, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(s/t)*100}%`, background:C.grn, borderRadius:99, transition:"width .4s ease" }} />
      </div>
      <div style={{ fontSize:12, fontWeight:700, color:C.t3, whiteSpace:"nowrap" }}>{s} / {t}</div>
    </div>
  );

  if (step===1) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <WizHdr step={1} total={5} />
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Passo 1</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, lineHeight:.93, marginBottom:6 }}>Que tipo<br/>de pelada?</div>
        <div style={{ fontSize:14, color:C.t2, marginBottom:22 }}>Formato e nível definem tudo.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {[["society7","Society 7","7×7 grama sint.","🏟"],["fut5","Fut 5","5×5 coberto","⚡"],["campo","Campo 11","11×11 grama","🌿"],["futsal","Futsal","5×5 quadra","🏢"]].map(([id,lbl,d,em])=>(
            <OPT key={id} id={id} sel={tipo} onSel={setTipo} label={lbl} desc={d} em={em} />
          ))}
        </div>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:10 }}>Nível</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:8 }}>
          {[["casual","Casual","😎","Só se divertir"],["inter","Intermediário","💪","Competitivo"],["serio","Sério","🔥","Com árbitro"]].map(([id,lbl,em,d])=>(
            <OPT key={id} id={id} sel={nivel} onSel={setNivel} label={lbl} desc={d} em={em} />
          ))}
        </div>
      </div>
      <div style={{ flexShrink:0, padding:"14px 20px max(20px,env(safe-area-inset-bottom))", background:`linear-gradient(0,${C.bg} 60%,transparent)` }}>
        <Btn onClick={()=>setStep(2)}>Próximo → Quando e onde</Btn>
      </div>
    </div>
  );

  if (step===2) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <WizHdr step={2} total={5} />
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Passo 2</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, lineHeight:.93, marginBottom:6 }}>Quando<br/>e onde?</div>
        <div style={{ fontSize:14, color:C.t2, marginBottom:22 }}>Dados da cancha. O app monta o convite.</div>
        <Input label="Nome da pelada" placeholder="Ex: Pelada do Xaxim" defaultValue="Pelada do Xaxim" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Data" type="date" />
          <Input label="Horário" type="time" defaultValue="15:00" />
        </div>
        <Input label="Cancha / Local" placeholder="Ex: Arena Tarumã" defaultValue="Arena Tarumã" />
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:10 }}>Duração</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[[60,"1h"],[90,"1h30"],[120,"2h"]].map(([v,lbl])=>(
            <div key={v} onClick={()=>setDur(v)} style={{ background:dur===v?"rgba(0,233,106,.08)":C.s2, border:`2px solid ${dur===v?C.grn:C.b1}`, borderRadius:14, padding:"14px 8px", cursor:"pointer", textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>⏱</div>
              <div style={{ fontWeight:800, fontSize:18, color:dur===v?C.grn:C.txt }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink:0, padding:"14px 20px max(20px,env(safe-area-inset-bottom))", background:`linear-gradient(0,${C.bg} 60%,transparent)` }}>
        <Btn onClick={()=>setStep(3)}>Próximo → Quantos jogadores</Btn>
      </div>
    </div>
  );

  if (step===3) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <WizHdr step={3} total={5} />
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Passo 3</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, lineHeight:.93, marginBottom:6 }}>Quantos<br/>jogadores?</div>
        <div style={{ fontSize:14, color:C.t2, marginBottom:22 }}>E o custo da cancha. O app divide tudo.</div>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:C.t3 }}>Jogadores</span>
            <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:26, fontWeight:800, color:C.grn, lineHeight:1 }}>{jog} <small style={{ fontFamily:"Inter", fontSize:13, color:C.t2 }}>jogadores</small></span>
          </div>
          <input type="range" min={6} max={24} value={jog} onChange={e=>setJog(+e.target.value)} />
        </div>
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:C.t3 }}>Custo da cancha</span>
            <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:26, fontWeight:800, color:C.grn, lineHeight:1 }}>R$ <small style={{ fontFamily:"Inter", fontSize:13, color:C.t2 }}>{cancha}</small></span>
          </div>
          <input type="range" min={80} max={600} step={20} value={cancha} onChange={e=>setCancha(+e.target.value)} />
        </div>
        <div style={{ background:"rgba(0,233,106,.06)", border:"1px solid rgba(0,233,106,.15)", borderRadius:14, padding:14 }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Preview</div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
            <span style={{ color:C.t2 }}>Cancha ÷ {jog} jogadores</span>
            <span style={{ fontWeight:800 }}>R$ {Math.ceil(cancha/jog)}</span>
          </div>
        </div>
      </div>
      <div style={{ flexShrink:0, padding:"14px 20px max(20px,env(safe-area-inset-bottom))", background:`linear-gradient(0,${C.bg} 60%,transparent)` }}>
        <Btn onClick={()=>setStep(4)}>Próximo → Quem vai no gol?</Btn>
      </div>
    </div>
  );

  if (step===4) return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <WizHdr step={4} total={5} />
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Passo 4</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, lineHeight:.93, marginBottom:6 }}>Quem vai<br/>no gol?</div>
        <div style={{ fontSize:14, color:C.t2, marginBottom:20 }}>Impacta o custo por jogador.</div>
        {[["rev","🔄","Reveza no Gol","Jogadores se revezam","Grátis",C.grn],["1gk","🥅","1 Goleiro","Aluguel · R$40 cobrado, GK recebe R$35","R$40/h",C.yel],["2gk","🥅🥅","2 Goleiros","Um pra cada lado · R$80 total","R$80/h",C.red]].map(([id,em,lbl,desc,price,color])=>(
          <div key={id} onClick={()=>setGol(id)} style={{ background:gol===id?"rgba(0,233,106,.06)":C.s2, border:`2px solid ${gol===id?C.grn:C.b1}`, borderRadius:18, padding:18, display:"flex", alignItems:"center", gap:14, cursor:"pointer", marginBottom:10, transition:"all .18s" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:gol===id?"rgba(0,233,106,.1)":"rgba(255,255,255,.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{em}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:18, color:gol===id?C.grn:C.txt, marginBottom:2 }}>{lbl}</div>
              <div style={{ fontSize:12, color:C.t2 }}>{desc}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:800, color }}>{price}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexShrink:0, padding:"14px 20px max(20px,env(safe-area-inset-bottom))", background:`linear-gradient(0,${C.bg} 60%,transparent)` }}>
        <Btn onClick={()=>setStep(5)}>Ver custo total →</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <WizHdr step={5} total={5} />
      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 0" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:C.grn, marginBottom:8 }}>Tudo certo!</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, lineHeight:.93, marginBottom:6 }}>Resumo<br/>financeiro</div>
        <div style={{ fontSize:14, color:C.t2, marginBottom:20 }}>Pelada do Xaxim · {jog} jog. · Arena Tarumã</div>
        <div style={{ background:"linear-gradient(160deg,#091808,#0C2010)", border:"1.5px solid rgba(0,233,106,.2)", borderRadius:18, padding:18, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontWeight:800, fontSize:14, letterSpacing:1, color:C.grn }}>💰 Calculadora de Custo</span>
            <span style={{ background:"rgba(255,215,38,.12)", color:C.yel, border:"1px solid rgba(255,215,38,.25)", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800 }}>15% racha.app</span>
          </div>
          {[["Cancha",`R$ ${cancha}`],[`Goleiro(s)`,gol==="rev"?"Grátis":`R$ ${gkCharged}`],["Total fixo",`R$ ${total}`]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
              <span style={{ fontSize:13, color:C.t2 }}>{l}</span>
              <span style={{ fontWeight:800, fontSize:17 }}>{v}</span>
            </div>
          ))}
          <div style={{ height:1, background:"rgba(0,233,106,.15)", margin:"8px 0" }} />
          {[[`Custo por jogador (${jog})`,`R$ ${Math.ceil(pj)}`],["Taxa racha.app (15%)",`+ R$ ${fee}`]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
              <span style={{ fontSize:13, color:C.t2 }}>{l}</span>
              <span style={{ fontWeight:800, fontSize:17, color:l.includes("Taxa")?C.yel:C.txt }}>{v}</span>
            </div>
          ))}
          <div style={{ background:"rgba(0,233,106,.1)", border:"1px solid rgba(0,233,106,.2)", borderRadius:12, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
            <span style={{ fontSize:15, fontWeight:700 }}>Cada jogador paga</span>
            <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:36, fontWeight:800, color:C.grn }}>R$ {pays}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,215,38,.06)", border:"1px solid rgba(255,215,38,.15)", borderRadius:10, padding:"9px 13px", marginTop:8 }}>
            <span style={{ fontSize:12, color:C.t3 }}>racha.app recebe no total</span>
            <span style={{ fontWeight:800, fontSize:18, color:C.yel }}>R$ {Math.ceil(rachaEarns)}</span>
          </div>
        </div>
      </div>
      <div style={{ flexShrink:0, padding:"14px 20px max(20px,env(safe-area-inset-bottom))", background:`linear-gradient(0,${C.bg} 60%,transparent)` }}>
        <Btn onClick={()=>{toast("⚽ Pelada criada! Hora de convocar!");goTo("convocar");}}>⚽ Criar e Convocar!</Btn>
      </div>
    </div>
  );
}

// CONVOCAR
function Convocar({ goTo, toast }) {
  const [players, setPlayers] = useState(PLAYERS);
  const paid  = players.filter(p=>p.paid).length;
  const conf  = players.filter(p=>p.s==="confirmed").length;
  const pend  = players.filter(p=>p.s==="pending").length;
  const decl  = players.filter(p=>p.s==="declined").length;
  const sendInvite = id => { setPlayers(ps=>ps.map(p=>p.id===id?{...p,s:"pending"}:p)); toast("📨 Convite enviado!"); };
  const confirmPay = id => { setPlayers(ps=>ps.map(p=>p.id===id?{...p,paid:true,s:"confirmed"}:p)); toast("💚 PIX confirmado!"); };
  return (
    <div>
      <div style={{ padding:"max(52px,env(safe-area-inset-top)) 20px 18px" }}>
        <button onClick={()=>goTo("home")} style={{ background:"none", border:"none", color:C.t2, fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>← Início</button>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(0,233,106,.07)", border:"1px solid rgba(0,233,106,.18)", borderRadius:11, padding:"7px 13px", marginBottom:12 }}>
          <span style={{ fontSize:13 }}>⚽</span><span style={{ fontSize:12, fontWeight:700 }}>Pelada do Xaxim</span>
        </div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:32, lineHeight:.92, marginBottom:4 }}>Pelada do Xaxim</div>
        <div style={{ fontSize:13, color:C.t2, marginBottom:14 }}>Arena Tarumã · <b style={{ color:C.grn }}>R$23/jog.</b></div>
        <div style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}><span style={{ color:C.t2 }}>Pagamentos confirmados</span><strong style={{ color:C.grn }}>{paid} / 14</strong></div>
          <div style={{ height:5, background:C.b2, borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.round((paid/14)*100)}%`, background:`linear-gradient(90deg,${C.grn2},${C.grn})`, borderRadius:99, transition:"width .6s" }} />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[[conf,"Confirmados",C.grn],[pend,"Aguardando",C.yel],[decl,"Recusaram",C.red]].map(([n,l,c])=>(
            <div key={l} style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, color:c }}>{n}</div>
              <div style={{ fontSize:10, color:C.t3, textTransform:"uppercase", letterSpacing:.5, marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <SecLabel>LISTA DE CONVOCAÇÃO</SecLabel>
      {players.map(p=>(
        <div key={p.id} style={{ margin:"0 20px 8px", background:C.s2, border:`1.5px solid ${p.paid?"rgba(0,233,106,.35)":C.b1}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:11, opacity:p.s==="declined"?.55:1 }}>
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.n}&backgroundColor=${p.c.replace('#','')}&textColor=ffffff&fontSize=36&fontWeight=700`} alt={p.n} style={{ width:40, height:40, borderRadius:"50%", flexShrink:0, objectFit:"cover" }} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:1 }}>{p.n}</div>
            <div style={{ fontSize:11, color:C.t3 }}>{p.p}</div>
          </div>
          <div>
            {p.paid && <Pill>✓ Pago</Pill>}
            {!p.paid && p.s==="confirmed" && <button onClick={()=>confirmPay(p.id)} style={{ background:"rgba(255,215,38,.1)", color:C.yel, border:"1px solid rgba(255,215,38,.3)", borderRadius:99, padding:"5px 10px", fontSize:11, fontWeight:800, cursor:"pointer" }}>Confirmar PIX</button>}
            {p.s==="pending" && <Pill color={C.yel}>⏳ Enviado</Pill>}
            {p.s==="declined" && <Pill color={C.red}>✗ Recusou</Pill>}
            {p.s==="not_sent" && <button onClick={()=>sendInvite(p.id)} style={{ background:C.s3, color:C.t2, border:`1.5px solid ${C.b1}`, borderRadius:99, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>Convocar</button>}
          </div>
        </div>
      ))}
      <div style={{ padding:"12px 20px" }}>
        <Btn variant="ghost" onClick={()=>toast("📱 Adicione pelo WhatsApp!")}>+ Adicionar Jogador</Btn>
      </div>
    </div>
  );
}

// ACHAR
function Achar({ goTo, toast }) {
  return (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 0 0" }}>
      <div style={{ padding:"0 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:28 }}>Achar <span style={{ color:C.blu }}>Pelada</span></div>
        <span style={{ fontSize:12, fontWeight:700, color:C.t3 }}>📍 Curitiba</span>
      </div>
      <div style={{ margin:"0 20px 12px", display:"flex", alignItems:"center", gap:10, background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:14, padding:"12px 15px" }}>
        <span style={{ opacity:.5 }}>🔍</span>
        <input style={{ flex:1, background:"none", border:"none", fontSize:15, color:C.txt, outline:"none" }} placeholder="Buscar por bairro ou time..." />
      </div>
      <div style={{ display:"flex", gap:8, padding:"0 20px", overflow:"hidden", marginBottom:16, flexWrap:"wrap" }}>
        {["Todos","Society 7","Fut 5","Hoje","Até R$30"].map(f=>(
          <span key={f} style={{ background:f==="Todos"?"rgba(0,233,106,.12)":C.s2, border:`1.5px solid ${f==="Todos"?C.grn:C.b1}`, color:f==="Todos"?C.grn:C.t2, borderRadius:99, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{f}</span>
        ))}
      </div>
      <SecLabel>6 JOGOS PRÓXIMOS</SecLabel>
      {GAMES.map(g=><GameCard key={g.id} game={g} onEnter={()=>goTo("pay-landing")} />)}
    </div>
  );
}

// PAY FLOW
function PayLanding({ goTo }) {
  return (
    <div style={{ overflowY:"auto" }}>
      <div style={{ background:"linear-gradient(170deg,#0A1D0F,#0D2416 60%,#060810)", borderBottom:"1px solid rgba(0,233,106,.15)", padding:"max(56px,env(safe-area-inset-top)) 22px 24px" }}>
        <button onClick={()=>goTo("achar")} style={{ background:"none", border:"none", color:C.t2, fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:18, display:"flex", alignItems:"center", gap:6 }}>← Voltar</button>
        <div style={{ fontSize:12, color:C.t3, marginBottom:5, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>Rodrigo te convidou pra</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:28, lineHeight:.93, marginBottom:5 }}>Pelada do<br/>Xaxim</div>
        <div style={{ fontSize:13, color:C.t2, marginBottom:20 }}>Sáb 17/05 · 15h · Arena Tarumã</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:6 }}>
          <span style={{ fontWeight:800, fontSize:18, color:C.t2 }}>R$</span>
          <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:72, color:C.grn, lineHeight:1 }}>23</span>
        </div>
        <div style={{ background:"rgba(0,0,0,.25)", borderRadius:12, padding:13, border:"1px solid rgba(255,255,255,.06)" }}>
          {[["Custo da vaga","R$ 20,00"],["Taxa racha.app","R$ 3,00"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"4px 0", color:C.t2 }}><span>{l}</span><span style={{ color:C.txt }}>{v}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:700, padding:"8px 0 4px", borderTop:"1px solid rgba(255,255,255,.08)", marginTop:4 }}><span>Total</span><span style={{ color:C.grn }}>R$ 23,00</span></div>
        </div>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ fontWeight:800, fontSize:14, letterSpacing:2, textTransform:"uppercase", color:C.t3, marginBottom:14 }}>Como pagar?</div>
        {[["⚡","PIX","Aprovação instantânea · Recomendado","pay-pix","green"],["💳","Cartão","Crédito em até 3x sem juros","pay-card","blue"]].map(([ico,name,sub,dest,v])=>(
          <button key={name} onClick={()=>goTo(dest)} style={{ display:"flex", alignItems:"center", gap:16, background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:17, padding:18, cursor:"pointer", width:"100%", textAlign:"left", marginBottom:10, transition:"border-color .18s" }}>
            <div style={{ width:50, height:50, borderRadius:13, background:v==="green"?"rgba(0,233,106,.1)":"rgba(43,143,255,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{ico}</div>
            <div><div style={{ fontSize:15, fontWeight:700, marginBottom:2 }}>{name}</div><div style={{ fontSize:12, color:C.t3 }}>{sub}</div></div>
            {v==="green" && <Pill style={{ marginLeft:"auto" }}>Rápido</Pill>}
            {v==="blue" && <span style={{ marginLeft:"auto", fontSize:22, color:C.t3 }}>›</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function PayPix({ goTo, toast }) {
  return (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 22px 32px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ alignSelf:"flex-start", marginBottom:16 }}>
        <button onClick={()=>goTo("pay-landing")} style={{ background:"none", border:"none", color:C.t2, fontSize:14, fontWeight:600, cursor:"pointer" }}>← Formas de pagamento</button>
      </div>
      <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:32, marginBottom:4, alignSelf:"flex-start" }}>Pague via PIX</div>
      <div style={{ fontSize:13, color:C.t2, marginBottom:18, alignSelf:"flex-start" }}>Escaneie ou copie a chave</div>
      <div style={{ background:"rgba(255,215,38,.12)", border:"1px solid rgba(255,215,38,.3)", borderRadius:99, padding:"7px 18px", fontWeight:800, fontSize:20, color:C.yel, letterSpacing:2, marginBottom:18 }}>04:59</div>
      <div style={{ width:188, height:188, background:"#fff", borderRadius:20, padding:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, boxShadow:"0 0 40px rgba(0,233,106,.1)" }}>
        <div style={{ width:"100%", height:"100%", background:"repeating-conic-gradient(#000 0% 25%,#fff 0% 50%) 0 0/18px 18px", borderRadius:4, position:"relative" }}>
          <div style={{ position:"absolute", inset:"28%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:4, fontSize:20 }}>⚽</div>
        </div>
      </div>
      <div style={{ fontSize:13, color:C.t3, marginBottom:12, fontWeight:600 }}>ou copie a chave PIX abaixo</div>
      <div onClick={()=>toast("📋 Chave copiada!")} style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:14, padding:"13px 15px", width:"100%", display:"flex", alignItems:"center", gap:10, cursor:"pointer", marginBottom:8 }}>
        <span style={{ fontSize:12, color:C.t3, flex:1, wordBreak:"break-all", lineHeight:1.4 }}>racha.app-xaxim-17052025@pix.com.br</span>
        <span style={{ background:"rgba(0,233,106,.1)", color:C.grn, border:"1px solid rgba(0,233,106,.25)", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:800, whiteSpace:"nowrap", cursor:"pointer" }}>Copiar</span>
      </div>
      <div style={{ fontSize:12, color:C.t3, textAlign:"center", marginBottom:20, lineHeight:1.6 }}>Confirmação automática em até <b style={{ color:C.grn }}>30 segundos</b>.</div>
      <Btn onClick={()=>goTo("pay-success")} style={{ marginBottom:10 }}>✅ Já paguei · Confirmar</Btn>
      <Btn variant="ghost" onClick={()=>goTo("pay-landing")}>← Trocar forma de pagamento</Btn>
    </div>
  );
}

function PaySuccess({ goTo }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", minHeight:"100%" }}>
      <div style={{ width:108, height:108, borderRadius:"50%", background:"rgba(0,233,106,.12)", border:"2px solid #00CC55", display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, marginBottom:26, animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)", boxShadow:"0 0 50px rgba(0,233,106,.15)" }}>✅</div>
      <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:52, lineHeight:.9, color:C.grn, marginBottom:12 }}>VAGA<br/>GARANTIDA!</div>
      <p style={{ fontSize:15, color:C.t2, lineHeight:1.6, maxWidth:280, margin:"0 auto 28px" }}>Confirmado na Pelada do Xaxim. Até sábado! 🔥</p>
      <div style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:18, padding:18, width:"100%", marginBottom:18, textAlign:"left" }}>
        {[["Jogo","Pelada do Xaxim"],["Data","Sáb 17/05 · 15h"],["Local","Arena Tarumã"],["Pago","R$ 23,00 ✓"]].map(([l,v])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.b1}`, fontSize:13 }}>
            <span style={{ color:C.t3 }}>{l}</span><span style={{ fontWeight:700, color:l==="Pago"?C.grn:C.txt }}>{v}</span>
          </div>
        ))}
      </div>
      <Btn onClick={()=>goTo("home")} style={{ marginBottom:10 }}>Voltar ao início →</Btn>
    </div>
  );
}

// TIMES
const REGION_TEAMS = [
  { id:1, name:"Esquadrão FC",   emoji:"🦅", mod:"Society 7", level:"Intermediário", city:"Xaxim · CWB",    pts:39, v:12, e:3, d:2,  players:11, looking:true,  nextGame:"Sáb 17/05 · 16h" },
  { id:2, name:"Los Compadres",  emoji:"🔥", mod:"Fut 5",     level:"Casual",        city:"CIC · CWB",      pts:28, v:8,  e:4, d:5,  players:8,  looking:true,  nextGame:"Sex 16/05 · 20h" },
  { id:3, name:"Pelé FC",        emoji:"⭐", mod:"Society 7", level:"Sério",         city:"Batel · CWB",    pts:45, v:14, e:3, d:1,  players:12, looking:false, nextGame:null },
  { id:4, name:"Feras do Sul",   emoji:"🐯", mod:"Society 7", level:"Intermediário", city:"Portão · CWB",   pts:22, v:6,  e:4, d:7,  players:10, looking:true,  nextGame:"Sáb 17/05 · 15h" },
  { id:5, name:"Unidos do Bairro",emoji:"💪",mod:"Futsal",    level:"Casual",        city:"Cajuru · CWB",   pts:15, v:4,  e:3, d:9,  players:9,  looking:true,  nextGame:"Dom 18/05 · 10h" },
];

function Times({ goTo, toast }) {
  const [tab, setTab] = useState("buscar");
  const [challenged, setChallenged] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMod, setTeamMod] = useState("Society 7");

  // Simula que o usuário TEM um time cadastrado
  const myTeam = {
    name:"Pelada do Xaxim FC", emoji:"⚽",
    mod:"Society 7", level:"Intermediário", city:"Xaxim · Curitiba",
    pts:39, v:12, e:3, d:2, players:8, totalPlayers:14,
    playerList:["Rodrigo","Lucas","Gabriel","Felipe","André","Thiago","Diego","Carlos"],
  };

  const challenge = (id, name) => {
    setChallenged(c => ({...c,[id]:true}));
    toast(`⚔️ Desafio enviado pro ${name}!`);
  };

  if (showCreate) return (
    <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))", padding:"max(52px,env(safe-area-inset-top)) 20px 32px" }}>
      <button onClick={()=>setShowCreate(false)} style={{ background:"none", border:"none", color:"#A8BDD4", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:20 }}>← Voltar</button>
      <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, fontWeight:700, marginBottom:4 }}>Cadastrar Time</div>
      <div style={{ fontSize:14, color:"#A8BDD4", marginBottom:24, lineHeight:1.5 }}>Seu time aparece pra toda a região e pode buscar amistosos e entrar no ranking.</div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"#52697F", marginBottom:7 }}>Nome do Time</div>
        <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Ex: Pelada do Xaxim FC" style={{ width:"100%", background:"#111827", border:"1.5px solid #1E2D45", borderRadius:13, padding:"13px 15px", fontSize:15, color:"#F0F6FF", outline:"none" }} />
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>Modalidade</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {["Society 7","Fut 5","Campo 11","Futsal"].map(m => (
            <div key={m} onClick={()=>setTeamMod(m)} style={{ background:teamMod===m?"rgba(0,233,106,.1)":"#111827", border:`1.5px solid ${teamMod===m?"#00E96A":"#1E2D45"}`, color:teamMod===m?"#00E96A":"#F0F6FF", borderRadius:99, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{m}</div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:"1.5px", textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>Nível</div>
        <div style={{ display:"flex", gap:8 }}>
          {["Casual","Intermediário","Sério"].map(n => (
            <div key={n} style={{ flex:1, background:"#111827", border:"1.5px solid #1E2D45", borderRadius:12, padding:12, textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#A8BDD4" }}>{n}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"rgba(0,233,106,.06)", border:"1.5px solid rgba(0,233,106,.18)", borderRadius:14, padding:14, marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#00E96A", marginBottom:4 }}>✓ O que você ganha</div>
        <div style={{ fontSize:12, color:"#A8BDD4", lineHeight:1.6 }}>
          · Aparece pra outros times buscando amistoso<br/>
          · Acumula pontos no ranking regional<br/>
          · Histórico de jogos e estatísticas<br/>
          · Com plano PRÓ: ranking oficial com árbitro
        </div>
      </div>
      <button onClick={()=>{ if(!teamName.trim()){toast("⚠️ Dá um nome pro time!");return;} toast("✅ "+teamName+" cadastrado!"); setShowCreate(false); }} style={{ width:"100%", background:"#00E96A", color:"#07090F", border:"none", borderRadius:14, padding:15, fontSize:15, fontWeight:800, cursor:"pointer" }}>
        Cadastrar Time →
      </button>
    </div>
  );

  return (
    <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))" }}>

      {/* Header */}
      <div style={{ background:"#0D1320", borderBottom:"1px solid #1E2D45", padding:"0 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:14 }}>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:24, fontWeight:700 }}>Times</div>
        </div>
        <div style={{ display:"flex", borderTop:"1px solid #1E2D45" }}>
          {[["buscar","🔍 Buscar Times"],["meu","⚽ Meu Time"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setTab(id)} style={{ flex:1, background:"none", border:"none", borderBottom:`2px solid ${tab===id?"#00E96A":"transparent"}`, padding:"12px 0", fontSize:13, fontWeight:700, color:tab===id?"#00E96A":"#52697F", cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* ── ABA BUSCAR ── */}
      {tab === "buscar" && (
        <div>
          <div style={{ padding:"14px 20px 10px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#111827", border:"1.5px solid #1E2D45", borderRadius:14, padding:"11px 14px", marginBottom:12 }}>
              <span style={{ opacity:.5 }}>🔍</span>
              <input style={{ flex:1, background:"none", border:"none", fontSize:14, color:"#F0F6FF", outline:"none" }} placeholder="Buscar time por nome ou bairro..." />
            </div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
              {["Todos","Buscando duelo","Society 7","Fut 5","Perto de mim"].map(f => (
                <span key={f} style={{ flexShrink:0, background:f==="Todos"?"rgba(0,233,106,.12)":"#111827", border:`1.5px solid ${f==="Todos"?"#00E96A":"#1E2D45"}`, color:f==="Todos"?"#00E96A":"#A8BDD4", borderRadius:99, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{f}</span>
              ))}
            </div>
          </div>

          <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F", padding:"4px 20px 10px" }}>
            {REGION_TEAMS.filter(t=>t.looking).length} TIMES BUSCANDO AMISTOSO
          </div>

          {REGION_TEAMS.map(t => (
            <div key={t.id} style={{ margin:"0 20px 10px", background:"#111827", border:`1.5px solid ${t.looking?"#1E2D45":"rgba(255,255,255,.06)"}`, borderRadius:18, overflow:"hidden", opacity:t.looking?1:.6 }}>
              <div style={{ padding:"14px 16px 12px", display:"flex", alignItems:"center", gap:12 }}>
                {/* Team badge */}
                <div style={{ width:52, height:52, minWidth:52, borderRadius:14, background:"rgba(0,233,106,.06)", border:"1.5px solid #1E2D45", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{t.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                    <div style={{ fontWeight:800, fontSize:17, color:"#F0F6FF" }}>{t.name}</div>
                    {t.looking && <span style={{ background:"rgba(0,233,106,.12)", color:"#00E96A", border:"1px solid rgba(0,233,106,.25)", borderRadius:5, padding:"2px 6px", fontSize:9, fontWeight:800, letterSpacing:1 }}>BUSCA DUELO</span>}
                  </div>
                  <div style={{ fontSize:11, color:"#52697F", marginBottom:4 }}>{t.mod} · {t.level} · 📍 {t.city}</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ fontSize:12, color:"#A8BDD4" }}>{t.v}V {t.e}E {t.d}D</span>
                    <span style={{ fontSize:12, fontWeight:800, color:"#FFD726" }}>{t.pts} pts</span>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:13, color:"#52697F", marginBottom:8 }}>{t.players} jog.</div>
                  {t.looking ? (
                    challenged[t.id]
                      ? <span style={{ background:"rgba(0,233,106,.12)", color:"#00E96A", border:"1px solid rgba(0,233,106,.25)", borderRadius:99, padding:"6px 12px", fontSize:12, fontWeight:800 }}>✓ Enviado</span>
                      : <button onClick={()=>challenge(t.id, t.name)} style={{ background:"rgba(255,215,38,.12)", color:"#FFD726", border:"1px solid rgba(255,215,38,.3)", borderRadius:99, padding:"6px 12px", fontSize:12, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>Desafiar ⚔️</button>
                  ) : (
                    <span style={{ fontSize:11, color:"#52697F" }}>Indisponível</span>
                  )}
                </div>
              </div>
              {t.nextGame && (
                <div style={{ background:"#0C1120", borderTop:"1px solid #1E2D45", padding:"9px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:11, color:"#52697F" }}>Próximo jogo: <b style={{ color:"#A8BDD4" }}>{t.nextGame}</b></div>
                  <span style={{ fontSize:11, color:"#00E96A", fontWeight:700 }}>Assistir ao vivo →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── ABA MEU TIME ── */}
      {tab === "meu" && (
        <div style={{ padding:"16px 20px 0" }}>
          {/* Card do time */}
          <div style={{ background:"linear-gradient(135deg,#0A1520,#111827)", border:"2px solid #00E96A", borderRadius:20, padding:20, marginBottom:20, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-10, top:-10, fontSize:90, opacity:.06 }}>⚽</div>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <div style={{ width:60, height:60, borderRadius:16, background:"rgba(0,233,106,.08)", border:"2px solid rgba(0,233,106,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{myTeam.emoji}</div>
              <div>
                <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, fontWeight:700, color:"#F0F6FF", marginBottom:3 }}>{myTeam.name}</div>
                <div style={{ fontSize:12, color:"#52697F" }}>{myTeam.mod} · {myTeam.level} · 📍 {myTeam.city}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:16 }}>
              {[[myTeam.pts+"pts","Pontos","#FFD726"],[myTeam.v+"V","Vitórias","#00E96A"],[myTeam.e+"E","Empates","#A8BDD4"],[myTeam.d+"D","Derrotas","#FF3D5A"]].map(([v,l,c])=>(
                <div key={l} style={{ background:"rgba(0,0,0,.2)", borderRadius:10, padding:"10px 6px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, fontWeight:700, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:"#52697F", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>toast("⚔️ Abrindo busca de adversários...")} style={{ flex:1, background:"#00E96A", color:"#07090F", border:"none", borderRadius:12, padding:12, fontSize:13, fontWeight:800, cursor:"pointer" }}>⚔️ Buscar Amistoso</button>
              <button onClick={()=>goTo("ao-vivo")} style={{ flex:1, background:"rgba(255,255,255,.06)", color:"#F0F6FF", border:"1.5px solid #1E2D45", borderRadius:12, padding:12, fontSize:13, fontWeight:700, cursor:"pointer" }}>🔴 Ao Vivo</button>
            </div>
          </div>

          {/* Elenco */}
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>ELENCO ({myTeam.playerList.length}/{myTeam.totalPlayers})</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
            {myTeam.playerList.map(p => (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:7, background:"#111827", border:"1.5px solid #1E2D45", borderRadius:99, padding:"7px 12px" }}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p}&backgroundColor=0D2A18&textColor=00E96A&fontSize=36`} alt={p} style={{ width:24, height:24, borderRadius:"50%" }} />
                <span style={{ fontSize:13, fontWeight:600, color:"#F0F6FF" }}>{p}</span>
              </div>
            ))}
            <div onClick={()=>toast("➕ Convidar jogador pro time")} style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(0,233,106,.06)", border:"1.5px dashed rgba(0,233,106,.3)", borderRadius:99, padding:"7px 12px", cursor:"pointer" }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#00E96A" }}>+ Convidar</span>
            </div>
          </div>

          {/* PRO teaser */}
          <div style={{ background:"linear-gradient(135deg,#14080A,#200C12)", border:"1.5px solid rgba(255,61,90,.25)", borderRadius:16, padding:16, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ background:"linear-gradient(135deg,#FF3D5A,#FF6080)", color:"#fff", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800 }}>PRÓ</span>
              <span style={{ fontWeight:700, fontSize:14, color:"#F0F6FF" }}>Ranking Oficial</span>
            </div>
            <div style={{ fontSize:12, color:"#A8BDD4", lineHeight:1.6, marginBottom:12 }}>
              Jogos com árbitro contam pontos pro ranking oficial. Tenha estatísticas por jogador, histórico e tabela de classificação regional.
            </div>
            <button onClick={()=>toast("🚀 Plano PRÓ em breve!")} style={{ background:"rgba(255,61,90,.12)", color:"#FF3D5A", border:"1.5px solid rgba(255,61,90,.3)", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:800, cursor:"pointer" }}>
              Quero ser PRÓ →
            </button>
          </div>
        </div>
      )}

      <div style={{ height:20 }} />
    </div>
  );
}


// AO VIVO
function AoVivo({ goTo, toast }) {
  const [score, setScore]   = useState({ A:2, B:1, min:34 });
  const [feed, setFeed]     = useState([
    { t:"A", j:"Rodrigo Maia",  assist:"Diego N.",  m:28, s:"1—0", type:"gol" },
    { t:"A", j:"Diego Nunes",   assist:null,         m:31, s:"2—0", type:"gol" },
    { t:"B", j:"André Moura",   assist:"Felipe C.", m:33, s:"2—1", type:"gol" },
  ]);
  const [showGolModal, setShowGolModal] = useState(null); // "A" ou "B"
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCard, setShowCard]         = useState(false);
  const [mvpVote, setMvpVote]           = useState(null);
  const [reactions, setReactions]       = useState({ fire:12, heart:8, shock:3 });

  const teamA = ["Rodrigo","Diego","Lucas","Felipe"];
  const teamB = ["André","Gabriel","Thiago","Carlos"];
  const [scorerA, setScorerA] = useState(teamA[0]);
  const [assistA, setAssistA] = useState("");
  const [scorerB, setScorerB] = useState(teamB[0]);
  const [assistB, setAssistB] = useState("");

  const confirmGol = (team) => {
    const ns = {...score, [team]: score[team]+1, min: score.min+1};
    setScore(ns);
    const scorer = team==="A" ? scorerA : scorerB;
    const assist = team==="A" ? assistA : assistB;
    setFeed(f => [{
      t: team, j: scorer + " " + (team==="A"?"Maia":"Moura"),
      assist: assist || null, m: ns.min,
      s: `${ns.A}—${ns.B}`, type:"gol"
    }, ...f]);
    setShowGolModal(null);
    toast(`⚽ GOL! ${team==="A"?"Time A":"Time B"} ${ns.A}—${ns.B}`);
  };

  const addCard = (type, player) => {
    setFeed(f => [{
      t:"card", j: player, m: score.min+1,
      s: `${score.A}—${score.B}`,
      type: type
    }, ...f]);
    setShowCard(false);
    toast(`${type==="yellow"?"🟨":"🟥"} Cartão pra ${player}!`);
  };

  const react = (key) => {
    setReactions(r => ({...r, [key]: r[key]+1}));
  };

  const teamColors = { A:"#EF4444", B:"#3B82F6" };
  const teamEmojis = { A:"🔴", B:"🔵" };

  // ── MODAL GOL
  if (showGolModal) {
    const team = showGolModal;
    const players = team==="A" ? teamA : teamB;
    const scorer  = team==="A" ? scorerA : scorerB;
    const setScorer = team==="A" ? setScorerA : setScorerB;
    const assist  = team==="A" ? assistA : assistB;
    const setAssist = team==="A" ? setAssistA : setAssistB;
    const color = teamColors[team];
    return (
      <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))", padding:"max(52px,env(safe-area-inset-top)) 20px 32px" }}>
        <button onClick={()=>setShowGolModal(null)} style={{ background:"none", border:"none", color:"#A8BDD4", fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:20 }}>← Cancelar</button>
        <div style={{ fontSize:36, textAlign:"center", marginBottom:8 }}>⚽</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, fontWeight:700, color:color, textAlign:"center", marginBottom:4 }}>GOL DO TIME {team}!</div>
        <div style={{ fontSize:14, color:"#A8BDD4", textAlign:"center", marginBottom:24 }}>Quem marcou?</div>

        <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>Goleador</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {players.map(p => (
            <div key={p} onClick={()=>setScorer(p)} style={{ background:scorer===p?`${color}18`:"#111827", border:`1.5px solid ${scorer===p?color:"#1E2D45"}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .18s" }}>
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p}&backgroundColor=111827&textColor=${color.replace("#","")}&fontSize=36`} alt={p} style={{ width:36, height:36, borderRadius:"50%" }} />
              <span style={{ fontWeight:700, fontSize:14, color:scorer===p?color:"#F0F6FF" }}>{p}</span>
              {scorer===p && <span style={{ marginLeft:"auto", color:color, fontSize:16 }}>✓</span>}
            </div>
          ))}
        </div>

        <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>Assistência (opcional)</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
          {[...players, "Sem assistência"].map(p => (
            <div key={p} onClick={()=>setAssist(p==="Sem assistência"?"":p)} style={{ background:assist===(p==="Sem assistência"?"":p)?`${color}18`:"#111827", border:`1.5px solid ${assist===(p==="Sem assistência"?"":p)?color:"#1E2D45"}`, borderRadius:12, padding:"10px 12px", cursor:"pointer", transition:"all .18s" }}>
              <span style={{ fontWeight:700, fontSize:13, color:assist===(p==="Sem assistência"?"":p)?color:"#A8BDD4" }}>{p}</span>
            </div>
          ))}
        </div>

        <button onClick={()=>confirmGol(team)} style={{ width:"100%", background:color, color:"#fff", border:"none", borderRadius:14, padding:15, fontSize:16, fontWeight:800, cursor:"pointer" }}>
          ✓ Confirmar Gol
        </button>
      </div>
    );
  }

  // ── MODAL ENCERRAR
  if (showEndModal) {
    const all = [...teamA.map(p=>({n:p,t:"A"})), ...teamB.map(p=>({n:p,t:"B"}))];
    return (
      <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))", padding:"max(52px,env(safe-area-inset-top)) 20px 32px" }}>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, fontWeight:700, marginBottom:4 }}>Encerrar Partida</div>
        <div style={{ fontSize:14, color:"#A8BDD4", marginBottom:24 }}>Placar final: Time A {score.A} × {score.B} Time B</div>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>🏅 Vote no MVP</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
          {all.map(p => (
            <div key={p.n} onClick={()=>setMvpVote(p.n)} style={{ background:mvpVote===p.n?"rgba(255,215,38,.1)":"#111827", border:`1.5px solid ${mvpVote===p.n?"#FFD726":"#1E2D45"}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all .18s" }}>
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.n}&backgroundColor=111827&textColor=${p.t==="A"?"EF4444":"3B82F6"}&fontSize=36`} alt={p.n} style={{ width:34, height:34, borderRadius:"50%" }} />
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:mvpVote===p.n?"#FFD726":"#F0F6FF" }}>{p.n}</div>
                <div style={{ fontSize:10, color:"#52697F" }}>Time {p.t}</div>
              </div>
              {mvpVote===p.n && <span style={{ marginLeft:"auto", fontSize:16 }}>🏅</span>}
            </div>
          ))}
        </div>
        <button onClick={()=>{ toast("🏁 Partida encerrada! Ótimo jogo!"); goTo("ranking"); }} style={{ width:"100%", background:"#FF3D5A", color:"#fff", border:"none", borderRadius:14, padding:15, fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:10 }}>
          🏁 Encerrar e Salvar
        </button>
        <button onClick={()=>setShowEndModal(false)} style={{ width:"100%", background:"rgba(255,255,255,.05)", color:"#A8BDD4", border:"1.5px solid #1E2D45", borderRadius:14, padding:14, fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Continuar jogando
        </button>
      </div>
    );
  }

  // ── TELA PRINCIPAL AO VIVO
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#07090F" }}>

      {/* Scoreboard */}
      <div style={{ padding:"max(52px,env(safe-area-inset-top)) 20px 0", flexShrink:0 }}>
        {/* Live badge + info */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,61,90,.14)", border:"1px solid rgba(255,61,90,.4)", borderRadius:99, padding:"5px 12px", fontSize:11, fontWeight:800, color:"#FF3D5A", letterSpacing:2 }}>
            <span style={{ width:6, height:6, background:"#FF3D5A", borderRadius:"50%", animation:"pulse 1s infinite", display:"inline-block" }} />
            AO VIVO
          </div>
          <div style={{ fontSize:12, color:"#52697F", fontWeight:600 }}>Pelada do Xaxim · Sáb 17/05</div>
        </div>

        {/* Placar central */}
        <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:16 }}>
          {/* Time A */}
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:4 }}>🔴</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:700, fontSize:16, color:"#EF4444", marginBottom:2 }}>Time A</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:64, fontWeight:700, color:"#EF4444", lineHeight:1 }}>{score.A}</div>
          </div>

          {/* Centro */}
          <div style={{ textAlign:"center", padding:"0 12px", flexShrink:0 }}>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, color:"#52697F", marginBottom:4 }}>×</div>
            <div style={{ background:"#162035", border:"1px solid #263650", borderRadius:10, padding:"6px 12px", marginBottom:4 }}>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:18, fontWeight:700, color:"#FFD726" }}>{score.min}'</div>
            </div>
            <div style={{ fontSize:10, color:"#52697F" }}>Society 7</div>
          </div>

          {/* Time B */}
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:4 }}>🔵</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:700, fontSize:16, color:"#3B82F6", marginBottom:2 }}>Time B</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:64, fontWeight:700, color:"#3B82F6", lineHeight:1 }}>{score.B}</div>
          </div>
        </div>

        {/* Reações dos espectadores */}
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:16 }}>
          {[["🔥",reactions.fire,"fire"],["❤️",reactions.heart,"heart"],["😱",reactions.shock,"shock"]].map(([em,n,key])=>(
            <button key={key} onClick={()=>react(key)} style={{ background:"rgba(255,255,255,.06)", border:"1.5px solid #1E2D45", borderRadius:99, padding:"6px 14px", display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:14, fontWeight:700, color:"#A8BDD4" }}>
              {em} <span>{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botões de gol */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderTop:"1px solid #1E2D45", borderBottom:"1px solid #1E2D45", flexShrink:0 }}>
        <button onClick={()=>setShowGolModal("A")} style={{ background:"rgba(239,68,68,.08)", border:"none", borderRight:"1px solid #1E2D45", padding:"18px 16px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:28 }}>⚽</span>
          <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:700, color:"#EF4444" }}>GOL DO A</span>
          <span style={{ fontSize:11, color:"#52697F" }}>toca pra registrar</span>
        </button>
        <button onClick={()=>setShowGolModal("B")} style={{ background:"rgba(59,130,246,.08)", border:"none", padding:"18px 16px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:28 }}>⚽</span>
          <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:700, color:"#3B82F6" }}>GOL DO B</span>
          <span style={{ fontSize:11, color:"#52697F" }}>toca pra registrar</span>
        </button>
      </div>

      {/* Botão cartão */}
      <div style={{ padding:"8px 16px", borderBottom:"1px solid #1E2D45", flexShrink:0 }}>
        <button onClick={()=>{ const players=["Rodrigo","André","Lucas","Gabriel","Felipe","Diego"]; const p=players[Math.floor(Math.random()*players.length)]; const type=Math.random()>.5?"yellow":"red"; addCard(type,p); }} style={{ width:"100%", background:"rgba(255,215,38,.06)", border:"1px solid rgba(255,215,38,.2)", borderRadius:10, padding:"8px", fontSize:12, fontWeight:700, color:"#FFD726", cursor:"pointer" }}>
          🟨 Registrar Cartão
        </button>
      </div>

      {/* Feed de eventos */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>EVENTOS DA PARTIDA</div>
        {feed.map((g,i) => {
          const isCard = g.type === "yellow" || g.type === "red";
          const color  = isCard ? (g.type==="yellow"?"#FFD726":"#FF3D5A") : teamColors[g.t];
          const icon   = isCard ? (g.type==="yellow"?"🟨":"🟥") : "⚽";
          return (
            <div key={i} style={{ background: isCard?"rgba(255,215,38,.05)":g.t==="A"?"rgba(239,68,68,.07)":"rgba(59,130,246,.07)", border:`1px solid ${isCard?"rgba(255,215,38,.15)":g.t==="A"?"rgba(239,68,68,.18)":"rgba(59,130,246,.18)"}`, borderRadius:12, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:20 }}>{icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color }}>{isCard ? `Cartão — ${g.j}` : `Gol — Time ${g.t}`}</div>
                <div style={{ fontSize:11, color:"#52697F" }}>
                  {!isCard && g.j}{g.assist && ` (assist: ${g.assist})`} · {g.m}'
                </div>
              </div>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:18, fontWeight:700, color:"#52697F" }}>{g.s}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding:"10px 16px max(20px,env(safe-area-inset-bottom))", display:"flex", gap:8, borderTop:"1px solid #1E2D45", flexShrink:0 }}>
        <button onClick={()=>goTo("times")} style={{ flex:1, background:"rgba(255,255,255,.05)", color:"#A8BDD4", border:"1.5px solid #1E2D45", borderRadius:14, padding:12, fontSize:13, fontWeight:700, cursor:"pointer" }}>← Voltar</button>
        <button onClick={()=>setShowEndModal(true)} style={{ flex:2, background:"#FF3D5A", color:"#fff", border:"none", borderRadius:14, padding:12, fontSize:14, fontWeight:800, cursor:"pointer" }}>🏁 Encerrar Partida</button>
      </div>
    </div>
  );
}


// RANKING
function Ranking({ goTo, toast }) {
  const [tab, setTab] = useState("mensal");
  const sorted = tab==="artilheiros" ? [...RANK].sort((a,b)=>b.g-a.g) : tab==="presenca" ? [...RANK].sort((a,b)=>b.pr-a.pr) : RANK;
  const tabs = [["mensal","📅 Mensal"],["anual","🏆 Anual"],["artilheiros","⚽ Artilheiros"],["presenca","📋 Presença"]];
  return (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 0 0" }}>
      <div style={{ padding:"0 20px 14px" }}>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:26, marginBottom:14 }}>🏅 Ranking</div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2, scrollbarWidth:"none" }}>
          {tabs.map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{ flexShrink:0, background:tab===id?C.grn:C.s2, color:tab===id?C.bg:C.t2, border:`1.5px solid ${tab===id?C.grn:C.b1}`, borderRadius:99, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{ margin:"0 20px 16px", background:`linear-gradient(135deg,${tab==="anual"?"#180A08,#281410":"#0A1808,#122210"})`, border:`1.5px solid rgba(${tab==="anual"?"255,215,38":"0,233,106"},.18)`, borderRadius:15, padding:"13px 15px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, color:C.t3, textTransform:"uppercase" }}>{tab==="anual"?"Temporada":"Período"}</div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:20, color:tab==="anual"?C.yel:C.grn }}>{tab==="anual"?"2025":"Maio 2025"}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:C.t3 }}>{tab==="anual"?"Nunca zera":"Zera em"}</div>
          <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:20, color:tab==="anual"?C.grn:C.yel }}>{tab==="anual"?"📚":"17 dias"}</div>
        </div>
      </div>
      {/* Podium */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:12, padding:"0 20px", marginBottom:18 }}>
        {[[sorted[1],"🥈",54,"silver",58],[sorted[0],"🥇",62,C.yel,78],[sorted[2],"🥉",54,"#CD7F32",42]].map(([p,medal,size,bcolor,height],i)=>(p &&
          <div key={i} style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:i===1?34:30, marginBottom:5 }}>{medal}</div>
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.n}&backgroundColor=${p.c.replace('#','')}&textColor=ffffff&fontSize=32&fontWeight=700`} alt={p.n} style={{ width:size, height:size, borderRadius:"50%", margin:"0 auto 7px", display:"block", border:`2px solid ${bcolor}`, boxShadow:i===1?`0 0 18px ${bcolor}40`:"none", objectFit:"cover" }} />
            <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{p.n.split(" ")[0]}</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:i===1?24:20, color:bcolor }}>{p.pts} pts</div>
            <div style={{ background:`${bcolor}18`, borderRadius:8, height, marginTop:5, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:i===1?26:22, color:bcolor }}>{i===0?"2°":i===1?"1°":"3°"}</div>
          </div>
        ))}
      </div>
      <SecLabel>CLASSIFICAÇÃO</SecLabel>
      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:8 }}>
        {sorted.slice(3).map((p,i)=>(
          <div key={p.i} onClick={()=>toast("🃏 Card em breve!")} style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, color:C.t3, width:28, textAlign:"center" }}>{i+4}°</div>
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.n}&backgroundColor=${p.c.replace('#','')}&textColor=ffffff&fontSize=36`} alt={p.n} style={{ width:38, height:38, borderRadius:"50%", flexShrink:0, objectFit:"cover" }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:1 }}>{p.n}</div>
              <div style={{ fontSize:11, color:C.t3 }}>{p.t} · {p.g} gols · {p.a} assist.</div>
            </div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, color:C.grn }}>{p.pts}</div>
          </div>
        ))}
      </div>
      <div style={{ margin:"14px 20px 8px", background:"rgba(0,233,106,.05)", border:"1.5px solid rgba(0,233,106,.13)", borderRadius:13, padding:13, display:"flex", gap:10 }}>
        <span style={{ fontSize:17 }}>💾</span>
        <div>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:3 }}>Dados preservados</div>
          <div style={{ fontSize:12, color:C.t2, lineHeight:1.5 }}>Mensal zera dia 1, mas vai pro histórico anual. Nunca perde uma estatística.</div>
        </div>
      </div>
    </div>
  );
}

// SEJA GOLEIRO
function SejaGoleiro({ goTo, toast }) {
  return (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 20px 24px" }}>
      <button onClick={()=>goTo("home")} style={{ background:"none", border:"none", color:C.t2, fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:16 }}>← Início</button>
      <div style={{ background:"linear-gradient(160deg,#0E1A07,#162508)", border:"1.5px solid rgba(255,215,38,.28)", borderRadius:20, padding:22, position:"relative", overflow:"hidden", marginBottom:18 }}>
        <div style={{ position:"absolute", right:-15, bottom:-15, fontSize:120, opacity:.08 }}>🥅</div>
        <div style={{ fontSize:38, marginBottom:10 }}>🥅</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:32, lineHeight:.93, marginBottom:8 }}>SEJA GOLEIRO<br/><span style={{ color:C.yel }}>DE ALUGUEL</span></div>
        <div style={{ fontSize:14, color:C.t2, lineHeight:1.6, marginBottom:16 }}>Cadastre-se, apareça nos rachas e receba pra fazer o que você ama.</div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ background:"rgba(255,215,38,.1)", border:"1px solid rgba(255,215,38,.25)", borderRadius:12, padding:12, flex:1, textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:30, color:C.yel }}>R$35</div>
            <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>você recebe / hora</div>
          </div>
          <div style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${C.b1}`, borderRadius:12, padding:12, flex:1, textAlign:"center" }}>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:30, color:C.t2 }}>R$40</div>
            <div style={{ fontSize:11, color:C.t3, marginTop:2 }}>cobrado do time</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:C.t3, marginBottom:12 }}>Quanto você ganha</div>
      <div style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:16, overflow:"hidden", marginBottom:18 }}>
        {[["1 hora","Society / Fut 5","R$ 35","R$5"],["1h30","Jogo mais longo","R$ 52","R$7"],["2 horas","Campo 11 / torneio","R$ 70","R$10"]].map(([dur,sub,val,fee])=>(
          <div key={dur} style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.b1}` }}>
            <div><div style={{ fontSize:13, fontWeight:700 }}>{dur}</div><div style={{ fontSize:11, color:C.t3 }}>{sub}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:800, color:C.yel }}>{val}</div><div style={{ fontSize:10, color:C.t3 }}>racha.app: {fee}</div></div>
          </div>
        ))}
      </div>
      <Btn variant="yel" onClick={()=>toast("🥅 Cadastro em breve!")}>Quero ser Goleiro de Aluguel →</Btn>
    </div>
  );
}

// SEJA ÁRBITRO
function SejaArbitro({ goTo, toast }) {
  const sections = [
    { color:C.blu, title:"⚡ FUT 5 · SOCIETY · FUTSAL", rows:[["1 Árbitro central","1 hora","R$ 80","R$10"],["1 Árbitro central","1h30","R$ 110","R$15"]] },
    { color:C.grn, title:"🌿 CAMPO 11", rows:[["Árbitro central","Principal","R$ 100","R$15"],["+ 1 Bandeirinha","Assistente","+ R$ 60","R$8"],["Kit completo","Central + 2 band.","R$ 220","R$31"]] },
    { color:C.yel, title:"🏆 CAMPEONATO", rows:[["Por rodada","4 jogos/dia","R$ 280","R$40"],["Dia inteiro","8+ jogos","R$ 500","R$70"]] },
  ];
  return (
    <div style={{ padding:"max(52px,env(safe-area-inset-top)) 20px 24px" }}>
      <button onClick={()=>goTo("home")} style={{ background:"none", border:"none", color:C.t2, fontSize:14, fontWeight:600, cursor:"pointer", marginBottom:16 }}>← Início</button>
      <div style={{ background:"linear-gradient(160deg,#080D18,#0C1422)", border:"1.5px solid rgba(43,143,255,.28)", borderRadius:20, padding:22, marginBottom:18 }}>
        <div style={{ fontSize:38, marginBottom:10 }}>📋</div>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:32, lineHeight:.93, marginBottom:8 }}>SEJA<br/><span style={{ color:C.blu }}>ÁRBITRO</span></div>
        <div style={{ fontSize:14, color:C.t2 }}>Apite rachas e campeonatos. Você define disponibilidade.</div>
      </div>
      {sections.map(s=>(
        <div key={s.title} style={{ background:C.s2, border:`1.5px solid ${C.b1}`, borderRadius:16, overflow:"hidden", marginBottom:10 }}>
          <div style={{ padding:"10px 16px", fontSize:12, fontWeight:800, letterSpacing:.5, color:s.color, borderBottom:`1px solid ${s.color}20`, background:`${s.color}0A` }}>{s.title}</div>
          {s.rows.map(([n,sub,val,fee])=>(
            <div key={n} style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.b1}` }}>
              <div><div style={{ fontSize:13, fontWeight:700 }}>{n}</div><div style={{ fontSize:11, color:C.t3 }}>{sub}</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:800, color:s.color }}>{val}</div><div style={{ fontSize:10, color:C.t3 }}>racha.app: {fee}</div></div>
            </div>
          ))}
        </div>
      ))}
      <Btn variant="blue" onClick={()=>toast("📋 Cadastro em breve!")}>Quero ser Árbitro →</Btn>
    </div>
  );
}

// PERFIL
function Perfil({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("stats");

  const stats = {
    jogos: 47, organizou: 12, gols: 23, assists: 11,
    presenca: 87, mvps: 5, cartoes: 3,
    notaJogador: 4.8, notaOrganizador: 4.6,
    avaliacoesJ: 34, avaliacoesO: 12,
  };

  const historico = [
    { nome:"Pelada do Xaxim", data:"Sáb 17/05", gols:2, assists:1, nota:"⭐⭐⭐⭐⭐", resultado:"W" },
    { nome:"Racha do Portão", data:"Sex 09/05", gols:1, assists:0, nota:"⭐⭐⭐⭐", resultado:"D" },
    { nome:"Pelada CIC",       data:"Sáb 03/05", gols:0, assists:2, nota:"⭐⭐⭐⭐⭐", resultado:"W" },
    { nome:"Pelada do Xaxim", data:"Sáb 26/04", gols:3, assists:1, nota:"⭐⭐⭐⭐⭐", resultado:"W" },
    { nome:"Racha Domingo",   data:"Dom 20/04", gols:0, assists:0, nota:"⭐⭐⭐",     resultado:"L" },
  ];

  const StarBar = ({ label, value, reviews, color="#00E96A", context }) => (
    <div style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:"16px 18px", flex:1 }}>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:8 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:6 }}>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:42, fontWeight:700, color, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:13, color:"#52697F" }}>/ 5.0</div>
      </div>
      <div style={{ display:"flex", gap:3, marginBottom:6 }}>
        {[1,2,3,4,5].map(s => (
          <div key={s} style={{ flex:1, height:4, borderRadius:99, background: s <= Math.round(value) ? color : "#1E2D45" }} />
        ))}
      </div>
      <div style={{ fontSize:11, color:"#52697F" }}>{reviews} avaliações{context ? ` · ${context}` : ""}</div>
    </div>
  );

  return (
    <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))" }}>

      {/* ── HERO DO PERFIL ── */}
      <div style={{ background:"linear-gradient(170deg,#0A1020,#111827)", borderBottom:"1px solid #1E2D45", padding:"20px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ position:"relative" }}>
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user}&backgroundColor=0D2A18&textColor=00E96A&fontSize=38&fontWeight=700`}
              alt={user}
              style={{ width:72, height:72, borderRadius:"50%", border:"2px solid #00E96A", display:"block" }}
            />
            <div style={{ position:"absolute", bottom:2, right:2, width:18, height:18, borderRadius:"50%", background:"#00E96A", border:"2px solid #0A1020", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>✓</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:26, fontWeight:700, color:"#F0F6FF", lineHeight:1, marginBottom:3 }}>{user}</div>
            <div style={{ fontSize:12, color:"#52697F", marginBottom:6 }}>Membro desde Jan 2025 · Curitiba, PR</div>
            <div style={{ display:"flex", gap:6 }}>
              <span style={{ background:"rgba(0,233,106,.12)", color:"#00E96A", border:"1px solid rgba(0,233,106,.25)", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800 }}>Jogador</span>
              <span style={{ background:"rgba(43,143,255,.12)", color:"#2B8FFF", border:"1px solid rgba(43,143,255,.25)", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:800 }}>Organizador</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderTop:"1px solid #1E2D45" }}>
          {[["stats","📊 Stats"],["historico","⚽ Histórico"],["conquistas","🏆 Conquistas"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setActiveTab(id)} style={{ flex:1, background:"none", border:"none", borderBottom:`2px solid ${activeTab===id?"#00E96A":"transparent"}`, padding:"12px 0", fontSize:13, fontWeight:700, color:activeTab===id?"#00E96A":"#52697F", cursor:"pointer", transition:"all .2s" }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* ── STATS TAB ── */}
      {activeTab === "stats" && (
        <div style={{ padding:"20px 20px 0" }}>

          {/* Notas */}
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>AVALIAÇÕES</div>
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            <StarBar label="Como Jogador" value={stats.notaJogador} reviews={stats.avaliacoesJ} color="#00E96A" context="pelos times" />
            <StarBar label="Como Organizador" value={stats.notaOrganizador} reviews={stats.avaliacoesO} color="#2B8FFF" context="pelos jogadores" />
          </div>

          {/* Números grandes */}
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>NÚMEROS DA TEMPORADA</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, color:"#52697F", marginBottom:4 }}>Jogos jogados</div>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:44, fontWeight:700, color:"#F0F6FF", lineHeight:1 }}>{stats.jogos}</div>
              <div style={{ fontSize:11, color:"#52697F", marginTop:3 }}>⚽ na temporada</div>
            </div>
            <div style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:16 }}>
              <div style={{ fontSize:11, color:"#52697F", marginBottom:4 }}>Peladas organizou</div>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:44, fontWeight:700, color:"#2B8FFF", lineHeight:1 }}>{stats.organizou}</div>
              <div style={{ fontSize:11, color:"#52697F", marginTop:3 }}>📋 como organizador</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
            {[
              ["Gols",       stats.gols,     "#FFD726", "⚽"],
              ["Assistências",stats.assists,  "#00E96A",  "🅰️"],
              ["Presença",   stats.presenca+"%","#A78BFA","📋"],
              ["MVPs",       stats.mvps,     "#FF3D5A",  "🏅"],
              ["Cartões",    stats.cartoes,   "#FF6B35", "🟨"],
              ["Sem faltas", stats.jogos - Math.round(stats.jogos * 0.13), "#52697F", "✓"],
            ].map(([lbl,val,color,ico]) => (
              <div key={lbl} style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:14, padding:"12px 10px", textAlign:"center" }}>
                <div style={{ fontSize:16, marginBottom:4 }}>{ico}</div>
                <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, fontWeight:700, color, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:10, color:"#52697F", marginTop:3 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Presença visual */}
          <div style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:"#52697F", letterSpacing:2, textTransform:"uppercase" }}>Taxa de presença</div>
                <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:32, fontWeight:700, color:"#00E96A", lineHeight:1.1 }}>{stats.presenca}%</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"#52697F" }}>41 / 47 jogos</div>
                <div style={{ fontSize:11, color:"#52697F" }}>compareceu</div>
              </div>
            </div>
            <div style={{ height:8, background:"#1E2D45", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${stats.presenca}%`, background:"linear-gradient(90deg,#00B855,#00E96A)", borderRadius:99 }} />
            </div>
          </div>

          {/* Avaliação como organizador — contexto para o app */}
          <div style={{ background:"linear-gradient(135deg,#07091A,#0C1525)", border:"1.5px solid rgba(43,143,255,.25)", borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ fontSize:28, flexShrink:0 }}>📋</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:"#F0F6FF", marginBottom:4 }}>Como Organizador</div>
                <div style={{ fontSize:12, color:"#A8BDD4", lineHeight:1.6, marginBottom:10 }}>
                  O racha.app usa sua nota de organizador para destacar suas peladas nas buscas. Quanto maior a nota, mais jogadores avulsos encontram você.
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  {[["Pontualidade","⏱","4.9"],["Organização","📋","4.7"],["Comunicação","💬","4.5"]].map(([l,i,v]) => (
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:16 }}>{i}</div>
                      <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:700, color:"#2B8FFF" }}>{v}</div>
                      <div style={{ fontSize:10, color:"#52697F" }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button onClick={onLogout} style={{ width:"100%", background:"rgba(255,61,90,.08)", color:"#FF3D5A", border:"1.5px solid rgba(255,61,90,.25)", borderRadius:14, padding:14, fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:8 }}>Sair da conta</button>
        </div>
      )}

      {/* ── HISTÓRICO TAB ── */}
      {activeTab === "historico" && (
        <div style={{ padding:"20px 20px 0" }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:12 }}>ÚLTIMOS JOGOS</div>
          {historico.map((j,i) => (
            <div key={i} style={{ background:"#111827", border:"1.5px solid #1E2D45", borderRadius:16, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:j.resultado==="W"?"rgba(0,233,106,.12)":j.resultado==="D"?"rgba(255,215,38,.12)":"rgba(255,61,90,.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:18, fontWeight:700, color:j.resultado==="W"?"#00E96A":j.resultado==="D"?"#FFD726":"#FF3D5A" }}>{j.resultado}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:"#F0F6FF", marginBottom:2 }}>{j.nome}</div>
                <div style={{ fontSize:11, color:"#52697F" }}>{j.data}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ display:"flex", gap:10, marginBottom:3 }}>
                  <span style={{ fontSize:12, color:"#FFD726", fontWeight:700 }}>⚽ {j.gols}</span>
                  <span style={{ fontSize:12, color:"#00E96A", fontWeight:700 }}>🅰️ {j.assists}</span>
                </div>
                <div style={{ fontSize:11 }}>{j.nota}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CONQUISTAS TAB ── */}
      {activeTab === "conquistas" && (
        <div style={{ padding:"20px 20px 0" }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:12 }}>CONQUISTADAS</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {[
              ["🎯","Hat-trick","Marcou 3 gols num jogo","#FFD726",true],
              ["👑","Organizador Ouro","10+ peladas organizadas","#FFD726",true],
              ["⚽","Artilheiro do Mês","Maio 2025","#00E96A",true],
              ["📋","Presença VIP","90%+ de presença","#2B8FFF",true],
              ["🏆","Campeão","Venceu uma Copa","#FF3D5A",false],
              ["🌟","MVP Consecutivo","3 MVPs seguidos","#A78BFA",false],
            ].map(([ico,nome,desc,color,earned]) => (
              <div key={nome} style={{ background:"#111827", border:`1.5px solid ${earned?color+"40":"#1E2D45"}`, borderRadius:16, padding:16, opacity:earned?1:.45 }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{ico}</div>
                <div style={{ fontWeight:700, fontSize:14, color:earned?color:"#52697F", marginBottom:3 }}>{nome}</div>
                <div style={{ fontSize:11, color:"#52697F", lineHeight:1.4 }}>{desc}</div>
                {!earned && <div style={{ fontSize:10, color:"#263650", marginTop:6, fontWeight:700 }}>🔒 Bloqueado</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height:20 }} />
    </div>
  );
}


// ─── BOTTOM NAV ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"home",    ico:"🏠", lbl:"Início" },
  { id:"times",   ico:"👕", lbl:"Times" },
  { id:"_fab",    ico:"⚽", lbl:"" },
  { id:"quadras", ico:"🏟", lbl:"Quadras" },
  { id:"perfil",  ico:"👤", lbl:"Perfil" },
];

const NO_NAV = new Set(["login","pay-landing","pay-pix","pay-card","pay-success","wiz1","wiz2","wiz3","wiz4","wiz5","seja-goleiro","seja-arbitro","ao-vivo"]);

// QUADRAS SCREEN
function Quadras({ goTo, toast }) {
  const [_s] = useState(0); // hook registered
  const [selected, setSelected] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterDay, setFilterDay] = useState("Todos");
  const days = ["Todos","Sex 16","Sáb 17","Dom 18"];

  if (selected) {
    const v = VENUES.find(x=>x.id===selected);
    const slots = filterDay==="Todos" ? v.slots : v.slots.filter(s=>s.day===filterDay.split(" ")[0]&&s.date.startsWith(filterDay.split(" ")[1]));
    return (
      <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))" }}>
        <div style={{ padding:"0 20px 16px" }}>
          <button onClick={()=>{setSelected(null);setSelectedSlot(null);}} style={{ background:"none",border:"none",color:"#A8BDD4",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:14 }}>← Quadras</button>
          <div style={{ background:"linear-gradient(160deg,#0A1010,#0D1C18)", border:"2px solid #1E2D45", borderRadius:18, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>{v.cover}</div>
            <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:24, color:"#F0F6FF", marginBottom:3 }}>{v.name}</div>
            <div style={{ fontSize:13, color:"#A8BDD4", marginBottom:10 }}>📍 {v.area}</div>
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              {v.sports.map(s=><span key={s} style={{ background:"#1E2D45", borderRadius:8, padding:"4px 10px", fontSize:12, color:"#A8BDD4" }}>{s}</span>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div>
                <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:28, fontWeight:800, color:"#00E96A" }}>R${v.price}</div>
                <div style={{ fontSize:11, color:"#52697F" }}>por hora</div>
              </div>
              <div style={{ height:32, width:1, background:"#1E2D45" }} />
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ color:"#FFD726" }}>★</span><b>{v.rating}</b></div>
                <div style={{ fontSize:11, color:"#52697F" }}>{v.reviews} avaliações</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>Horários disponíveis</div>
          <div style={{ display:"flex", gap:8, marginBottom:14, overflowX:"auto", scrollbarWidth:"none" }}>
            {days.map(d=>(
              <button key={d} onClick={()=>setFilterDay(d)} style={{ flexShrink:0, background:filterDay===d?"rgba(0,233,106,.12)":"#111827", border:`1.5px solid ${filterDay===d?"#00E96A":"#1E2D45"}`, color:filterDay===d?"#00E96A":"#A8BDD4", borderRadius:99, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{d}</button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
            {slots.map((s,i)=>(
              <div key={i} onClick={()=>s.available&&setSelectedSlot(s)} style={{ background:!s.available?"rgba(255,255,255,.03)":selectedSlot===s?"rgba(0,233,106,.1)":"#111827", border:`1.5px solid ${!s.available?"#1E2D45":selectedSlot===s?"#00E96A":"#263650"}`, borderRadius:12, padding:"12px 8px", textAlign:"center", cursor:s.available?"pointer":"not-allowed", opacity:s.available?1:.5, transition:"all .18s" }}>
                <div style={{ fontSize:10, fontWeight:800, color:selectedSlot===s?"#00E96A":"#52697F", marginBottom:4 }}>{s.day} {s.date}</div>
                <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:18, fontWeight:800, color:s.available?(selectedSlot===s?"#00E96A":"#F0F6FF"):"#52697F" }}>{s.time}</div>
                <div style={{ fontSize:10, color:s.available?"#00E96A":"#52697F", marginTop:3 }}>{s.available?"Disponível":"Ocupado"}</div>
              </div>
            ))}
          </div>

          {selectedSlot && v.rentals && v.rentals.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#52697F", marginBottom:10 }}>🎒 ALUGAR DA QUADRA (opcional)</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {v.rentals.map(r => (
                  <div key={r.id} onClick={()=>setSelectedSlot(s=>s&&{...s, rentals:{...s.rentals,[r.id]:!s.rentals?.[r.id]}||(s.rentals||{})})} style={{ background:"#111827", border:`1.5px solid ${(selectedSlot.rentals||{})[r.id]?"#00E96A":"#1E2D45"}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"border-color .18s" }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:(selectedSlot.rentals||{})[r.id]?"rgba(0,233,106,.1)":"#162035", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{r.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:"#F0F6FF", marginBottom:2 }}>{r.name}</div>
                      <div style={{ fontSize:11, color:"#52697F" }}>{r.sizes ? `Tam: ${r.sizes} · ` : ""}{r.stock} disponíveis</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:20, fontWeight:800, color:(selectedSlot.rentals||{})[r.id]?"#00E96A":"#FFD726" }}>R${r.price}</div>
                      <div style={{ fontSize:10, color:"#52697F" }}>{r.unit}</div>
                    </div>
                    <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${(selectedSlot.rentals||{})[r.id]?"#00E96A":"#263650"}`, background:(selectedSlot.rentals||{})[r.id]?"#00E96A":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {(selectedSlot.rentals||{})[r.id] && <span style={{ color:"#07090F", fontSize:13, fontWeight:900 }}>✓</span>}
                    </div>
                  </div>
                ))}
                <div style={{ fontSize:11, color:"#52697F", textAlign:"center", lineHeight:1.5 }}>racha.app retém 20% do aluguel · restante vai pra quadra</div>
              </div>
            </div>
          )}

          {selectedSlot && (
            <div style={{ background:"linear-gradient(135deg,#091808,#0C2010)", border:"1.5px solid rgba(0,233,106,.2)", borderRadius:16, padding:16, marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#00E96A", marginBottom:10 }}>💰 Resumo da Reserva</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:"#A8BDD4" }}>Horário</span><span style={{ fontWeight:700 }}>{selectedSlot.day} {selectedSlot.date} · {selectedSlot.time}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:"#A8BDD4" }}>Custo da quadra</span><span style={{ fontWeight:700 }}>R$ {v.price},00</span></div>
              {Object.entries(selectedSlot.rentals||{}).filter(([k,v])=>v).map(([rId])=>{
                const rental = v.rentals?.find(r=>r.id===rId);
                return rental ? (
                  <div key={rId} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                    <span style={{ color:"#A8BDD4" }}>{rental.icon} {rental.name}</span>
                    <span style={{ fontWeight:700 }}>R$ {rental.price},00</span>
                  </div>
                ) : null;
              })}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:"#A8BDD4" }}>Taxa racha.app (10%)</span><span style={{ fontWeight:700, color:"#FFD726" }}>- R$ {Math.ceil(v.price*0.1)},00</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:10 }}><span style={{ color:"#A8BDD4" }}>Quadra recebe</span><span style={{ fontWeight:700, color:"#00E96A" }}>R$ {v.price - Math.ceil(v.price*0.1)},00</span></div>
              <div style={{ height:1, background:"rgba(0,233,106,.15)", marginBottom:10 }} />
              <div style={{ fontSize:12, color:"#A8BDD4", lineHeight:1.5 }}>
                💡 Com 14 jogadores, cada um paga <b style={{ color:"#00E96A" }}>R$ {Math.ceil((v.price/14)*1.15)}</b> e a quadra é paga automaticamente quando a pelada for completada.
              </div>
            </div>
          )}

          <button onClick={()=>{ if(!selectedSlot){toast("⚠️ Seleciona um horário primeiro!");return;} toast(`✅ ${v.name} · ${selectedSlot.time} reservado!`); goTo("wiz1"); }} style={{ width:"100%", background:selectedSlot?"#00E96A":"#1E2D45", color:selectedSlot?"#07090F":"#52697F", border:"none", borderRadius:14, padding:15, fontSize:15, fontWeight:800, cursor:selectedSlot?"pointer":"default", transition:"all .2s" }}>
            {selectedSlot ? "Reservar e Criar Pelada →" : "Selecione um horário"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop:"max(52px,env(safe-area-inset-top))" }}>
      <div style={{ padding:"0 20px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontWeight:800, fontSize:26 }}>Quadras <span style={{ color:"#00E96A" }}>·</span> Curitiba</div>
      </div>
      <div style={{ margin:"0 20px 14px", display:"flex", alignItems:"center", gap:10, background:"#111827", border:"1.5px solid #1E2D45", borderRadius:14, padding:"12px 15px" }}>
        <span style={{ opacity:.5 }}>🔍</span>
        <input style={{ flex:1, background:"none", border:"none", fontSize:15, color:"#F0F6FF", outline:"none" }} placeholder="Buscar por bairro ou nome..." />
      </div>
      <div style={{ display:"flex", gap:8, padding:"0 20px", marginBottom:16, overflowX:"auto", scrollbarWidth:"none" }}>
        {["Todos","Society 7","Fut 5","Futsal","Campo 11"].map(f=>(
          <span key={f} style={{ flexShrink:0, background:f==="Todos"?"rgba(0,233,106,.12)":"#111827", border:`1.5px solid ${f==="Todos"?"#00E96A":"#1E2D45"}`, color:f==="Todos"?"#00E96A":"#A8BDD4", borderRadius:99, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{f}</span>
        ))}
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:3, textTransform:"uppercase", color:"#52697F", padding:"0 20px", marginBottom:12 }}>4 QUADRAS DISPONÍVEIS</div>
      {VENUES.map(v=>(
        <div key={v.id} onClick={()=>setSelected(v.id)} style={{ margin:"0 20px 12px", background:"#111827", border:"1.5px solid #1E2D45", borderRadius:18, overflow:"hidden", cursor:"pointer", transition:"border-color .18s" }}>
          <div style={{ padding:"16px 16px 12px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:52, height:52, minWidth:52, borderRadius:14, background:"rgba(0,233,106,.06)", border:"1.5px solid #1E2D45", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{v.cover}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:17, color:"#F0F6FF", marginBottom:2 }}>{v.name}</div>
                <div style={{ fontSize:12, color:"#52697F", marginBottom:6 }}>📍 {v.area}</div>
                <div style={{ display:"flex", gap:6 }}>
                  {v.sports.slice(0,2).map(s=><span key={s} style={{ background:"#1E2D45", borderRadius:6, padding:"3px 8px", fontSize:11, color:"#A8BDD4" }}>{s}</span>)}
                </div>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow Semi Condensed',sans-serif", fontSize:22, fontWeight:800, color:"#00E96A" }}>R${v.price}</div>
              <div style={{ fontSize:10, color:"#52697F" }}>/{v.priceUnit}</div>
              <div style={{ display:"flex", alignItems:"center", gap:3, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:"#FFD726",fontSize:12 }}>★</span><span style={{ fontSize:12, fontWeight:700 }}>{v.rating}</span></div>
            </div>
          </div>
          <div style={{ background:"#0C1120", borderTop:"1px solid #1E2D45", padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontSize:12, color:"#A8BDD4" }}>
              <span style={{ color:"#00E96A", fontWeight:800 }}>{v.slots.filter(s=>s.available).length}</span> horários livres essa semana
            </div>
            <span style={{ background:"rgba(0,233,106,.1)", color:"#00E96A", border:"1px solid rgba(0,233,106,.25)", borderRadius:99, padding:"5px 12px", fontSize:12, fontWeight:800 }}>Ver horários →</span>
          </div>
        </div>
      ))}
      <div style={{ margin:"8px 20px 20px", background:"rgba(255,215,38,.06)", border:"1.5px solid rgba(255,215,38,.2)", borderRadius:14, padding:14, display:"flex", gap:10 }}>
        <span style={{ fontSize:18 }}>🏟</span>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:"#FFD726", marginBottom:3 }}>É dono de uma quadra?</div>
          <div style={{ fontSize:12, color:"#A8BDD4", lineHeight:1.5, marginBottom:10 }}>Cadastre sua quadra e apareça pra milhares de organizadores em Curitiba. Pagamento garantido.</div>
          <button onClick={()=>toast("🏟 Cadastro de quadra em breve!")} style={{ background:"rgba(255,215,38,.15)", color:"#FFD726", border:"1px solid rgba(255,215,38,.3)", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:800, cursor:"pointer" }}>Cadastrar minha quadra</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const goTo = useCallback((id) => {
    setScreen(id);
    window.scrollTo?.(0,0);
  }, []);

  const handleLogin = (name) => {
    setUser(name.split(" ")[0]);
    goTo("home");
    showToast(`✅ Bem-vindo, ${name.split(" ")[0]}!`);
  };

  const screens = {
    login:        <Login onLogin={handleLogin} />,
    home:         <Home user={user} goTo={goTo} toast={showToast} />,
    wiz1:         <Wizard goTo={goTo} toast={showToast} />,
    wiz2:         <Wizard goTo={goTo} toast={showToast} />,
    wiz3:         <Wizard goTo={goTo} toast={showToast} />,
    wiz4:         <Wizard goTo={goTo} toast={showToast} />,
    wiz5:         <Wizard goTo={goTo} toast={showToast} />,
    convocar:     <Convocar goTo={goTo} toast={showToast} />,
    achar:        <Achar goTo={goTo} toast={showToast} />,
    "pay-landing":<PayLanding goTo={goTo} />,
    "pay-pix":    <PayPix goTo={goTo} toast={showToast} />,
    "pay-card":   <PayLanding goTo={goTo} />,
    "pay-success":<PaySuccess goTo={goTo} />,
    times:        <Times goTo={goTo} toast={showToast} />,
    "ao-vivo":    <AoVivo goTo={goTo} toast={showToast} />,
    ranking:      <Ranking goTo={goTo} toast={showToast} />,
    "seja-goleiro":<SejaGoleiro goTo={goTo} toast={showToast} />,
    "seja-arbitro":<SejaArbitro goTo={goTo} toast={showToast} />,
    perfil:       <Perfil user={user} onLogout={()=>{setUser("");goTo("login");}} />,
    quadras:      <Quadras goTo={goTo} toast={showToast} />,
    amistosos:    <Achar goTo={goTo} toast={showToast} />,
  };

  const activeNav = screen === "convocar" || screen === "achar" || screen === "amistosos" ? "home" : screen;

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        {/* Toast */}
        {toast && (
          <div style={{ position:"fixed", top:68, left:"50%", transform:"translateX(-50%)", background:"#122810", border:"1.5px solid #00CC55", borderRadius:14, padding:"10px 20px", fontSize:14, fontWeight:700, color:C.grn, zIndex:999, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,.5)", animation:"fadeUp .3s ease" }}>
            {toast}
          </div>
        )}

        {/* Screen */}
        <div className="screen">
          {screens[screen] || screens["home"]}
        </div>

        {/* Bottom Nav */}
        {!NO_NAV.has(screen) && (
          <div style={{ flexShrink:0, display:"flex", alignItems:"flex-end", background:"rgba(7,9,15,.97)", backdropFilter:"blur(20px)", borderTop:`1px solid ${C.b1}`, padding:"8px 0 20px", zIndex:50 }}>
            {NAV_ITEMS.map(n => {
              if (n.id === "_fab") return (
                <div key="_fab" style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center" }}>
                  <button onClick={()=>goTo("wiz1")} style={{ width:52, height:52, background:C.grn, borderRadius:"50%", border:"none", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginTop:-18, cursor:"pointer", boxShadow:`0 0 28px rgba(0,233,106,.4),0 4px 20px rgba(0,0,0,.5)`, transition:"transform .15s" }}>⚽</button>
                </div>
              );
              const isOn = activeNav === n.id;
              return (
                <button key={n.id} onClick={()=>goTo(n.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"4px 0", background:"none", border:"none" }}>
                  <span style={{ fontSize:22, lineHeight:1, filter:isOn?`drop-shadow(0 0 6px ${C.grn})`:"none", transition:"filter .2s" }}>{n.ico}</span>
                  <span style={{ fontSize:9, fontWeight:800, color:isOn?C.grn:C.t3, letterSpacing:.5, textTransform:"uppercase" }}>{n.lbl}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
