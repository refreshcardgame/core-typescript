import { Type } from "typebox";
import { CoreAddInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawAddInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreAddInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreAddInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawAddInstruction");
export type CoreAddInstruction = Type.Static<typeof CoreAddInstruction>;

export const add: CoreInstructionHandler<CoreAddInstruction> = (event, { left, right }, response) =>
  Number(evaluate(event, left, response)) + Number(evaluate(event, right, response));
