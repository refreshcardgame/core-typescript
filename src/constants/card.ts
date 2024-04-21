export const CORE_CARD_TYPE = "card" as const;

export const CORE_CHARACTER_CARD_TYPE = "character" as const;

export type CoreCardType = typeof CORE_CARD_TYPE;

export type CoreCharacterCardType = typeof CORE_CHARACTER_CARD_TYPE;
