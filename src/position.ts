import { Type } from "typebox";
import { Value } from "typebox/value";
import {
  CORE_DECK_ZONE,
  CORE_EXTRA_ZONE,
  CORE_FIELD_ZONE,
  CORE_HAND_ZONE,
  CORE_RECYCLE_ZONE,
  CORE_VOID_ZONE,
  CORE_ZONE_GENERIC,
  CoreCardinals,
  CoreFieldZone,
  CorePlayerZones,
  CoreSides,
  CoreVoidZone,
} from "./constants/position.ts";
import type { CoreGame } from "./game.ts";
import { CoreTuple } from "./math.ts";
import type { CoreObject } from "./object.ts";
import { CorePlayer } from "./player.ts";
import type { CoreCall, CoreExtends } from "./type.ts";

export const CoreCardinal = Type.Index(CoreCardinals, Type.Number());
export type CoreCardinal = Type.Static<typeof CoreCardinal>;
export const CorePlayerZone = Type.Index(CorePlayerZones, Type.Number());
export type CorePlayerZone = Type.Static<typeof CorePlayerZone>;

const CoreZoneGeneric = Type.Parameter(CORE_ZONE_GENERIC, Type.String());
type CoreZoneGenericExtends = CoreExtends<typeof CoreZoneGeneric>;
const CoreZoneRef = Type.Ref(CORE_ZONE_GENERIC);
export const CoreZoned = Type.Generic([CoreZoneGeneric], Type.Object({ zone: CoreZoneRef }));
export type CoreZoned<TZone extends CoreZoneGenericExtends> = CoreCall<typeof CoreZoned, [TZone]>;

export type CoreVoidPosition = CoreZoned<CoreVoidZone>;
export const CoreVoidPositionData = Type.Call(CoreZoned, [CoreVoidZone]);
export type CoreVoidPositionData = Type.Static<typeof CoreVoidPositionData>;

export interface CoreFieldLocation {
  coordinates: CoreTuple;
  direction: CoreCardinal;
}

export type CoreFieldPosition = CoreZoned<CoreFieldZone> & CoreFieldLocation;

export const CoreFieldPositionData = Type.Interface([Type.Call(CoreZoned, [CoreFieldZone])], {
  coordinates: Type.String(),
  direction: CoreCardinal,
});
export type CoreFieldPositionData = Type.Static<typeof CoreFieldPositionData>;

export interface CorePlayerLocation {
  player: CorePlayer;
}

export type CorePlayerPosition = CoreZoned<CorePlayerZone> & CorePlayerLocation;

export const CorePlayerPositionData = Type.Interface([Type.Call(CoreZoned, [CorePlayerZone])], {
  player: Type.String(),
});
export type CorePlayerPositionData = Type.Static<typeof CorePlayerPositionData>;

export type CorePosition = CoreFieldPosition | CorePlayerPosition | CoreVoidPosition;
export const CorePositionData = Type.Union([
  CoreFieldPositionData,
  CorePlayerPositionData,
  CoreVoidPositionData,
]);
export type CorePositionData = Type.Static<typeof CorePositionData>;

export const CoreSide = Type.Index(CoreSides, Type.Number());
export type CoreSide = Type.Static<typeof CoreSide>;

export interface CoreObjectIndex {
  side: CoreSide;
  target?: CoreObject;
}

export const CoreObjectIndexData = Type.Object({
  side: CoreSide,
  target: Type.Optional(Type.String()),
});
export type CoreObjectIndexData = Type.Static<typeof CoreObjectIndexData>;

export interface CoreDestination {
  objects: CoreObject[];
  position: CorePosition;
  index?: CoreObjectIndex;
}

export const CoreDestinationData = Type.Object({
  objects: Type.Array(Type.String()),
  position: CorePositionData,
  index: Type.Optional(CoreObjectIndexData),
});
export type CoreDestinationData = Type.Static<typeof CoreDestinationData>;

export function isDestinationData(data: unknown): data is CoreDestinationData {
  return Value.Check(CoreDestinationData, data);
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
  return Value.Check(CorePositionData, data);
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

export function toDestination(
  game: CoreGame,
  { objects, position, index }: CoreDestinationData,
): CoreDestination | undefined {
  const pos = toPosition(game, position);
  if (!pos) return;
  const destination: CoreDestination = { objects: game.state.getObjects(objects), position: pos };
  if (!index) return destination;
  const idx = toObjectIndex(game, index);
  if (idx) destination.index = idx;
  return destination;
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

export function toObjectIndex(
  game: CoreGame,
  { side, target }: CoreObjectIndexData,
): CoreObjectIndex | undefined {
  const object = game.state.getObject(target);
  if (object) return { side, target: object };
}

export function toObjectIndexData({ side, target }: CoreObjectIndex): CoreObjectIndexData {
  const data: CoreObjectIndexData = { side };
  if (target) data.target = target.id;
  return data;
}

export function toPosition(game: CoreGame, data: CorePositionData): CorePosition | undefined {
  switch (data.zone) {
    case CORE_FIELD_ZONE:
      return {
        zone: data.zone,
        coordinates: CoreTuple.from(data.coordinates),
        direction: data.direction,
      };

    case CORE_VOID_ZONE:
      return { zone: data.zone };
  }

  const player = game.state.getPlayer(data.player);
  if (player) return { zone: data.zone, player };
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
