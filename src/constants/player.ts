import { Type } from "typebox";

export const CORE_PLAYER_TYPE = "player" as const;

export const CORE_INITIAL_PLAYER_INTEGRITY = 16 as const;

export const CorePlayerType = Type.Literal(CORE_PLAYER_TYPE);
export type CorePlayerType = Type.Static<typeof CorePlayerType>;

export type CoreInitialPlayerIntegrity = typeof CORE_INITIAL_PLAYER_INTEGRITY;
