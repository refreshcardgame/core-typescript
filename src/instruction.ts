import type { CoreEvent } from "./event.ts";
import { add, type CoreAddInstruction } from "./instructions/add.ts";
import { and, type CoreAndInstruction } from "./instructions/and.ts";
import { draw, type CoreDrawInstruction } from "./instructions/draw.ts";
import { equal, type CoreEqualInstruction } from "./instructions/equal.ts";
import { forHandler, type CoreForInstruction } from "./instructions/for.ts";
import { get, type CoreGetInstruction } from "./instructions/get.ts";
import { goto, type CoreGotoInstruction } from "./instructions/goto.ts";
import { greater, type CoreGreaterInstruction } from "./instructions/greater.ts";
import { ifHandler, type CoreIfInstruction } from "./instructions/if.ts";
import { less, type CoreLessInstruction } from "./instructions/less.ts";
import { map as flatMap, map, type CoreMapInstruction } from "./instructions/map.ts";
import { multiply, type CoreMultiplyInstruction } from "./instructions/multiply.ts";
import { notEqual, type CoreNotEqualInstruction } from "./instructions/not-equal.ts";
import { not, type CoreNotInstruction } from "./instructions/not.ts";
import { or, type CoreOrInstruction } from "./instructions/or.ts";
import { phase, type CorePhaseInstruction } from "./instructions/phase.ts";
import { player, type CorePlayerInstruction } from "./instructions/player.ts";
import { players, type CorePlayersInstruction } from "./instructions/players.ts";
import { request, type CoreRequestInstruction } from "./instructions/request.ts";
import { response, type CoreResponseInstruction } from "./instructions/response.ts";
import { returnHandler, type CoreReturnInstruction } from "./instructions/return.ts";
import { round, type CoreRoundInstruction } from "./instructions/round.ts";
import { sequence, type CoreSequenceInstruction } from "./instructions/sequence.ts";
import { transfer, type CoreTransferInstruction } from "./instructions/transfer.ts";
import { trigger, type CoreTriggerInstruction } from "./instructions/trigger.ts";
import { turn, type CoreTurnInstruction } from "./instructions/turn.ts";
import { variable, type CoreVariableInstruction } from "./instructions/variable.ts";
import { whileHandler, type CoreWhileInstruction } from "./instructions/while.ts";
import type { CoreResponse } from "./runner.ts";

export type CoreInstruction =
  | CoreAddInstruction
  | CoreAndInstruction
  | CoreEqualInstruction
  | CoreForInstruction
  | CoreGetInstruction
  | CoreGotoInstruction
  | CoreGreaterInstruction
  | CoreIfInstruction
  | CoreLessInstruction
  | CoreMapInstruction
  | CoreMultiplyInstruction
  | CoreNotEqualInstruction
  | CoreNotInstruction
  | CoreDrawInstruction
  | CoreOrInstruction
  | CoreTransferInstruction
  | CorePhaseInstruction
  | CorePlayerInstruction
  | CorePlayersInstruction
  | CoreTriggerInstruction
  | CoreRequestInstruction
  | CoreResponseInstruction
  | CoreReturnInstruction
  | CoreRoundInstruction
  | CoreSequenceInstruction
  | CoreTurnInstruction
  | CoreVariableInstruction
  | CoreWhileInstruction;

export type CoreInstructionOrLiteral = string | number | boolean | CoreInstruction;

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
