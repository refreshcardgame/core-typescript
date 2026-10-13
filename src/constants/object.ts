import { Type } from "typebox";

export const CORE_OBJECT_TYPE = "object" as const;

export const CoreObjectType = Type.Literal(CORE_OBJECT_TYPE);
export type CoreObjectType = Type.Static<typeof CoreObjectType>;
