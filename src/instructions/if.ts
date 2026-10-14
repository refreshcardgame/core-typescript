import { Type } from "typebox";
import { CoreIfInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicIfInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreIfInstructionType])],
  {
    condition: Type.Ref("CoreCyclicInstructionOrLiteral"),
    then: Type.Ref("CoreCyclicInstructionOrLiteral"),
    else: Type.Optional(Type.Ref("CoreCyclicInstructionOrLiteral")),
  },
);
export const CoreIfInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicIfInstruction");
export type CoreIfInstruction = Type.Static<typeof CoreIfInstruction>;

export const ifHandler: CoreInstructionHandler<CoreIfInstruction> = (
  event,
  { condition, then: thenInstruction, else: elseInstruction },
  response,
) => {
  if (evaluate(event, condition, response)) return evaluate(event, thenInstruction, response);
  if (typeof elseInstruction !== "undefined") return evaluate(event, elseInstruction, response);
};
