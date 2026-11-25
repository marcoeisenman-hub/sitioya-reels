import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, shot, useFont, Logo, pop, Fx } from "./ComoFunciona";

// Post del medio (1080x1350): toda la página de SitioYa bajando en un celular + "Síguenos"
export const SIG_FRAMES = 840;
export const Siguenos: React.FC = () => {
  useFont();
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const IMG_H = 14986 * (484 / 500); const VIEW = 964;
  // baja por tramos con pausas para que se pueda leer
  const STOPS = 12; const seg = (SIG_FRAMES - 60) / STOPS; const k = Math.max(0, f - 30);
  const i = Math.min(STOPS - 1, Math.floor(k / seg)); const r = Math.min(1, ((k - i * seg) / seg) / 0.4);
  const step = (IMG_H - VIEW) / STOPS;
  const y = -(i * step + step * Easing.inOut(Easing.cubic)(Math.min(1, r)));
  const t = pop(f, fps, 0, 10); const ph = pop(f, fps, 8, 14); const end = pop(f, fps, SIG_FRAMES - 40, 9);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(700px 600px at 85% 10%, ${C.blush}, transparent 60%), radial-gradient(700px 600px at 10% 95%, ${C.mint}, transparent 60%), ${C.cream}`, fontFamily: "DM" }}>
      <div style={{ position: "absolute", left: 60, top: 70, display: "flex", gap: 14, alignItems: "center", fontWeight: 800, fontSize: 34, color: C.navy }}><Logo s={60} />Sitio<b style={{ color: C.coral }}>Ya</b></div>
      <div style={{ position: "absolute", left: 60, top: 170, width: 400, fontWeight: 900, fontSize: 92, letterSpacing: "-0.025em", lineHeight: 1, color: C.navy, transform: `translateX(${(1 - t) * -300}px)`, opacity: t }}>Síguenos<br />para <span style={{ color: C.coral }}>más</span><span style={{ fontSize: 70 }}> 👆</span></div>
      <div style={{ position: "absolute", left: 60, top: 520, width: 360, fontSize: 32, lineHeight: 1.35, fontWeight: 700, color: "#5B6680", opacity: t }}>Plantillas, precios, trabajos y tips para tu negocio. Todo en nuestra página 👉</div>
      <div style={{ position: "absolute", left: 60, top: 1130, background: C.coral, color: "#fff", fontWeight: 900, fontSize: 38, padding: "18px 30px", borderRadius: 99, transform: `scale(${0.9 + 0.1 * end + 0.04 * Math.sin(f / 6)})` }}>@sitioya.pty</div>
      <div style={{ position: "absolute", left: 60, top: 1240, fontSize: 26, fontWeight: 700, color: C.navy }}>sitioya.vercel.app</div>
      <div style={{ position: "absolute", left: 480, top: 150, width: 520, height: 1000, borderRadius: 64, background: C.dark, padding: 18, boxShadow: "0 50px 90px -30px rgba(0,0,0,.5)", transform: `translateY(${(1 - ph) * 1200}px) rotate(${(1 - ph) * 6 + 3}deg)` }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: "#fff" }}><Img src={shot("sitioya_mob")} style={{ width: "100%", transform: `translateY(${y}px)` }} /></div>
      </div>
      <Fx at={0} n="whoosh" v={0.3} /><Fx at={8} n="pop" v={0.3} /><Fx at={SIG_FRAMES - 40} n="ding" v={0.3} />
    </AbsoluteFill>
  );
};
