import type { CoreRoundInstructionType } from "../constants/instruction.ts";
import type { CoreInstructionHandler } from "../instruction.ts";
import type { CoreType } from "../type.ts";

export type CoreRoundInstruction = CoreType<CoreRoundInstructionType>;

export const round: CoreInstructionHandler<CoreRoundInstruction> = ({ game }) => game.round();
