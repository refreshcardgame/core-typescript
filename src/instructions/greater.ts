import { Type } from "typebox";
import { CoreGreaterInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawGreaterInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreGreaterInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreGreaterInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawGreaterInstruction");
export type CoreGreaterInstruction = Type.Static<typeof CoreGreaterInstruction>;

export const greater: CoreInstructionHandler<CoreGreaterInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) > Number(evaluate(event, right, response));
