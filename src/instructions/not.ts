import { Type } from "typebox";
import { CoreNotInstructionType } from "../constants/instruction.ts";
import {
  CoreCyclicInstructionOrLiteralRef,
  CoreInstructionDefs,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicNotInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreNotInstructionType])],
  { value: CoreCyclicInstructionOrLiteralRef },
);
export const CoreNotInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicNotInstruction");
export type CoreNotInstruction = Type.Static<typeof CoreNotInstruction>;

export const not: CoreInstructionHandler<CoreNotInstruction> = (event, { value }, response) =>
  !evaluate(event, value, response);
