import type { CorePlayersInstructionType } from "../constants/instruction.ts";
import type { CoreInstructionHandler } from "../instruction.ts";
import type { CoreType } from "../type.ts";

export type CorePlayersInstruction = CoreType<CorePlayersInstructionType>;

export const players: CoreInstructionHandler<CorePlayersInstruction> = ({ game: { state } }) =>
  state.getAllPlayers();
