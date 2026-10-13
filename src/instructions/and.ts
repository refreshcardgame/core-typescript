import { Type } from "typebox";
import { CoreAndInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawAndInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreAndInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreAndInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawAndInstruction");
export type CoreAndInstruction = Type.Static<typeof CoreAndInstruction>;

export const and: CoreInstructionHandler<CoreAndInstruction> = (event, { left, right }, response) =>
  evaluate(event, left, response) && evaluate(event, right, response);
