import { Type } from "typebox";
import { CoreNotInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawNotInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreNotInstructionType])],
  { value: CoreRawInstructionOrLiteralRef },
);
export const CoreNotInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawNotInstruction");
export type CoreNotInstruction = Type.Static<typeof CoreNotInstruction>;

export const not: CoreInstructionHandler<CoreNotInstruction> = (event, { value }, response) =>
  !evaluate(event, value, response);
