import { isObject } from "lodash-es";
import { Type } from "typebox";
import { CORE_OBJECT_TYPE } from "./constants/object.ts";
import { CORE_PLAYER_TYPE } from "./constants/player.ts";
import { CORE_TYPE_GENERIC } from "./constants/type.ts";
import type { CoreObject } from "./object.ts";
import { isTypedPayload, toTypedPayload } from "./payload.ts";
import type { CorePlayer } from "./player.ts";
import { isDestination, toDestinationData } from "./position.ts";

export type CoreCall<Target extends Type.TSchema, Arguments extends unknown[]> = Type.Static<
  ReturnType<
    typeof Type.Call<Target, { [TIndex in keyof Arguments]: Type.TUnsafe<Arguments[TIndex]> }>
  >
>;
export type CoreEquals<Parameter extends Type.TParameter> = Type.Static<Parameter["equals"]>;
export type CoreExtends<Parameter extends Type.TParameter> = Type.Static<Parameter["extends"]>;

export const CoreTypeGeneric = Type.Parameter(CORE_TYPE_GENERIC, Type.String());
export type CoreTypeGenericExtends = CoreExtends<typeof CoreTypeGeneric>;
export const CoreTypeRef = Type.Ref(CORE_TYPE_GENERIC);
export const CoreGenericTyped = Type.Object({ type: CoreTypeRef });
export const CoreTyped = Type.Generic([CoreTypeGeneric], CoreGenericTyped);
export type CoreTyped<TType extends CoreTypeGenericExtends> = CoreCall<typeof CoreTyped, [TType]>;

export const CoreNamed = Type.Object({ name: Type.String() });
export type CoreNamed = Type.Static<typeof CoreNamed>;

export function isCustomObject(value: unknown): value is object {
  if (!isObject(value)) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype !== Object.prototype && prototype !== null;
}

export function isCoreObject(value: unknown): value is CoreObject {
  return isCustomObject(value) && isTypedPayload(value) && value.type === CORE_OBJECT_TYPE;
}

export function isCorePlayer(value: unknown): value is CorePlayer {
  return isCustomObject(value) && isTypedPayload(value) && value.type === CORE_PLAYER_TYPE;
}

export function serialize(value: unknown): unknown {
  if (isTypedPayload(value)) return toTypedPayload(value);
  if (isDestination(value)) return toDestinationData(value);
  if (Array.isArray(value)) return value.map(serialize);
  return structuredClone(value);
}
