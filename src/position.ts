import type { OverrideProperties } from "type-fest";
import {
  CORE_DECK_ZONE,
  CORE_EXTRA_ZONE,
  CORE_FIELD_ZONE,
  CORE_HAND_ZONE,
  CORE_RECYCLE_ZONE,
  CORE_VOID_ZONE,
  type CoreCardinals,
  type CoreFieldZone,
  type CorePlayerZones,
  type CoreSides,
  type CoreVoidZone,
} from "./constants/position.ts";
import { CoreTuple } from "./math.ts";
import type { CoreObject } from "./object.ts";
import { CorePlayer } from "./player.ts";

export type CoreCardinal = CoreCardinals[number];
export type CorePlayerZone = CorePlayerZones[number];
export type CoreZone<TZone extends string> = Record<"zone", TZone>;
export type CoreVoidPosition = CoreZone<CoreVoidZone>;

export interface CoreFieldLocation {
  coordinates: CoreTuple;
  direction: CoreCardinal;
}

export interface CoreFieldPosition extends CoreZone<CoreFieldZone>, CoreFieldLocation {}

export type CoreFieldPositionData = OverrideProperties<CoreFieldPosition, { coordinates: string }>;

export interface CorePlayerLocation {
  player: CorePlayer;
}

export interface CorePlayerPosition extends CoreZone<CorePlayerZone>, CorePlayerLocation {}

export type CorePlayerPositionData = OverrideProperties<CorePlayerPosition, { player: string }>;
export type CorePosition = CoreFieldPosition | CorePlayerPosition | CoreVoidPosition;
export type CorePositionData = CoreFieldPositionData | CorePlayerPositionData | CoreVoidPosition;

export type CoreSide = CoreSides[number];

export interface CoreObjectIndex {
  side: CoreSide;
  target?: CoreObject;
}

export type CoreObjectIndexData = OverrideProperties<CoreObjectIndex, { target?: string }>;

export interface CoreDestination {
  objects: CoreObject[];
  position: CorePosition;
  index?: CoreObjectIndex;
}

export interface CoreDestinationData {
  objects: string[];
  position: CorePositionData;
  index?: CoreObjectIndexData;
}

export function isDestinationData(data: unknown): data is CoreDestinationData {
  if (typeof data !== "object" || data === null) return false;
  if (
    !("objects" in data) ||
    !Array.isArray(data.objects) ||
    data.objects.some((object) => typeof object !== "string")
  )
    return false;
  if (!("position" in data) || !isPositionData(data.position)) return false;
  if ("index" in data && !isObjectIndex(data.index)) return false;
  return true;
}

export function isObjectIndex(data: unknown): data is CoreObjectIndex {
  return (
    typeof data === "object" && data !== null && "side" in data && typeof data.side === "string"
  );
}

export function isPosition(position: unknown): position is CorePosition {
  if (typeof position === "object" && position !== null && "zone" in position)
    switch (position.zone) {
      case CORE_FIELD_ZONE:
        return (
          "coordinates" in position &&
          position.coordinates instanceof CoreTuple &&
          "direction" in position &&
          typeof position.direction === "string"
        );

      case CORE_VOID_ZONE:
        return true;

      case CORE_DECK_ZONE:
      case CORE_EXTRA_ZONE:
      case CORE_HAND_ZONE:
      case CORE_RECYCLE_ZONE:
        return "player" in position && position.player instanceof CorePlayer;
    }

  return false;
}

export function isPositionData(data: unknown): data is CorePositionData {
  if (typeof data === "object" && data !== null && "zone" in data)
    switch (data.zone) {
      case CORE_FIELD_ZONE:
        return (
          "coordinates" in data &&
          typeof data.coordinates === "string" &&
          "direction" in data &&
          typeof data.direction === "string"
        );

      case CORE_VOID_ZONE:
        return true;

      case CORE_DECK_ZONE:
      case CORE_EXTRA_ZONE:
      case CORE_HAND_ZONE:
      case CORE_RECYCLE_ZONE:
        return "player" in data && typeof data.player === "string";
    }

  return false;
}

export function isSamePosition(
  a?: CorePosition | CorePositionData,
  b?: CorePosition | CorePositionData,
): boolean {
  if (!a || !b || a.zone !== b.zone) return false;
  if (a.zone === CORE_VOID_ZONE && b.zone === CORE_VOID_ZONE) return true;
  if (isPosition(a)) a = toPositionData(a);
  if (isPosition(b)) b = toPositionData(b);
  if (a.zone === CORE_FIELD_ZONE && b.zone === CORE_FIELD_ZONE)
    return a.coordinates === b.coordinates && a.direction === b.direction;
  return (
    (a.zone === CORE_DECK_ZONE ||
      a.zone === CORE_EXTRA_ZONE ||
      a.zone === CORE_HAND_ZONE ||
      a.zone === CORE_RECYCLE_ZONE) &&
    (b.zone === CORE_DECK_ZONE ||
      b.zone === CORE_EXTRA_ZONE ||
      b.zone === CORE_HAND_ZONE ||
      b.zone === CORE_RECYCLE_ZONE) &&
    a.player === b.player
  );
}

export function toDestinationData({
  objects,
  position,
  index,
}: CoreDestination): CoreDestinationData {
  const data: CoreDestinationData = {
    objects: objects.map(({ id }) => id),
    position: toPositionData(position),
  };
  if (index) data.index = toObjectIndexData(index);
  return data;
}

export function toObjectIndexData({ side, target }: CoreObjectIndex): CoreObjectIndexData {
  const data: CoreObjectIndexData = { side };
  if (target) data.target = target.id;
  return data;
}

export function toPositionData(position: CorePosition): CorePositionData {
  switch (position.zone) {
    case CORE_FIELD_ZONE:
      return {
        zone: position.zone,
        coordinates: position.coordinates.toString(),
        direction: position.direction,
      };

    case CORE_VOID_ZONE:
      return { zone: position.zone };
  }

  return { zone: position.zone, player: position.player.id };
}
