export const CORE_PLAYER_TYPE = "player" as const;

export const CORE_INITIAL_PLAYER_INTEGRITY = 16 as const;

export type CorePlayerType = typeof CORE_PLAYER_TYPE;

export type CoreInitialPlayerIntegrity = typeof CORE_INITIAL_PLAYER_INTEGRITY;
