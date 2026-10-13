import { Type } from "typebox";
import { CoreNotEqualInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawNotEqualInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreNotEqualInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreNotEqualInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreRawNotEqualInstruction",
);
export type CoreNotEqualInstruction = Type.Static<typeof CoreNotEqualInstruction>;

export const notEqual: CoreInstructionHandler<CoreNotEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) !== evaluate(event, right, response);
