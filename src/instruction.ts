import { Type } from "typebox";
import type { CoreEvent } from "./event.ts";
import { add, CoreRawAddInstruction, type CoreAddInstruction } from "./instructions/add.ts";
import { and, CoreRawAndInstruction, type CoreAndInstruction } from "./instructions/and.ts";
import {
  CoreRawMultipleDrawInstruction,
  CoreRawSingleDrawInstruction,
  draw,
  type CoreDrawInstruction,
} from "./instructions/draw.ts";
import { CoreRawEqualInstruction, equal, type CoreEqualInstruction } from "./instructions/equal.ts";
import { CoreRawForInstruction, forHandler, type CoreForInstruction } from "./instructions/for.ts";
import { CoreRawGetInstruction, get, type CoreGetInstruction } from "./instructions/get.ts";
import { CoreRawGotoInstruction, goto, type CoreGotoInstruction } from "./instructions/goto.ts";
import {
  CoreRawGreaterInstruction,
  greater,
  type CoreGreaterInstruction,
} from "./instructions/greater.ts";
import { CoreRawIfInstruction, ifHandler, type CoreIfInstruction } from "./instructions/if.ts";
import { CoreRawLessInstruction, less, type CoreLessInstruction } from "./instructions/less.ts";
import {
  CoreRawMapInstruction,
  map as flatMap,
  map,
  type CoreMapInstruction,
} from "./instructions/map.ts";
import {
  CoreRawMultiplyInstruction,
  multiply,
  type CoreMultiplyInstruction,
} from "./instructions/multiply.ts";
import {
  CoreRawNotEqualInstruction,
  notEqual,
  type CoreNotEqualInstruction,
} from "./instructions/not-equal.ts";
import { CoreRawNotInstruction, not, type CoreNotInstruction } from "./instructions/not.ts";
import { CoreRawOrInstruction, or, type CoreOrInstruction } from "./instructions/or.ts";
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

export const CoreRawInstructionRef = Type.Ref("CoreRawInstruction");
export const CoreRawInstructionOrLiteralRef = Type.Ref("CoreRawInstructionOrLiteral");
export const CoreInstructionDefs = {
  CoreRawAddInstruction,
  CoreRawAndInstruction,
  CoreRawEqualInstruction,
  CoreRawForInstruction,
  CoreRawGetInstruction,
  CoreRawGotoInstruction,
  CoreRawGreaterInstruction,
  CoreRawIfInstruction,
  CoreRawLessInstruction,
  CoreRawMapInstruction,
  CoreRawMultipleDrawInstruction,
  CoreRawMultiplyInstruction,
  CoreRawNotEqualInstruction,
  CoreRawNotInstruction,
  CoreRawOrInstruction,
  CoreRawSingleDrawInstruction,
  CoreRawInstruction: Type.Union([
    Type.Ref("CoreRawAddInstruction"),
    Type.Ref("CoreRawAndInstruction"),
    Type.Ref("CoreRawEqualInstruction"),
    Type.Ref("CoreRawForInstruction"),
    Type.Ref("CoreRawGetInstruction"),
    Type.Ref("CoreRawGotoInstruction"),
    Type.Ref("CoreRawGreaterInstruction"),
    Type.Ref("CoreRawIfInstruction"),
    Type.Ref("CoreRawLessInstruction"),
    Type.Ref("CoreRawMapInstruction"),
    Type.Ref("CoreRawMultipleDrawInstruction"),
    Type.Ref("CoreRawMultiplyInstruction"),
    Type.Ref("CoreRawNotEqualInstruction"),
    Type.Ref("CoreRawNotInstruction"),
    Type.Ref("CoreRawOrInstruction"),
    Type.Ref("CoreRawSingleDrawInstruction"),
  ]),
  CoreRawInstructionOrLiteral: Type.Union([
    Type.String(),
    Type.Number(),
    Type.Boolean(),
    CoreRawInstructionRef,
  ]),
} satisfies Type.TProperties;
export const CoreInstruction = Type.Cyclic(CoreInstructionDefs, "CoreRawInstruction");
export const CoreInstructionOrLiteral = Type.Cyclic(
  CoreInstructionDefs,
  "CoreRawInstructionOrLiteral",
);
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
