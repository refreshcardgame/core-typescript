import { Type } from "typebox";
import { CoreGetInstructionType } from "../constants/instruction.ts";
import type { CoreEvent } from "../event.ts";
import { CoreInstructionDefs, evaluate, type CoreInstructionHandler } from "../instruction.ts";
import { isObtainablePayload } from "../payload.ts";
import { isPositionData } from "../position.ts";
import { CoreTyped } from "../type.ts";

export const CoreCyclicGetInstruction = Type.Interface(
  [Type.Call(CoreTyped, [CoreGetInstructionType])],
  {
    property: Type.Ref("CoreCyclicInstructionOrLiteral"),
    from: Type.Ref("CoreCyclicInstructionOrLiteral"),
  },
);
export const CoreGetInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicGetInstruction");
export type CoreGetInstruction = Type.Static<typeof CoreGetInstruction>;

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
