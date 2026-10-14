import { Type } from "typebox";
import type { CoreEvent } from "./event.ts";
import { add, CoreCyclicAddInstruction } from "./instructions/add.ts";
import { and, CoreCyclicAndInstruction } from "./instructions/and.ts";
import {
  CoreCyclicMultipleDrawInstruction,
  CoreCyclicSingleDrawInstruction,
  draw,
} from "./instructions/draw.ts";
import { CoreCyclicEqualInstruction, equal } from "./instructions/equal.ts";
import { CoreCyclicForInstruction, forHandler } from "./instructions/for.ts";
import { CoreCyclicGetInstruction, get } from "./instructions/get.ts";
import { CoreCyclicGotoInstruction, goto } from "./instructions/goto.ts";
import { CoreCyclicGreaterInstruction, greater } from "./instructions/greater.ts";
import { CoreCyclicIfInstruction, ifHandler } from "./instructions/if.ts";
import { CoreCyclicLessInstruction, less } from "./instructions/less.ts";
import { CoreCyclicMapInstruction, map as flatMap, map } from "./instructions/map.ts";
import { CoreCyclicMultiplyInstruction, multiply } from "./instructions/multiply.ts";
import { CoreCyclicNotEqualInstruction, notEqual } from "./instructions/not-equal.ts";
import { CoreCyclicNotInstruction, not } from "./instructions/not.ts";
import { CoreCyclicOrInstruction, or } from "./instructions/or.ts";
import { CoreCyclicPhaseInstruction, phase } from "./instructions/phase.ts";
import { CoreCyclicPlayerInstruction, player } from "./instructions/player.ts";
import { CoreCyclicPlayersInstruction, players } from "./instructions/players.ts";
import { CoreCyclicRequestInstruction, request } from "./instructions/request.ts";
import { CoreCyclicResponseInstruction, response } from "./instructions/response.ts";
import { CoreCyclicReturnInstruction, returnHandler } from "./instructions/return.ts";
import { CoreCyclicRoundInstruction, round } from "./instructions/round.ts";
import { CoreCyclicSequenceInstruction, sequence } from "./instructions/sequence.ts";
import { CoreCyclicTransferInstruction, transfer } from "./instructions/transfer.ts";
import { CoreCyclicTriggerInstruction, trigger } from "./instructions/trigger.ts";
import { CoreCyclicTurnInstruction, turn } from "./instructions/turn.ts";
import { CoreCyclicVariableInstruction, variable } from "./instructions/variable.ts";
import { CoreCyclicWhileInstruction, whileHandler } from "./instructions/while.ts";
import type { CoreResponse } from "./runner.ts";

export const CoreInstructionDefs = {
  CoreCyclicAddInstruction,
  CoreCyclicAndInstruction,
  CoreCyclicEqualInstruction,
  CoreCyclicForInstruction,
  CoreCyclicGetInstruction,
  CoreCyclicGotoInstruction,
  CoreCyclicGreaterInstruction,
  CoreCyclicIfInstruction,
  CoreCyclicLessInstruction,
  CoreCyclicMapInstruction,
  CoreCyclicMultipleDrawInstruction,
  CoreCyclicMultiplyInstruction,
  CoreCyclicNotEqualInstruction,
  CoreCyclicNotInstruction,
  CoreCyclicOrInstruction,
  CoreCyclicPhaseInstruction,
  CoreCyclicPlayerInstruction,
  CoreCyclicPlayersInstruction,
  CoreCyclicRequestInstruction,
  CoreCyclicResponseInstruction,
  CoreCyclicReturnInstruction,
  CoreCyclicRoundInstruction,
  CoreCyclicSequenceInstruction,
  CoreCyclicSingleDrawInstruction,
  CoreCyclicTransferInstruction,
  CoreCyclicTriggerInstruction,
  CoreCyclicTurnInstruction,
  CoreCyclicVariableInstruction,
  CoreCyclicWhileInstruction,
  CoreCyclicInstruction: Type.Union([
    Type.Ref("CoreCyclicAddInstruction"),
    Type.Ref("CoreCyclicAndInstruction"),
    Type.Ref("CoreCyclicEqualInstruction"),
    Type.Ref("CoreCyclicForInstruction"),
    Type.Ref("CoreCyclicGetInstruction"),
    Type.Ref("CoreCyclicGotoInstruction"),
    Type.Ref("CoreCyclicGreaterInstruction"),
    Type.Ref("CoreCyclicIfInstruction"),
    Type.Ref("CoreCyclicLessInstruction"),
    Type.Ref("CoreCyclicMapInstruction"),
    Type.Ref("CoreCyclicMultipleDrawInstruction"),
    Type.Ref("CoreCyclicMultiplyInstruction"),
    Type.Ref("CoreCyclicNotEqualInstruction"),
    Type.Ref("CoreCyclicNotInstruction"),
    Type.Ref("CoreCyclicOrInstruction"),
    Type.Ref("CoreCyclicPhaseInstruction"),
    Type.Ref("CoreCyclicPlayerInstruction"),
    Type.Ref("CoreCyclicPlayersInstruction"),
    Type.Ref("CoreCyclicRequestInstruction"),
    Type.Ref("CoreCyclicResponseInstruction"),
    Type.Ref("CoreCyclicReturnInstruction"),
    Type.Ref("CoreCyclicRoundInstruction"),
    Type.Ref("CoreCyclicSequenceInstruction"),
    Type.Ref("CoreCyclicSingleDrawInstruction"),
    Type.Ref("CoreCyclicTransferInstruction"),
    Type.Ref("CoreCyclicTriggerInstruction"),
    Type.Ref("CoreCyclicTurnInstruction"),
    Type.Ref("CoreCyclicVariableInstruction"),
    Type.Ref("CoreCyclicWhileInstruction"),
  ]),
  CoreCyclicInstructionOrLiteral: Type.Union([
    Type.String(),
    Type.Number(),
    Type.Boolean(),
    Type.Ref("CoreCyclicInstruction"),
  ]),
} satisfies Type.TProperties;
export const CoreInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicInstruction");
export type CoreInstruction = Type.Static<typeof CoreInstruction>;
export const CoreInstructionOrLiteral = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicInstructionOrLiteral",
);
export type CoreInstructionOrLiteral = Type.Static<typeof CoreInstructionOrLiteral>;
export type CoreInstructionHandler<TInstruction extends CoreInstruction> = (
  event: CoreEvent,
  instruction: TInstruction,
  response?: CoreResponse,
) => unknown;
type CoreInstructionHandlers = {
  [K in CoreInstruction["type"]]: CoreInstructionHandler<Extract<CoreInstruction, { type: K }>>;
};

const handlers: CoreInstructionHandlers = {
  add,
  and,
  draw,
  equal,
  flatMap,
  for: forHandler,
  get,
  goto,
  greater,
  if: ifHandler,
  less,
  map,
  multiply,
  not,
  notEqual,
  or,
  phase,
  player,
  players,
  request,
  response,
  return: returnHandler,
  round,
  sequence,
  transfer,
  trigger,
  turn,
  variable,
  while: whileHandler,
};

export function evaluate(
  event: CoreEvent,
  instruction: CoreInstructionOrLiteral,
  response?: CoreResponse,
): unknown {
  return typeof instruction === "string" ||
    typeof instruction === "number" ||
    typeof instruction === "boolean"
    ? instruction
    : handlers[instruction.type]?.(event, instruction as never, response);
}
