import { Type } from "typebox";
import { CoreMultiplyInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawMultiplyInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreMultiplyInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreMultiplyInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreRawMultiplyInstruction",
);
export type CoreMultiplyInstruction = Type.Static<typeof CoreMultiplyInstruction>;

export const multiply: CoreInstructionHandler<CoreMultiplyInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) * Number(evaluate(event, right, response));
