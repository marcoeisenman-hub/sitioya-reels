import React from "react";
import { Composition } from "remotion";
import { ComoFunciona, TOTAL, TOTAL_H } from "./ComoFunciona";
import { PromptsReel, PTOTAL } from "./Prompts";

export const Root: React.FC = () => (
  <>
    <Composition id="ComoFunciona" component={ComoFunciona} durationInFrames={TOTAL} fps={30} width={1080} height={1920} defaultProps={{ voz: false, hombre: false }} />
    <Composition id="ComoFuncionaHombre" component={ComoFunciona} durationInFrames={TOTAL_H} fps={30} width={1080} height={1920} defaultProps={{ voz: true, hombre: true }} />
    <Composition id="Prompts" component={PromptsReel} durationInFrames={PTOTAL} fps={30} width={1080} height={1920} defaultProps={{ voz: true }} />
  </>
);
