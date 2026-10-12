import type { CoreRoundInstructionType } from "../constants/instruction.ts";
import type { CoreInstructionHandler } from "../instruction.ts";
import type { CoreTyped } from "../type.ts";

export type CoreRoundInstruction = CoreTyped<CoreRoundInstructionType>;

export const round: CoreInstructionHandler<CoreRoundInstruction> = ({ game }) => game.round();
