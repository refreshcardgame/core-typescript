import { Type } from "typebox";

export const CORE_CARD_TYPE = "card" as const;

export const CORE_CHARACTER_CARD_TYPE = "character" as const;

export const CoreCardType = Type.Literal(CORE_CARD_TYPE);
export type CoreCardType = Type.Static<typeof CoreCardType>;

export type CoreCharacterCardType = typeof CORE_CHARACTER_CARD_TYPE;
