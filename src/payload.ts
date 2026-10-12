import { CORE_CARD_TYPE } from "./constants/card.ts";
import { CORE_EVENT_TYPE } from "./constants/event.ts";
import { CORE_OBJECT_TYPE } from "./constants/object.ts";
import { CORE_PLAYER_TYPE } from "./constants/player.ts";
import type { CoreState } from "./state.ts";
import type { CoreTyped } from "./type.ts";

export interface CorePayload {
  id: string;
}

export interface CoreTypedPayload<TType extends string> extends CorePayload, CoreTyped<TType> {}

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
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    typeof payload.id === "string"
  );
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
  return isPayload(payload) && "type" in payload && typeof payload.type === "string";
}

export function toTypedPayload<TType extends string>(
  payload: CoreTypedPayload<TType>,
): CoreTypedPayload<TType> {
  const { id, type } = payload;
  return { id, type };
}
