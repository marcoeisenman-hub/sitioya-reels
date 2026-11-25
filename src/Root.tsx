import React from "react";
import { Composition } from "remotion";
import { ComoFunciona, TOTAL } from "./ComoFunciona";

export const Root: React.FC = () => (
  <Composition
    id="ComoFunciona"
    component={ComoFunciona}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ voz: false }}
  />
);
