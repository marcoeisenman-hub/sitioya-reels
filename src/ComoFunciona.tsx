import React, { useEffect, useState } from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";

const C = { coral: "#FF6B5B", navy: "#1B2A4A", mint: "#7ED6C1", cream: "#FFF6EC", yel: "#FFD36B", blush: "#FFB4A6", dark: "#0E1626", wa: "#25D366" };
const shot = (n: string) => staticFile(`shots/${n}.jpg`);
const sfx = (n: string) => staticFile(`sfx/${n}.wav`);

// Escenas: duración en frames (30 fps) y frase (voz + subtítulos)
export const SCENES = [
  { d: 214, v: 184, t: "¿Tu negocio solo vive en Instagram? Te explicamos cómo tener tu página en 3 pasos." },
  { d: 146, v: 116, t: "Paso 1: elige una de nuestras 11 plantillas." },
  { d: 156, v: 126, t: "Cada una se ve perfecta en el celular, con botón de WhatsApp." },
  { d: 173, v: 143, t: "Paso 2: escríbenos y te decimos el precio y cuándo está lista." },
  { d: 162, v: 132, t: "Hazla tú desde $19, o te la hacemos desde $69." },
  { d: 159, v: 129, t: "Paso 3: comparte tu link en tu bio, en WhatsApp y en Google." },
  { d: 190, v: 160, t: "SitioYa. Tu negocio en internet, ya. Link en la bio 👆" },
];
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0);

const useFont = () => {
  const [h] = useState(() => delayRender("fuente"));
  useEffect(() => {
    const f = new FontFace("DM", `url(${staticFile("DMSans.ttf")})`);
    f.load().then((ff) => { document.fonts.add(ff); continueRender(h); });
  }, [h]);
};

const Logo: React.FC<{ s?: number }> = ({ s = 84 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><rect width="100" height="100" rx="26" fill={C.coral} /><rect x="16" y="20" width="60" height="47" rx="7" fill={C.cream} stroke={C.navy} strokeWidth="6" /><path d="M16 33H76" stroke={C.navy} strokeWidth="6" /><path d="M25 44.5H45M25 56H37" stroke={C.navy} strokeWidth="6" strokeLinecap="round" /><path d="M54 46L54 84L63.5 74.5L70 88L76.5 85L70 71.5L83.5 71.5Z" fill={C.navy} stroke={C.coral} strokeWidth="9" strokeLinejoin="round" paintOrder="stroke" /></svg>
);

const pop = (frame: number, fps: number, delay = 0, damping = 11) => spring({ frame: frame - delay, fps, config: { damping, stiffness: 160 } });

// Subtítulos tipo karaoke: aparecen palabra por palabra
const Subs: React.FC<{ text: string; dur: number; dark?: boolean }> = ({ text, dur, dark }) => {
  const sc = SCENES.find((x) => x.t === text);
  const vd = sc ? sc.v : dur * 0.8;
  const f = useCurrentFrame();
  const words = text.split(" ");
  const shown = interpolate(f, [6, 6 + vd * 0.92], [0, words.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1470, textAlign: "center", fontFamily: "DM", fontWeight: 800, fontSize: 52, lineHeight: 1.45 }}>
      {words.map((w, i) => {
        const on = i < shown;
        return (
          <span key={i} style={{ display: "inline-block", margin: "0 4px", padding: "2px 10px", borderRadius: 12, background: on ? (dark ? C.navy : "#fff") : "transparent", color: on ? (dark ? C.cream : C.navy) : (dark ? "rgba(27,42,74,.35)" : "rgba(255,255,255,.45)"), transform: `scale(${on ? 1 : 0.92})` }}>{w}</span>
        );
      })}
    </div>
  );
};

const Title: React.FC<{ children: React.ReactNode; color: string; size?: number; top?: number }> = ({ children, color, size = 100, top = 120 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = pop(f, fps, 2);
  return <div style={{ position: "absolute", left: 80, right: 80, top, fontFamily: "DM", fontWeight: 900, fontSize: size, letterSpacing: "-0.045em", lineHeight: 0.98, color, transform: `translateY(${(1 - p) * 120}px) rotate(${(1 - p) * -4}deg)`, opacity: p }}>{children}</div>;
};

const Brand: React.FC<{ color: string; ya?: string }> = ({ color, ya = C.coral }) => (
  <div style={{ position: "absolute", left: 80, bottom: 70, display: "flex", alignItems: "center", gap: 16, fontFamily: "DM", fontWeight: 800, fontSize: 40, color }}><Logo s={70} />Sitio<b style={{ color: ya }}>Ya</b></div>
);

const Phone: React.FC<{ src: string; x: number; y: number; w: number; h: number; scroll?: number; delay?: number; children?: React.ReactNode }> = ({ src, x, y, w, h, scroll = 0, delay = 0, children }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, delay, 14);
  const ty = interpolate(f, [delay + 15, durationInFrames - 10], [0, -scroll], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 64, background: C.dark, padding: 18, transform: `translateY(${(1 - p) * 900}px) rotate(${(1 - p) * 8}deg)`, boxShadow: "0 50px 90px -30px rgba(0,0,0,.55)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", position: "relative", background: "#fff" }}>
        {src && <Img src={src} style={{ width: "100%", transform: `translateY(${ty}px)` }} />}
        {children}
      </div>
    </div>
  );
};

const Laptop: React.FC<{ src: string; x: number; y: number; w: number; delay?: number; zoom?: boolean }> = ({ src, x, y, w, delay = 0, zoom = true }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const p = pop(f, fps, delay, 14);
  const z = zoom ? interpolate(f, [0, durationInFrames], [1, 1.08]) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
      <div style={{ background: C.dark, borderRadius: 26, padding: "16px 16px 0" }}>
        <div style={{ display: "flex", gap: 9, height: 28, alignItems: "center", paddingLeft: 6 }}>{[C.coral, C.yel, C.mint].map((c) => <i key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}</div>
        <div style={{ overflow: "hidden", borderRadius: "10px 10px 0 0", aspectRatio: "16/10" }}><Img src={src} style={{ width: "100%", transform: `scale(${z})`, transformOrigin: "top center" }} /></div>
      </div>
      <div style={{ height: 30, margin: "0 -40px", background: "#2a3b60", borderRadius: "0 0 26px 26px" }} />
    </div>
  );
};

const Whoosh: React.FC = () => <Audio src={sfx("whoosh")} volume={0.3} />;
const Fx: React.FC<{ at: number; n: string; v?: number }> = ({ at, n, v = 0.4 }) => <Sequence from={at} layout="none"><Audio src={sfx(n)} volume={v} /></Sequence>;

/* ---------- Escenas ---------- */
const S1: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const words = ["Tu", "página", "en", "3", "pasos", "🚀"];
  return (
    <AbsoluteFill style={{ background: C.coral }}>
      <div style={{ position: "absolute", left: 80, top: 260, transform: `scale(${pop(f, fps, 0)}) rotate(${(1 - pop(f, fps, 0)) * -90}deg)` }}><Logo s={120} /></div>
      <div style={{ position: "absolute", left: 80, right: 60, top: 470, fontFamily: "DM", fontWeight: 900, fontSize: 190, letterSpacing: "-0.05em", lineHeight: 0.95, color: C.cream }}>
        {words.map((w, i) => {
          const p = pop(f, fps, 8 + i * 6, 9);
          const big = w === "3";
          return <span key={i} style={{ display: "inline-block", marginRight: 30, color: big || w === "pasos" ? C.navy : C.cream, transform: `translateY(${(1 - p) * 140}px) scale(${big ? 1 + 0.25 * Math.max(0, Math.sin((f - 50) / 6)) * (f > 50 && f < 80 ? 1 : 0) : 1})`, opacity: p }}>{w}</span>;
        })}
      </div>
      <Subs text={SCENES[0].t} dur={d} />
      <Brand color={C.cream} ya={C.navy} />
      {words.map((_, i) => <Fx key={i} at={8 + i * 6} n="pop" v={0.22} />)}
    </AbsoluteFill>
  );
};

const S2: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const tpl = ["panaderia", "barberia", "tienda", "reposteria", "gimnasio", "restaurante"];
  const pick = 1; const clickAt = 62;
  const cx = interpolate(f, [30, clickAt], [900, 770], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const cy = interpolate(f, [30, clickAt], [1400, 515], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grow = spring({ frame: f - clickAt - 4, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <Title color={C.cream}>1 · Elige ✨</Title>
      <div style={{ position: "absolute", left: 70, right: 70, top: 380, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {tpl.map((t, i) => {
          const p = pop(f, fps, 6 + i * 4, 12);
          const chosen = i === pick;
          const pressed = chosen && f >= clickAt && f < clickAt + 5 ? 0.94 : 1;
          return <div key={t} style={{ borderRadius: 22, overflow: "hidden", border: `6px solid ${chosen && f >= clickAt ? C.coral : "transparent"}`, transform: `scale(${p * pressed})`, opacity: 1 - grow }}><Img src={shot(t)} style={{ width: "100%", display: "block" }} /></div>;
        })}
      </div>
      {grow > 0.01 && <div style={{ position: "absolute", inset: 0, opacity: grow }}><Laptop src={shot("barberia")} x={60} y={480} w={960} zoom={false} /></div>}
      <svg width="70" height="90" viewBox="0 0 24 30" style={{ position: "absolute", left: cx, top: cy, opacity: f < clickAt + 20 ? 1 : 0, transform: `scale(${f >= clickAt && f < clickAt + 5 ? 0.85 : 1})` }}><path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      <Subs text={SCENES[1].t} dur={d} />
      <Brand color={C.cream} />
      {tpl.map((_, i) => <Fx key={i} at={6 + i * 4} n="tick" v={0.2} />)}
      <Fx at={clickAt} n="click" v={0.55} />
    </AbsoluteFill>
  );
};

const S3: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.12 * Math.max(0, Math.sin(f / 5));
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      <Title color={C.navy} size={88}>Lista para el celular 📱</Title>
      <Phone src={shot("panaderia_full")} x={250} y={330} w={580} h={1060} scroll={470} delay={2}>
        <div style={{ position: "absolute", right: 22, bottom: 26, background: C.wa, color: "#fff", fontFamily: "DM", fontWeight: 800, fontSize: 30, padding: "14px 24px", borderRadius: 99, transform: `scale(${f > 40 ? pulse : 0})`, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>💬 WhatsApp</div>
      </Phone>
      <Subs text={SCENES[2].t} dur={d} />
      <Brand color={C.navy} />
      <Fx at={42} n="pop" v={0.35} />
    </AbsoluteFill>
  );
};

const S4: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const msgs: [boolean, string][] = [
    [false, "Hola! Quiero la plantilla de panadería 🥐"],
    [true, "¡Claro! Te la dejamos lista en 2 días por $69 🙌"],
    [false, "¿Qué necesitan?"],
    [true, "Tus fotos, tu menú y tu horario 📸"],
    [false, "¡Perfecto, ya se los mando! 🔥"],
  ];
  const at = (i: number) => 14 + i * 24;
  return (
    <AbsoluteFill style={{ background: C.yel }}>
      <Title color={C.navy}>2 · Escríbenos 💬</Title>
      <Phone src="" x={230} y={330} w={620} h={1060} delay={0}>
        <div style={{ position: "absolute", inset: 0, background: "#E9E2D9", fontFamily: "DM" }}>
          <div style={{ background: "#1B7F5B", color: "#fff", padding: "54px 28px 22px", fontSize: 32, fontWeight: 800, display: "flex", gap: 14, alignItems: "center" }}><Logo s={50} />SitioYa <span style={{ fontSize: 22, fontWeight: 500, opacity: 0.8 }}>en línea</span></div>
          {msgs.map(([me, m], i) => {
            const p = pop(f, fps, at(i), 12);
            return <div key={i} style={{ maxWidth: 440, margin: me ? "18px 22px 0 auto" : "18px auto 0 22px", width: "fit-content", background: me ? "#D3F5C8" : "#fff", color: C.navy, fontSize: 30, lineHeight: 1.32, padding: "16px 22px", borderRadius: 24, borderTopLeftRadius: me ? 24 : 6, borderTopRightRadius: me ? 6 : 24, transform: `scale(${p}) translateX(${(1 - p) * (me ? 80 : -80)}px)`, transformOrigin: me ? "right top" : "left top", opacity: p, boxShadow: "0 2px 0 rgba(0,0,0,.08)" }}>{m}</div>;
          })}
        </div>
      </Phone>
      <Subs text={SCENES[3].t} dur={d} dark />
      <Brand color={C.navy} />
      {msgs.map(([me], i) => <Fx key={i} at={at(i)} n={me ? "send" : "notif"} v={me ? 0.3 : 0.45} />)}
    </AbsoluteFill>
  );
};

const S5: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = pop(f, fps, 10, 8); const b = pop(f, fps, 48, 7);
  const card = (p: number, bg: string, fg: string, k: string, price: string, txt: string, rot: number): React.ReactNode => (
    <div style={{ background: bg, color: fg, borderRadius: 44, padding: "40px 48px", fontFamily: "DM", transform: `scale(${p}) rotate(${(1 - p) * rot}deg)`, boxShadow: "0 30px 60px -25px rgba(0,0,0,.35)" }}>
      <div style={{ fontWeight: 800, letterSpacing: ".14em", fontSize: 26, color: k }}>{txt.split("|")[0]}</div>
      <div style={{ fontWeight: 900, fontSize: 190, letterSpacing: "-0.05em", lineHeight: 1 }}>{price}</div>
      <div style={{ fontSize: 36, fontWeight: 700, opacity: 0.8 }}>{txt.split("|")[1]}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.blush }}>
      <Title color={C.navy}>¿Cuánto cuesta? 💸</Title>
      <div style={{ position: "absolute", left: 80, right: 80, top: 360, display: "grid", gap: 40 }}>
        {card(a, "#fff", C.navy, "#E2503F", "$19", "HAZLA TÚ|La plantilla + una guía", -12)}
        {card(b, C.navy, C.cream, C.mint, "$69", "TE LA HACEMOS|Lista en 2 días 🚀", 12)}
      </div>
      <Subs text={SCENES[4].t} dur={d} dark />
      <Brand color={C.navy} />
      <Fx at={10} n="pop" v={0.4} /><Fx at={48} n="pop" v={0.45} /><Fx at={52} n="ding" v={0.25} />
    </AbsoluteFill>
  );
};

const S6: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const dest = [["📸", "Tu bio"], ["💬", "WhatsApp"], ["🔎", "Google"]];
  return (
    <AbsoluteFill style={{ background: C.coral }}>
      <Title color={C.cream}>3 · Comparte 🔗</Title>
      <Phone src={shot("tienda_full")} x={110} y={330} w={500} h={920} scroll={450} delay={0}>
        <div style={{ position: "absolute", left: 16, right: 16, top: 14, background: "#fff", borderRadius: 99, padding: "10px 18px", fontFamily: "DM", fontWeight: 800, fontSize: 24, color: C.navy, boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}>🔒 tunegocio.com</div>
      </Phone>
      <div style={{ position: "absolute", left: 660, top: 420, display: "grid", gap: 40 }}>
        {dest.map(([e, l], i) => {
          const p = pop(f, fps, 30 + i * 16, 9);
          return <div key={l} style={{ display: "flex", alignItems: "center", gap: 18, transform: `scale(${p}) translateX(${(1 - p) * 200}px)`, opacity: p }}>
            <div style={{ width: 120, height: 120, borderRadius: 34, background: C.cream, display: "grid", placeItems: "center", fontSize: 64 }}>{e}</div>
            <div style={{ fontFamily: "DM", fontWeight: 900, fontSize: 40, color: C.cream, letterSpacing: "-0.02em" }}>{l}{f > 40 + i * 16 ? " ✅" : ""}</div>
          </div>;
        })}
      </div>
      <Subs text={SCENES[5].t} dur={d} />
      <Brand color={C.cream} ya={C.navy} />
      {dest.map((_, i) => <Fx key={i} at={30 + i * 16} n="click" v={0.4} />)}
    </AbsoluteFill>
  );
};

const S7: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const l = pop(f, fps, 0, 9); const ya = pop(f, fps, 28, 6);
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <div style={{ position: "absolute", left: 80, top: 220, transform: `scale(${l}) rotate(${(1 - l) * 180}deg)` }}><Logo s={130} /></div>
      <div style={{ position: "absolute", left: 80, right: 60, top: 420, fontFamily: "DM", fontWeight: 900, fontSize: 160, letterSpacing: "-0.05em", lineHeight: 0.95, color: C.cream, opacity: l }}>
        Tu negocio<br />en internet,<br /><span style={{ display: "inline-block", color: C.coral, transform: `scale(${0.3 + 0.7 * ya}) rotate(${(1 - ya) * -20}deg)`, transformOrigin: "left bottom" }}>ya.</span>
      </div>
      <Laptop src={shot("panaderia")} x={160} y={860} w={760} delay={12} />
      <Subs text={SCENES[6].t} dur={d} />
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 70, fontFamily: "DM", fontWeight: 800, fontSize: 44, color: C.mint }}>@sitioya.pty · sitioya.vercel.app</div>
      <Fx at={28} n="pop" v={0.4} /><Fx at={34} n="ding" v={0.3} />
    </AbsoluteFill>
  );
};

const COMPS = [S1, S2, S3, S4, S5, S6, S7];

export const ComoFunciona: React.FC<{ voz: boolean }> = ({ voz }) => {
  useFont();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      {SCENES.map((s, i) => {
        const Comp = COMPS[i]; const start = from; from += s.d;
        return (
          <Sequence key={i} from={start} durationInFrames={s.d}>
            <SceneIn><Comp d={s.d} /></SceneIn>
            {i > 0 && <Whoosh />}
            {voz && <Sequence from={6} layout="none"><Audio src={staticFile(`voz/${i}.mp3`)} volume={1} /></Sequence>}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Entrada de cada escena: se desliza desde abajo con un pequeño rebote
const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 18, stiffness: 140 } });
  return <AbsoluteFill style={{ transform: `translateY(${(1 - p) * 300}px)`, clipPath: `circle(${p * 150}% at 50% 100%)` }}>{children}</AbsoluteFill>;
};
