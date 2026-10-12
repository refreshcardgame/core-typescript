import type { CoreGotoInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreGotoInstruction extends CoreTyped<CoreGotoInstructionType> {
  target: CoreInstructionOrLiteral;
}

export const goto: CoreInstructionHandler<CoreGotoInstruction> = (event, { target }, response) => {
  event.step = Number(evaluate(event, target, response));
};
