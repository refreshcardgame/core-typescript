import { Type } from "typebox";
import { CoreOrInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicOrInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreOrInstructionType])],
  { left: CoreCyclicInstructionOrLiteralRef, right: CoreCyclicInstructionOrLiteralRef },
);
export const CoreOrInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicOrInstruction");
export type CoreOrInstruction = Type.Static<typeof CoreOrInstruction>;

export const or: CoreInstructionHandler<CoreOrInstruction> = (event, { left, right }, response) =>
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  evaluate(event, left, response) || evaluate(event, right, response);
