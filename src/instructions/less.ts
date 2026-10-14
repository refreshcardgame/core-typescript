import { Type } from "typebox";
import { CoreLessInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicLessInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreLessInstructionType])],
  {
    left: Type.Ref("CoreCyclicInstructionOrLiteral"),
    right: Type.Ref("CoreCyclicInstructionOrLiteral"),
  },
);
export const CoreLessInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicLessInstruction");
export type CoreLessInstruction = Type.Static<typeof CoreLessInstruction>;

export const less: CoreInstructionHandler<CoreLessInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) < Number(evaluate(event, right, response));
