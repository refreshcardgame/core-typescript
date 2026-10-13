import { Type } from "typebox";
import { CoreOrInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawOrInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreOrInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreOrInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawOrInstruction");
export type CoreOrInstruction = Type.Static<typeof CoreOrInstruction>;

export const or: CoreInstructionHandler<CoreOrInstruction> = (event, { left, right }, response) =>
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  evaluate(event, left, response) || evaluate(event, right, response);
