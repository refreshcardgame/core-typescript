import { Type } from "typebox";
import { CORE_TYPE_GENERIC } from "./constants/type.ts";

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
