import { Type } from "typebox";
import { CoreSequenceInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicSequenceInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreSequenceInstructionType])],
  { instructions: Type.Array(CoreCyclicInstructionOrLiteralRef) },
);
export const CoreSequenceInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicSequenceInstruction",
);
export type CoreSequenceInstruction = Type.Static<typeof CoreSequenceInstruction>;

export const sequence: CoreInstructionHandler<CoreSequenceInstruction> = (
  event,
  { instructions },
  response,
) =>
  instructions.reduce<unknown>((_, instruction) => evaluate(event, instruction, response), void 0);
