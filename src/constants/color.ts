export const CORE_RED_COLOR = "red" as const;
export const CORE_YELLOW_COLOR = "yellow" as const;
export const CORE_GREEN_COLOR = "green" as const;
export const CORE_CYAN_COLOR = "cyan" as const;
export const CORE_BLUE_COLOR = "blue" as const;
export const CORE_MAGENTA_COLOR = "magenta" as const;

export const CORE_COLORS = [
  CORE_RED_COLOR,
  CORE_YELLOW_COLOR,
  CORE_GREEN_COLOR,
  CORE_CYAN_COLOR,
  CORE_BLUE_COLOR,
  CORE_MAGENTA_COLOR,
] as const;

export type CoreRedColor = typeof CORE_RED_COLOR;
export type CoreYellowColor = typeof CORE_YELLOW_COLOR;
export type CoreGreenColor = typeof CORE_GREEN_COLOR;
export type CoreCyanColor = typeof CORE_CYAN_COLOR;
export type CoreBlueColor = typeof CORE_BLUE_COLOR;
export type CoreMagentaColor = typeof CORE_MAGENTA_COLOR;

export type CoreColors = typeof CORE_COLORS;
