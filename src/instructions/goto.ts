import { Type } from "typebox";
import { CoreGotoInstructionType } from "../constants/instruction.ts";
import {
  CoreInstructionDefs,
  CoreRawInstructionOrLiteralRef,
  evaluate,
  type CoreInstructionHandler,
} from "../instruction.ts";
import { CoreTyped } from "../typed.ts";

export const CoreRawGotoInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreGotoInstructionType])],
  { target: CoreRawInstructionOrLiteralRef },
);
export const CoreGotoInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawGotoInstruction");
export type CoreGotoInstruction = Type.Static<typeof CoreGotoInstruction>;

export const goto: CoreInstructionHandler<CoreGotoInstruction> = (event, { target }, response) => {
  event.step = Number(evaluate(event, target, response));
};
