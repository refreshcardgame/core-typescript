import { Type } from "typebox";
import { CoreGreaterInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicGreaterInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreGreaterInstructionType])],
  { left: CoreCyclicInstructionOrLiteralRef, right: CoreCyclicInstructionOrLiteralRef },
);
export const CoreGreaterInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicGreaterInstruction",
);
export type CoreGreaterInstruction = Type.Static<typeof CoreGreaterInstruction>;

export const greater: CoreInstructionHandler<CoreGreaterInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) > Number(evaluate(event, right, response));
