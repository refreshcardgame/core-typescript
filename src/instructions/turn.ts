import type { CoreTurnInstructionType } from "../constants/instruction.ts";
import { evaluate, type CoreInstruction, type CoreInstructionHandler } from "../instruction.ts";
import { CorePlayer } from "../player.ts";
import type { CoreTyped } from "../typed.ts";

export interface CoreTurnInstruction extends CoreTyped<CoreTurnInstructionType> {
  player: CoreInstruction;
}

export const turn: CoreInstructionHandler<CoreTurnInstruction> = (event, { player }, response) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated.turn();
};
