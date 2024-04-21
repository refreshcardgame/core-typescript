import { CORE_RESOLVE_EVENT_PHASE } from "../constants/event.ts";
import type { CoreTriggerInstructionType } from "../constants/instruction.ts";
import { evaluate, type CoreInstruction, type CoreInstructionHandler } from "../instruction.ts";
import type { CoreType } from "../type.ts";

export interface CoreTriggerInstruction extends CoreType<CoreTriggerInstructionType> {
  timings: CoreInstruction[];
}

export const trigger: CoreInstructionHandler<CoreTriggerInstruction> = (
  event,
  { timings },
  response,
) => {
  if (event.phase === CORE_RESOLVE_EVENT_PHASE)
    return event.trigger(
      timings.map((instruction) => String(evaluate(event, instruction, response))),
      response ?? {},
    );
};
