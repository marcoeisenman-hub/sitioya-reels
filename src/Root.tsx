import React from "react";
import { Composition } from "remotion";
import { ComoFunciona, TOTAL, TOTAL_H } from "./ComoFunciona";
const dur = ({ props }: { props: { voz: boolean; hombre?: boolean } }) => ({ durationInFrames: props.hombre ? TOTAL_H : TOTAL });
import { PromptsReel, PTOTAL } from "./Prompts";
import { Siguenos, SIG_FRAMES } from "./Siguenos";

export const Root: React.FC = () => (
  <>
    <Composition id="ComoFunciona" component={ComoFunciona} calculateMetadata={dur} durationInFrames={TOTAL} fps={30} width={1080} height={1920} defaultProps={{ voz: false, hombre: false }} />
    <Composition id="ComoFuncionaHombre" component={ComoFunciona} calculateMetadata={dur} durationInFrames={TOTAL_H} fps={30} width={1080} height={1920} defaultProps={{ voz: true, hombre: true }} />
    <Composition id="Prompts" component={PromptsReel} durationInFrames={PTOTAL} fps={30} width={1080} height={1920} defaultProps={{ voz: true }} />
    <Composition id="Siguenos" component={Siguenos} durationInFrames={SIG_FRAMES} fps={30} width={1080} height={1350} />
  </>
);
