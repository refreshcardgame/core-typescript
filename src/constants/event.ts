export const CORE_EVENT_TYPE = "event" as const;

export const CORE_ROUND_EVENT_NAME = "round" as const;
export const CORE_TURN_EVENT_NAME = "turn" as const;

export const CORE_AFTER_EVENT_PHASE = "after" as const;
export const CORE_BEFORE_EVENT_PHASE = "before" as const;
export const CORE_REGISTER_EVENT_PHASE = "register" as const;
export const CORE_RESOLVE_EVENT_PHASE = "resolve" as const;
export const CORE_SUB_EVENT_PHASE = "sub" as const;

export type CoreEventType = typeof CORE_EVENT_TYPE;

export type CoreRoundName = typeof CORE_ROUND_EVENT_NAME;
export type CoreTurnName = typeof CORE_TURN_EVENT_NAME;

export type CoreAfterPhase = typeof CORE_AFTER_EVENT_PHASE;
export type CoreBeforePhase = typeof CORE_BEFORE_EVENT_PHASE;
export type CoreRegisterPhase = typeof CORE_REGISTER_EVENT_PHASE;
export type CoreResolvePhase = typeof CORE_RESOLVE_EVENT_PHASE;
export type CoreSubPhase = typeof CORE_SUB_EVENT_PHASE;
