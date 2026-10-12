import type { CoreGetInstructionType } from "../constants/instruction.ts";
import type { CoreEvent } from "../event.ts";
import {
  evaluate,
  type CoreInstructionHandler,
  type CoreInstructionOrLiteral,
} from "../instruction.ts";
import { isObtainablePayload } from "../payload.ts";
import { isPositionData } from "../position.ts";
import type { CoreTyped } from "../type.ts";

export interface CoreGetInstruction extends CoreTyped<CoreGetInstructionType> {
  property: CoreInstructionOrLiteral;
  from: CoreInstructionOrLiteral;
}

function parse(event: CoreEvent, value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => parse(event, v));
  if (isObtainablePayload(value)) return event.game.state.get(value);
  if (isPositionData(value)) return event.game.state.toPosition(value);
  return value;
}

export const get: CoreInstructionHandler<CoreGetInstruction> = (
  event,
  { property, from },
  response,
) => {
  const evaluatedFrom = evaluate(event, from, response);
  if (typeof evaluatedFrom !== "object" || evaluatedFrom === null) return;
  const evaluatedProperty = evaluate(event, property, response);
  if (
    (typeof evaluatedProperty === "string" || typeof evaluatedProperty === "number") &&
    evaluatedProperty in evaluatedFrom
  )
    return parse(event, Reflect.get(evaluatedFrom, evaluatedProperty) as unknown);
};
