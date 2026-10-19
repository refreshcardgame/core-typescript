import { Type } from "typebox";
import { CoreInstruction } from "./instruction.ts";
import { CoreNamed } from "./type.ts";

export const CoreEffectOptions = Type.Interface([CoreNamed], {
  trigger: CoreInstruction,
  condition: Type.Optional(CoreInstruction),
  input: Type.Optional(Type.Array(CoreInstruction)),
  output: Type.Optional(Type.Array(CoreInstruction)),
});
export type CoreEffectOptions = Type.Static<typeof CoreEffectOptions>;
