import type { CorePlayerInstructionType } from "../constants/instruction.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import type { CoreTyped } from "../typed.ts";

export interface CorePlayerInstruction extends CoreTyped<CorePlayerInstructionType> {
  index?: CoreInstructionOrLiteral;
}

export const player: CoreInstructionHandler<CorePlayerInstruction> = (
  event,
  { index },
  response,
) =>
  typeof index === "undefined"
    ? event.getPlayer()
    : event.game.state.getPlayer(Number(evaluate(event, index, response)));
