import { Type } from "typebox";
import { CoreMultiplyInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicMultiplyInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreMultiplyInstructionType])],
  { left: CoreCyclicInstructionOrLiteralRef, right: CoreCyclicInstructionOrLiteralRef },
);
export const CoreMultiplyInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicMultiplyInstruction",
);
export type CoreMultiplyInstruction = Type.Static<typeof CoreMultiplyInstruction>;

export const multiply: CoreInstructionHandler<CoreMultiplyInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) * Number(evaluate(event, right, response));
