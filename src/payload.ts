import { Type } from "typebox";
import { Value } from "typebox/value";
import { CORE_CARD_TYPE } from "./constants/card.ts";
import { CORE_EVENT_TYPE } from "./constants/event.ts";
import { CORE_OBJECT_TYPE } from "./constants/object.ts";
import { CORE_PLAYER_TYPE } from "./constants/player.ts";
import type { CoreState } from "./state.ts";
import { CoreRawTyped, CoreTypeGeneric, type CoreTyped } from "./typed.ts";

export const CorePayload = Type.Object({ id: Type.String() });
export type CorePayload = Type.Static<typeof CorePayload>;
export const CoreTypedPayload = CoreTypeGeneric(Type.Intersect([CorePayload, CoreRawTyped]));
export type CoreTypedPayload<TType extends string> = CorePayload & CoreTyped<TType>;

export type CoreObtainable = {
  [K in keyof CoreState]: K extends `${string}s`
    ? CoreState[K] extends Map<string, infer V>
      ? V
      : never
    : never;
}[keyof CoreState];
export type CoreObtainableType = CoreObtainable["type"];
export type CoreObtainablePayload = CoreTypedPayload<CoreObtainableType>;

export function isPayload(payload: unknown): payload is CorePayload {
  return Value.Check(CorePayload, payload);
}

export function isObtainablePayload(payload: unknown): payload is CoreObtainablePayload {
  if (isTypedPayload(payload))
    switch (payload.type) {
      case CORE_CARD_TYPE:
      case CORE_EVENT_TYPE:
      case CORE_OBJECT_TYPE:
      case CORE_PLAYER_TYPE:
        return true;
    }

  return false;
}

export function isTypedPayload(payload: unknown): payload is CoreTypedPayload<string> {
  return Value.Check(Type.Call(CoreTypedPayload, [Type.String()]), payload);
}

export function toTypedPayload<TType extends string>(
  payload: CoreTypedPayload<TType>,
): CoreTypedPayload<TType> {
  const { id, type } = payload;
  return { id, type };
}
