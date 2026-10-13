import { Type } from "typebox";

export const CORE_RED_COLOR = "red" as const;
export const CORE_YELLOW_COLOR = "yellow" as const;
export const CORE_GREEN_COLOR = "green" as const;
export const CORE_CYAN_COLOR = "cyan" as const;
export const CORE_BLUE_COLOR = "blue" as const;
export const CORE_MAGENTA_COLOR = "magenta" as const;

export const CoreRedColor = Type.Literal(CORE_RED_COLOR);
export type CoreRedColor = Type.Static<typeof CoreRedColor>;
export const CoreYellowColor = Type.Literal(CORE_YELLOW_COLOR);
export type CoreYellowColor = Type.Static<typeof CoreYellowColor>;
export const CoreGreenColor = Type.Literal(CORE_GREEN_COLOR);
export type CoreGreenColor = Type.Static<typeof CoreGreenColor>;
export const CoreCyanColor = Type.Literal(CORE_CYAN_COLOR);
export type CoreCyanColor = Type.Static<typeof CoreCyanColor>;
export const CoreBlueColor = Type.Literal(CORE_BLUE_COLOR);
export type CoreBlueColor = Type.Static<typeof CoreBlueColor>;
export const CoreMagentaColor = Type.Literal(CORE_MAGENTA_COLOR);
export type CoreMagentaColor = Type.Static<typeof CoreMagentaColor>;

export const CoreColors = Type.Tuple([
  CoreRedColor,
  CoreYellowColor,
  CoreGreenColor,
  CoreCyanColor,
  CoreBlueColor,
  CoreMagentaColor,
]);
export type CoreColors = Type.Static<typeof CoreColors>;
