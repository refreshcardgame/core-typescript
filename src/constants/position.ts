export const CORE_EAST_CARDINAL = "east" as const;
export const CORE_NORTH_CARDINAL = "north" as const;
export const CORE_SOUTH_CARDINAL = "south" as const;
export const CORE_WEST_CARDINAL = "west" as const;

export const CORE_CARDINALS = [
  CORE_EAST_CARDINAL,
  CORE_NORTH_CARDINAL,
  CORE_SOUTH_CARDINAL,
  CORE_WEST_CARDINAL,
] as const;

export const CORE_AFTER_SIDE = "after" as const;
export const CORE_BEFORE_SIDE = "before" as const;

export const CORE_SIDES = [CORE_AFTER_SIDE, CORE_BEFORE_SIDE] as const;

export const CORE_DECK_ZONE = "deck" as const;
export const CORE_EXTRA_ZONE = "extra" as const;
export const CORE_FIELD_ZONE = "field" as const;
export const CORE_HAND_ZONE = "hand" as const;
export const CORE_RECYCLE_ZONE = "recycle" as const;
export const CORE_VOID_ZONE = "void" as const;

export const CORE_PLAYER_ZONES = [
  CORE_DECK_ZONE,
  CORE_EXTRA_ZONE,
  CORE_HAND_ZONE,
  CORE_RECYCLE_ZONE,
] as const;

export type CoreEastCardinal = typeof CORE_EAST_CARDINAL;
export type CoreNorthCardinal = typeof CORE_NORTH_CARDINAL;
export type CoreSouthCardinal = typeof CORE_SOUTH_CARDINAL;
export type CoreWestCardinal = typeof CORE_WEST_CARDINAL;

export type CoreCardinals = typeof CORE_CARDINALS;

export type CoreAfterSide = typeof CORE_AFTER_SIDE;
export type CoreBeforeSide = typeof CORE_BEFORE_SIDE;

export type CoreSides = typeof CORE_SIDES;

export type CoreDeckZone = typeof CORE_DECK_ZONE;
export type CoreExtraZone = typeof CORE_EXTRA_ZONE;
export type CoreFieldZone = typeof CORE_FIELD_ZONE;
export type CoreHandZone = typeof CORE_HAND_ZONE;
export type CoreRecycleZone = typeof CORE_RECYCLE_ZONE;
export type CoreVoidZone = typeof CORE_VOID_ZONE;

export type CorePlayerZones = typeof CORE_PLAYER_ZONES;
