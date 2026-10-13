import { Type } from "typebox";

export const CORE_EAST_CARDINAL = "east" as const;
export const CORE_NORTH_CARDINAL = "north" as const;
export const CORE_SOUTH_CARDINAL = "south" as const;
export const CORE_WEST_CARDINAL = "west" as const;

export const CORE_AFTER_SIDE = "after" as const;
export const CORE_BEFORE_SIDE = "before" as const;

export const CORE_SIDES = [CORE_AFTER_SIDE, CORE_BEFORE_SIDE] as const;

export const CORE_ZONE_GENERIC = "TZone" as const;

export const CORE_DECK_ZONE = "deck" as const;
export const CORE_EXTRA_ZONE = "extra" as const;
export const CORE_FIELD_ZONE = "field" as const;
export const CORE_HAND_ZONE = "hand" as const;
export const CORE_RECYCLE_ZONE = "recycle" as const;
export const CORE_VOID_ZONE = "void" as const;

export const CoreEastCardinal = Type.Literal(CORE_EAST_CARDINAL);
export type CoreEastCardinal = Type.Static<typeof CoreEastCardinal>;
export const CoreNorthCardinal = Type.Literal(CORE_NORTH_CARDINAL);
export type CoreNorthCardinal = Type.Static<typeof CoreNorthCardinal>;
export const CoreSouthCardinal = Type.Literal(CORE_SOUTH_CARDINAL);
export type CoreSouthCardinal = Type.Static<typeof CoreSouthCardinal>;
export const CoreWestCardinal = Type.Literal(CORE_WEST_CARDINAL);
export type CoreWestCardinal = Type.Static<typeof CoreWestCardinal>;

export const CoreCardinals = Type.Tuple([
  CoreEastCardinal,
  CoreNorthCardinal,
  CoreSouthCardinal,
  CoreWestCardinal,
]);
export type CoreCardinals = Type.Static<typeof CoreCardinals>;

export const CoreAfterSide = Type.Literal(CORE_AFTER_SIDE);
export type CoreAfterSide = Type.Static<typeof CoreAfterSide>;
export const CoreBeforeSide = Type.Literal(CORE_BEFORE_SIDE);
export type CoreBeforeSide = Type.Static<typeof CoreBeforeSide>;

export const CoreSides = Type.Tuple([CoreAfterSide, CoreBeforeSide]);
export type CoreSides = Type.Static<typeof CoreSides>;

export const CoreDeckZone = Type.Literal(CORE_DECK_ZONE);
export type CoreDeckZone = Type.Static<typeof CoreDeckZone>;
export const CoreExtraZone = Type.Literal(CORE_EXTRA_ZONE);
export type CoreExtraZone = Type.Static<typeof CoreExtraZone>;
export const CoreFieldZone = Type.Literal(CORE_FIELD_ZONE);
export type CoreFieldZone = Type.Static<typeof CoreFieldZone>;
export const CoreHandZone = Type.Literal(CORE_HAND_ZONE);
export type CoreHandZone = Type.Static<typeof CoreHandZone>;
export const CoreRecycleZone = Type.Literal(CORE_RECYCLE_ZONE);
export type CoreRecycleZone = Type.Static<typeof CoreRecycleZone>;
export const CoreVoidZone = Type.Literal(CORE_VOID_ZONE);
export type CoreVoidZone = Type.Static<typeof CoreVoidZone>;

export const CorePlayerZones = Type.Tuple([
  CoreDeckZone,
  CoreExtraZone,
  CoreHandZone,
  CoreRecycleZone,
]);
export type CorePlayerZones = Type.Static<typeof CorePlayerZones>;
