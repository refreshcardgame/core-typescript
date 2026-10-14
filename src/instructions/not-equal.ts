import { Type } from "typebox";
import { CoreNotEqualInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicNotEqualInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreNotEqualInstructionType])],
  {
    left: Type.Ref("CoreCyclicInstructionOrLiteral"),
    right: Type.Ref("CoreCyclicInstructionOrLiteral"),
  },
);
export const CoreNotEqualInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicNotEqualInstruction",
);
export type CoreNotEqualInstruction = Type.Static<typeof CoreNotEqualInstruction>;

export const notEqual: CoreInstructionHandler<CoreNotEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) !== evaluate(event, right, response);
