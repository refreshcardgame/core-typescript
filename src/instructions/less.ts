import { Type } from "typebox";
import { CoreLessInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawLessInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreLessInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreLessInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawLessInstruction");
export type CoreLessInstruction = Type.Static<typeof CoreLessInstruction>;

export const less: CoreInstructionHandler<CoreLessInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) < Number(evaluate(event, right, response));
