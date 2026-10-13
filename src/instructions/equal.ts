import { Type } from "typebox";
import { CoreEqualInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawEqualInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreEqualInstructionType])],
  { left: CoreRawInstructionOrLiteralRef, right: CoreRawInstructionOrLiteralRef },
);
export const CoreEqualInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawEqualInstruction");
export type CoreEqualInstruction = Type.Static<typeof CoreEqualInstruction>;

export const equal: CoreInstructionHandler<CoreEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) === evaluate(event, right, response);
