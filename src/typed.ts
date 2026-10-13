import { Type } from "typebox";
import { CORE_TYPE_GENERIC } from "./constants/typed.ts";

export const CoreTypeGeneric = <T extends Type.TSchema>(expression: T) =>
  Type.Generic([Type.Parameter(CORE_TYPE_GENERIC, Type.String())], expression);
export const CoreRawTyped = Type.Object({ type: Type.Ref(CORE_TYPE_GENERIC) });
export const CoreTyped = CoreTypeGeneric(CoreRawTyped);

export interface CoreTyped<TType extends string> {
  type: TType;
}
