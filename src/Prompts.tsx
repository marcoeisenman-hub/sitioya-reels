import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, shot, useFont, Logo, pop, Subs, Title, Brand, Phone, Laptop, Whoosh, Fx, SceneIn } from "./ComoFunciona";

// Reel "Comenta PÁGINA": biblioteca de plantillas + prompt + IA (voz masculina es-PA-Roberto)
const VP = [5.352, 4.872, 1.944, 3.12, 6.048, 3.456];
const T = [
  "Así hacemos páginas web en 5 minutos, con inteligencia artificial.",
  "Entras a nuestra biblioteca de plantillas y eliges la que te guste.",
  "Copias el prompt…",
  "lo pegas en tu inteligencia artificial…",
  "¡y listo! Tu página, con tu nombre, tus fotos y botón de WhatsApp.",
  "Comenta PÁGINA y te mandamos el prompt.",
];
export const PSCENES = T.map((t, i) => { const v = Math.ceil(VP[i] * 30); return { t, v, d: Math.max(i === 5 ? 170 : 105, v + 26) }; });
export const PTOTAL = PSCENES.reduce((a, s) => a + s.d, 0);

const BG = "#0B1220";
const glow = (c: string) => `radial-gradient(900px 700px at 50% 35%, ${c}55, transparent 70%), ${BG}`;
const Cursor: React.FC<{ x: number; y: number; down?: boolean }> = ({ x, y, down }) => (
  <svg width="70" height="90" viewBox="0 0 24 30" style={{ position: "absolute", left: x, top: y, transform: `scale(${down ? 0.85 : 1})` }}><path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);
const PROMPT = "Crea la página de mi negocio con la plantilla Repostería de SitioYa. Nombre: Dulce Nube. Fotos: las que te adjunto. Botón de WhatsApp: 6000-0000. Colores: rosado y crema…";

// 1 · Gancho: plantilla + IA = 🤯
const P1: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const chip = (i: number, el: React.ReactNode, label: string) => {
    const p = pop(f, fps, 34 + i * 12, 8);
    return <div style={{ display: "grid", justifyItems: "center", gap: 12, transform: `scale(${p})`, opacity: p }}>
      <div style={{ width: 170, height: 170, borderRadius: 44, background: "#fff", display: "grid", placeItems: "center", fontSize: 96, boxShadow: "0 20px 50px -10px rgba(255,107,91,.5)" }}>{el}</div>
      <div style={{ fontFamily: "DM", fontWeight: 800, fontSize: 30, color: C.cream }}>{label}</div>
    </div>;
  };
  const op = (i: number) => <div style={{ fontFamily: "DM", fontWeight: 900, fontSize: 80, color: C.cream, opacity: pop(f, fps, 40 + i * 12) }}>{i === 0 ? "+" : "="}</div>;
  return (
    <AbsoluteFill style={{ background: glow(C.coral) }}>
      <Title color={C.cream} size={98} top={150}>Páginas web en <span style={{ color: C.coral }}>5 minutos</span> con IA</Title>
      <Laptop src={shot("reposteria")} x={110} y={520} w={860} delay={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
        {chip(0, <Logo s={120} />, "Plantillas")}{op(0)}{chip(1, "✨", "Tu IA")}{op(1)}{chip(2, "🤯", "Tu página")}
      </div>
      <Subs text={T[0]} dur={d} v={v} />
      <Fx at={34} n="pop" v={0.35} /><Fx at={46} n="pop" v={0.35} /><Fx at={58} n="ding" v={0.3} />
    </AbsoluteFill>
  );
};

// 2 · Biblioteca: filas de plantillas que pasan + click en una
const P2: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const rows = [["panaderia", "barberia", "tienda", "dental"], ["reposteria", "gimnasio", "floreria", "salon"], ["restaurante", "mascotas", "inmobiliaria", "panaderia"]];
  const clickAt = 92;
  const cx = interpolate(f, [55, clickAt], [880, 430], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cy = interpolate(f, [55, clickAt], [1350, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const stop = interpolate(f, [clickAt - 20, clickAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = Math.min(f, clickAt);
  return (
    <AbsoluteFill style={{ background: glow(C.mint) }}>
      <Title color={C.cream} size={92} top={150}>Biblioteca <span style={{ color: C.mint }}>SitioYa</span> 📚</Title>
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "grid", gap: 26, transform: "perspective(1400px) rotateX(14deg)" }}>
        {rows.map((r, ri) => {
          const dir = ri % 2 ? 1 : -1; const x = -300 + dir * t * 4.2 * (1 - 0) + (ri === 1 ? -220 : 0);
          return <div key={ri} style={{ display: "flex", gap: 26, transform: `translateX(${x}px)`, opacity: pop(f, fps, ri * 5, 14) }}>
            {[...r, ...r].map((n, i) => {
              const chosen = ri === 1 && i === 1 && f >= clickAt;
              return <div key={i} style={{ flex: "none", width: 460, borderRadius: 22, overflow: "hidden", border: `6px solid ${chosen ? C.coral : "rgba(255,255,255,.08)"}`, transform: `scale(${chosen ? 1.06 : 1})` }}><Img src={shot(n)} style={{ width: "100%", display: "block" }} /></div>;
            })}
          </div>;
        })}
      </div>
      {stop < 1 && <div />}
      <Cursor x={cx} y={cy} down={f >= clickAt && f < clickAt + 5} />
      <Subs text={T[1]} dur={d} v={v} />
      <Brand color={C.cream} />
      <Fx at={clickAt} n="click" v={0.55} />
    </AbsoluteFill>
  );
};

// 3 · Copiar prompt
const P3: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const clickAt = 34; const cx = interpolate(f, [4, clickAt], [900, 250], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }); const cy = interpolate(f, [4, clickAt], [1300, 950], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const done = f >= clickAt; const toast = pop(f, fps, clickAt + 2, 10);
  return (
    <AbsoluteFill style={{ background: glow(C.yel) }}>
      <Title color={C.cream} size={110} top={150}>Copia ✂️</Title>
      <div style={{ position: "absolute", left: 80, right: 80, top: 420, background: "#141D31", border: "2px solid rgba(255,255,255,.12)", borderRadius: 36, padding: 44, fontFamily: "DM", transform: `scale(${pop(f, fps, 0, 14)})` }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", color: C.cream, fontWeight: 800, fontSize: 38 }}><Img src={shot("reposteria")} style={{ width: 150, borderRadius: 14 }} />Plantilla Repostería<span style={{ marginLeft: "auto", background: C.coral, borderRadius: 99, padding: "6px 16px", fontSize: 22 }}>PRO</span></div>
        <div style={{ marginTop: 30, background: "#0B1220", borderRadius: 22, padding: 30, color: "rgba(255,246,236,.85)", fontSize: 32, lineHeight: 1.45, fontFamily: "monospace", border: done ? `3px solid ${C.yel}` : "3px solid transparent" }}>{PROMPT}</div>
        <div style={{ marginTop: 30, display: "inline-flex", gap: 12, alignItems: "center", background: done ? C.wa : C.yel, color: C.navy, fontWeight: 900, fontSize: 36, padding: "20px 34px", borderRadius: 99 }}>{done ? "✓ ¡Copiado!" : "📋 Copiar prompt"}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", opacity: toast, transform: `translateY(${(1 - toast) * 40}px)` }}><span style={{ background: "#fff", color: C.navy, fontFamily: "DM", fontWeight: 800, fontSize: 34, padding: "14px 30px", borderRadius: 99 }}>Prompt copiado ✅</span></div>
      <Cursor x={cx} y={cy} down={f >= clickAt && f < clickAt + 5} />
      <Subs text={T[2]} dur={d} v={v} />
      <Fx at={clickAt} n="click" v={0.55} /><Fx at={clickAt + 3} n="ding" v={0.2} />
    </AbsoluteFill>
  );
};

// 4 · Pegar en la IA (chat)
const P4: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pasteAt = 14; const sendAt = 46;
  const typed = f >= pasteAt ? PROMPT : "";
  const sent = f >= sendAt; const dots = Math.floor(f / 6) % 4;
  return (
    <AbsoluteFill style={{ background: glow("#8A7CFF") }}>
      <Title color={C.cream} size={110} top={150}>Pega 🤖</Title>
      <div style={{ position: "absolute", left: 70, right: 70, top: 400, height: 960, background: "#F7F5F2", borderRadius: 40, overflow: "hidden", fontFamily: "DM", transform: `scale(${pop(f, fps, 0, 14)})` }}>
        <div style={{ padding: "26px 34px", borderBottom: "2px solid #e6e1da", fontWeight: 800, fontSize: 32, color: C.navy, display: "flex", gap: 12, alignItems: "center" }}><span style={{ fontSize: 40 }}>✨</span>Tu IA</div>
        {sent && <div style={{ margin: "30px 30px 0 auto", maxWidth: 720, background: C.navy, color: C.cream, borderRadius: 28, borderTopRightRadius: 6, padding: "22px 26px", fontSize: 28, lineHeight: 1.4, transform: `scale(${pop(f, fps, sendAt, 12)})`, transformOrigin: "right top" }}>{PROMPT}</div>}
        {sent && <div style={{ margin: "26px 30px", display: "flex", gap: 12, alignItems: "center", color: C.navy, fontSize: 30, fontWeight: 700 }}><span style={{ fontSize: 40 }}>✨</span>Creando tu página{".".repeat(dots)}</div>}
        <div style={{ position: "absolute", left: 26, right: 26, bottom: 26, background: "#fff", border: "2px solid #e6e1da", borderRadius: 26, padding: "22px 26px", fontSize: 26, lineHeight: 1.35, color: typed && !sent ? C.navy : "#9a958e", display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: 1, maxHeight: 150, overflow: "hidden" }}>{sent ? "Escribe un mensaje…" : typed || "Escribe un mensaje…"}</div>
          <div style={{ flex: "none", width: 70, height: 70, borderRadius: 35, background: typed && !sent ? C.coral : "#ddd", color: "#fff", display: "grid", placeItems: "center", fontSize: 36, transform: `scale(${f >= sendAt && f < sendAt + 5 ? 0.85 : 1})` }}>↑</div>
        </div>
      </div>
      <Subs text={T[3]} dur={d} v={v} />
      <Fx at={pasteAt} n="pop" v={0.35} /><Fx at={sendAt} n="send" v={0.4} />
    </AbsoluteFill>
  );
};

// 5 · ¡Listo! Página terminada
const P5: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const items = ["Tu nombre", "Tus fotos", "Botón de WhatsApp"];
  return (
    <AbsoluteFill style={{ background: glow(C.wa) }}>
      <Title color={C.cream} size={110} top={150}>¡Listo! 🎉</Title>
      <Laptop src={shot("reposteria_full")} x={60} y={420} w={720} delay={0} />
      <Phone src={shot("reposteria_full")} x={640} y={560} w={360} h={700} scroll={300} delay={10} />
      <div style={{ position: "absolute", left: 80, top: 1000, display: "grid", gap: 20 }}>
        {items.map((it, i) => { const p = pop(f, fps, 40 + i * 18, 9); return <div key={it} style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "DM", fontWeight: 900, fontSize: 44, color: C.cream, transform: `translateX(${(1 - p) * -200}px)`, opacity: p }}><span style={{ width: 62, height: 62, borderRadius: 31, background: C.wa, display: "grid", placeItems: "center", fontSize: 34 }}>✓</span>{it}</div>; })}
      </div>
      <Subs text={T[4]} dur={d} v={v} />
      <Brand color={C.cream} />
      {items.map((_, i) => <Fx key={i} at={40 + i * 18} n="tick" v={0.35} />)}<Fx at={4} n="ding" v={0.3} />
    </AbsoluteFill>
  );
};

// 6 · Comenta PÁGINA (comentario de Instagram que se escribe solo)
const P6: React.FC<{ d: number; v: number }> = ({ d, v }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const word = "PÁGINA"; const startT = 30; const n = Math.max(0, Math.min(word.length, Math.floor((f - startT) / 4)));
  const postAt = startT + word.length * 4 + 10; const posted = f >= postAt;
  const big = pop(f, fps, 0, 8);
  return (
    <AbsoluteFill style={{ background: glow(C.coral) }}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 230, fontFamily: "DM", fontWeight: 900, fontSize: 150, letterSpacing: "-0.05em", lineHeight: 0.95, color: C.cream, transform: `scale(${big})`, transformOrigin: "left top" }}>Comenta<br /><span style={{ color: C.coral }}>PÁGINA</span> 👇</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 760, background: "#fff", borderRadius: 36, padding: 34, fontFamily: "DM", color: C.navy, transform: `translateY(${(1 - pop(f, fps, 12, 13)) * 600}px)` }}>
        <div style={{ fontWeight: 800, fontSize: 32, marginBottom: 20 }}>Comentarios</div>
        {posted && <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 22, transform: `scale(${pop(f, fps, postAt, 10)})`, transformOrigin: "left center" }}><div style={{ width: 64, height: 64, borderRadius: 32, background: C.yel, display: "grid", placeItems: "center", fontSize: 32 }}>🙋</div><div><b style={{ fontSize: 26 }}>tu_negocio</b><div style={{ fontSize: 34, fontWeight: 800 }}>PÁGINA</div></div><div style={{ marginLeft: "auto", fontSize: 40, color: C.coral }}>♥</div></div>}
        {posted && <div style={{ display: "flex", gap: 16, alignItems: "center", marginLeft: 60, opacity: pop(f, fps, postAt + 22) }}><Logo s={56} /><div><b style={{ fontSize: 24 }}>sitioya.pty</b><div style={{ fontSize: 28 }}>¡Te lo mandamos por DM! 📩</div></div></div>}
        <div style={{ marginTop: 24, border: "2px solid #e6e1da", borderRadius: 99, padding: "18px 26px", fontSize: 32, fontWeight: 700, color: n && !posted ? C.navy : "#9a958e" }}>{posted ? "Agrega un comentario…" : n ? word.slice(0, n) + "|" : "Agrega un comentario…"}</div>
      </div>
      <Subs text={T[5]} dur={d} v={v} />
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, fontFamily: "DM", fontWeight: 800, fontSize: 44, color: C.mint }}>@sitioya.pty · sitioya.vercel.app</div>
      {word.split("").map((_, i) => <Fx key={i} at={startT + i * 4} n="tick" v={0.25} />)}
      <Fx at={postAt} n="send" v={0.4} /><Fx at={postAt + 22} n="notif" v={0.4} />
    </AbsoluteFill>
  );
};

const PCOMPS = [P1, P2, P3, P4, P5, P6];
export const PromptsReel: React.FC<{ voz: boolean }> = ({ voz }) => {
  useFont();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {PSCENES.map((s, i) => {
        const Comp = PCOMPS[i]; const start = from; from += s.d;
        return (
          <Sequence key={i} from={start} durationInFrames={s.d}>
            <SceneIn><Comp d={s.d} v={s.v} /></SceneIn>
            {i > 0 && <Whoosh />}
            {voz && <Sequence from={6} layout="none"><Audio src={staticFile(`voz/hp${i}.mp3`)} /></Sequence>}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
