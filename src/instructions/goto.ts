import type { CoreGotoInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreGotoInstruction extends CoreType<CoreGotoInstructionType> {
  target: CoreInstructionOrLiteral;
}

export const goto: CoreInstructionHandler<CoreGotoInstruction> = (event, { target }, response) => {
  event.step = Number(evaluate(event, target, response));
};
