import { Type } from "typebox";
import { CoreAddInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicAddInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreAddInstructionType])],
  { left: CoreCyclicInstructionOrLiteralRef, right: CoreCyclicInstructionOrLiteralRef },
);
export const CoreAddInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicAddInstruction");
export type CoreAddInstruction = Type.Static<typeof CoreAddInstruction>;

export const add: CoreInstructionHandler<CoreAddInstruction> = (event, { left, right }, response) =>
  Number(evaluate(event, left, response)) + Number(evaluate(event, right, response));
