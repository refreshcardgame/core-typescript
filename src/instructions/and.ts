import { Type } from "typebox";
import { CoreAndInstructionType } from "../constants/instruction.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicAndInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreAndInstructionType])],
  {
    left: Type.Ref("CoreCyclicInstructionOrLiteral"),
    right: Type.Ref("CoreCyclicInstructionOrLiteral"),
  },
);
export const CoreAndInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicAndInstruction");
export type CoreAndInstruction = Type.Static<typeof CoreAndInstruction>;

export const and: CoreInstructionHandler<CoreAndInstruction> = (event, { left, right }, response) =>
  evaluate(event, left, response) && evaluate(event, right, response);
