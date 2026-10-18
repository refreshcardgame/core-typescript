import { Type } from "typebox";
import { CORE_NAMESPACE } from "./type.ts";

export const CORE_EVENT_TYPE = "event" as const;

export const CORE_FIGHT_ACTION = `${CORE_NAMESPACE}:fight` as const;
export const CORE_MOVE_ACTION = `${CORE_NAMESPACE}:move` as const;
export const CORE_ROTATE_ACTION = `${CORE_NAMESPACE}:rotate` as const;
export const CORE_USE_ACTION = `${CORE_NAMESPACE}:use` as const;
export const CORE_BASIC_ACTIONS = [
  CORE_FIGHT_ACTION,
  CORE_MOVE_ACTION,
  CORE_ROTATE_ACTION,
  CORE_USE_ACTION,
] as const;
export const CORE_SIMPLE_BASIC_ACTIONS = [
  CORE_FIGHT_ACTION,
  CORE_ROTATE_ACTION,
  CORE_USE_ACTION,
] as const;

export const CORE_ROUND_EVENT_NAME = "round" as const;
export const CORE_TURN_EVENT_NAME = "turn" as const;

export const CORE_AFTER_EVENT_PHASE = "after" as const;
export const CORE_BEFORE_EVENT_PHASE = "before" as const;
export const CORE_REGISTER_EVENT_PHASE = "register" as const;
export const CORE_RESOLVE_EVENT_PHASE = "resolve" as const;
export const CORE_SUB_EVENT_PHASE = "sub" as const;

export const CoreEventType = Type.Literal(CORE_EVENT_TYPE);
export type CoreEventType = Type.Static<typeof CoreEventType>;

export type CoreRoundName = typeof CORE_ROUND_EVENT_NAME;
export type CoreTurnName = typeof CORE_TURN_EVENT_NAME;

export const CoreAfterPhase = Type.Literal(CORE_AFTER_EVENT_PHASE);
export type CoreAfterPhase = Type.Static<typeof CoreAfterPhase>;
export const CoreBeforePhase = Type.Literal(CORE_BEFORE_EVENT_PHASE);
export type CoreBeforePhase = Type.Static<typeof CoreBeforePhase>;
export const CoreRegisterPhase = Type.Literal(CORE_REGISTER_EVENT_PHASE);
export type CoreRegisterPhase = Type.Static<typeof CoreRegisterPhase>;
export const CoreResolvePhase = Type.Literal(CORE_RESOLVE_EVENT_PHASE);
export type CoreResolvePhase = Type.Static<typeof CoreResolvePhase>;
export const CoreSubPhase = Type.Literal(CORE_SUB_EVENT_PHASE);
export type CoreSubPhase = Type.Static<typeof CoreSubPhase>;
