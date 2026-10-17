import { Type } from "typebox";
import { CORE_RESOLVE_EVENT_PHASE } from "./constants/event.ts";
import {
  CORE_FLAT_MAP_INSTRUCTION_TYPE,
  CoreAddInstructionType,
  CoreAndInstructionType,
  CoreDrawInstructionType,
  CoreEndPhaseName,
  CoreEqualInstructionType,
  CoreFlatMapInstructionType,
  CoreForInstructionType,
  CoreGetInstructionType,
  CoreGotoInstructionType,
  CoreGreaterInstructionType,
  CoreIfInstructionType,
  CoreLessInstructionType,
  CoreMainPhaseName,
  CoreMapInstructionType,
  CoreMultiplyInstructionType,
  CoreNotEqualInstructionType,
  CoreNotInstructionType,
  CoreOrInstructionType,
  CorePhaseInstructionType,
  CorePlayerInstructionType,
  CorePlayersInstructionType,
  CoreRequestInstructionType,
  CoreResponseInstructionType,
  CoreReturnInstructionType,
  CoreRoundInstructionType,
  CoreSequenceInstructionType,
  CoreStartPhaseName,
  CoreTransferInstructionType,
  CoreTriggerInstructionType,
  CoreTurnInstructionType,
  CoreVariableInstructionType,
  CoreWhileInstructionType,
} from "./constants/instruction.ts";
import { CORE_HAND_ZONE } from "./constants/position.ts";
import { CORE_OPTION_GENERIC } from "./constants/runner.ts";
import type { CoreEvent } from "./event.ts";
import { takeRight } from "./iterator.ts";
import { isObtainablePayload, toTypedPayload } from "./payload.ts";
import { CorePlayer } from "./player.ts";
import { isDestinationData, toDestination, type CoreDestination } from "./position.ts";
import {
  CoreGenericRequest,
  CoreRequest,
  type CoreRequestForm,
  type CoreResponse,
} from "./runner.ts";
import { CoreTyped } from "./type.ts";

const CoreCyclicInstructionRef = Type.Ref("CoreCyclicInstruction");
const CoreCyclicInstructionOrLiteralRef = Type.Ref("CoreCyclicInstructionOrLiteral");
const CoreInstructionDefs = {
  CoreCyclicAddInstruction: Type.Interface([Type.Call(CoreTyped, [CoreAddInstructionType])], {
    left: CoreCyclicInstructionOrLiteralRef,
    right: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicAndInstruction: Type.Interface([Type.Call(CoreTyped, [CoreAndInstructionType])], {
    left: CoreCyclicInstructionOrLiteralRef,
    right: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicSingleDrawInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreDrawInstructionType])],
    { player: CoreCyclicInstructionRef, count: CoreCyclicInstructionOrLiteralRef },
  ),
  CoreCyclicMultipleDrawInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreDrawInstructionType])],
    {
      players: CoreCyclicInstructionRef,
      each: Type.Optional(CoreCyclicInstructionOrLiteralRef),
      count: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicEqualInstruction: Type.Interface([Type.Call(CoreTyped, [CoreEqualInstructionType])], {
    left: CoreCyclicInstructionOrLiteralRef,
    right: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicForInstruction: Type.Interface([Type.Call(CoreTyped, [CoreForInstructionType])], {
    each: CoreCyclicInstructionOrLiteralRef,
    of: CoreCyclicInstructionRef,
    do: CoreCyclicInstructionRef,
  }),
  CoreCyclicGetInstruction: Type.Interface([Type.Call(CoreTyped, [CoreGetInstructionType])], {
    property: CoreCyclicInstructionOrLiteralRef,
    from: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicGotoInstruction: Type.Interface([Type.Call(CoreTyped, [CoreGotoInstructionType])], {
    target: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicGreaterInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreGreaterInstructionType])],
    {
      left: CoreCyclicInstructionOrLiteralRef,
      right: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicIfInstruction: Type.Interface([Type.Call(CoreTyped, [CoreIfInstructionType])], {
    condition: CoreCyclicInstructionOrLiteralRef,
    then: CoreCyclicInstructionOrLiteralRef,
    else: Type.Optional(CoreCyclicInstructionOrLiteralRef),
  }),
  CoreCyclicLessInstruction: Type.Interface([Type.Call(CoreTyped, [CoreLessInstructionType])], {
    left: CoreCyclicInstructionOrLiteralRef,
    right: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicMapInstruction: Type.Interface(
    [Type.Call(CoreTyped, [Type.Union([CoreFlatMapInstructionType, CoreMapInstructionType])])],
    {
      each: CoreCyclicInstructionOrLiteralRef,
      of: CoreCyclicInstructionRef,
      to: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicMultiplyInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreMultiplyInstructionType])],
    {
      left: CoreCyclicInstructionOrLiteralRef,
      right: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicNotEqualInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreNotEqualInstructionType])],
    {
      left: CoreCyclicInstructionOrLiteralRef,
      right: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicNotInstruction: Type.Interface([Type.Call(CoreTyped, [CoreNotInstructionType])], {
    value: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicOrInstruction: Type.Interface([Type.Call(CoreTyped, [CoreOrInstructionType])], {
    left: CoreCyclicInstructionOrLiteralRef,
    right: CoreCyclicInstructionOrLiteralRef,
  }),
  CoreCyclicPhaseInstruction: Type.Interface([Type.Call(CoreTyped, [CorePhaseInstructionType])], {
    name: Type.Union([CoreEndPhaseName, CoreMainPhaseName, CoreStartPhaseName]),
    player: CoreCyclicInstructionRef,
  }),
  CoreCyclicPlayerInstruction: Type.Interface([Type.Call(CoreTyped, [CorePlayerInstructionType])], {
    index: Type.Optional(CoreCyclicInstructionOrLiteralRef),
  }),
  CoreCyclicPlayersInstruction: Type.Call(CoreTyped, [CorePlayersInstructionType]),
  CoreCyclicRequestInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreRequestInstructionType])],
    {
      request: Type.Instantiate(
        { [CORE_OPTION_GENERIC]: CoreCyclicInstructionOrLiteralRef },
        CoreGenericRequest,
      ),
    },
  ),
  CoreCyclicResponseInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreResponseInstructionType])],
    {
      player: CoreCyclicInstructionOrLiteralRef,
      field: CoreCyclicInstructionOrLiteralRef,
      index: CoreCyclicInstructionOrLiteralRef,
    },
  ),
  CoreCyclicReturnInstruction: Type.Interface([Type.Call(CoreTyped, [CoreReturnInstructionType])], {
    value: Type.Optional(CoreCyclicInstructionOrLiteralRef),
  }),
  CoreCyclicRoundInstruction: Type.Call(CoreTyped, [CoreRoundInstructionType]),
  CoreCyclicSequenceInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreSequenceInstructionType])],
    { instructions: Type.Array(CoreCyclicInstructionOrLiteralRef) },
  ),
  CoreCyclicTransferInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreTransferInstructionType])],
    { destinations: CoreCyclicInstructionRef },
  ),
  CoreCyclicTriggerInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreTriggerInstructionType])],
    { timings: Type.Array(CoreCyclicInstructionOrLiteralRef) },
  ),
  CoreCyclicTurnInstruction: Type.Interface([Type.Call(CoreTyped, [CoreTurnInstructionType])], {
    player: CoreCyclicInstructionRef,
  }),
  CoreCyclicVariableInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreVariableInstructionType])],
    {
      name: CoreCyclicInstructionOrLiteralRef,
      set: Type.Optional(CoreCyclicInstructionOrLiteralRef),
    },
  ),
  CoreCyclicWhileInstruction: Type.Interface([Type.Call(CoreTyped, [CoreWhileInstructionType])], {
    condition: CoreCyclicInstructionRef,
    do: Type.Optional(CoreCyclicInstructionRef),
  }),
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
    CoreCyclicInstructionRef,
  ]),
} satisfies Type.TProperties;
const CoreSingleDrawInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicSingleDrawInstruction",
);
const CoreMultipleDrawInstruction = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicMultipleDrawInstruction",
);
const CoreDrawInstruction = Type.Union([CoreSingleDrawInstruction, CoreMultipleDrawInstruction]);
type CoreDrawInstruction = Type.Static<typeof CoreDrawInstruction>;
const CoreAddInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicAddInstruction");
type CoreAddInstruction = Type.Static<typeof CoreAddInstruction>;
const CoreAndInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicAndInstruction");
type CoreAndInstruction = Type.Static<typeof CoreAndInstruction>;
const CoreEqualInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicEqualInstruction");
type CoreEqualInstruction = Type.Static<typeof CoreEqualInstruction>;
const CoreForInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicForInstruction");
type CoreForInstruction = Type.Static<typeof CoreForInstruction>;
const CoreGetInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicGetInstruction");
type CoreGetInstruction = Type.Static<typeof CoreGetInstruction>;
const CoreGotoInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicGotoInstruction");
type CoreGotoInstruction = Type.Static<typeof CoreGotoInstruction>;
const CoreGreaterInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicGreaterInstruction");
type CoreGreaterInstruction = Type.Static<typeof CoreGreaterInstruction>;
const CoreIfInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicIfInstruction");
type CoreIfInstruction = Type.Static<typeof CoreIfInstruction>;
const CoreLessInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicLessInstruction");
type CoreLessInstruction = Type.Static<typeof CoreLessInstruction>;
const CoreMapInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicMapInstruction");
type CoreMapInstruction = Type.Static<typeof CoreMapInstruction>;
const CoreMultiplyInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicMultiplyInstruction");
type CoreMultiplyInstruction = Type.Static<typeof CoreMultiplyInstruction>;
const CoreNotEqualInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicNotEqualInstruction");
type CoreNotEqualInstruction = Type.Static<typeof CoreNotEqualInstruction>;
const CoreNotInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicNotInstruction");
type CoreNotInstruction = Type.Static<typeof CoreNotInstruction>;
const CoreOrInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicOrInstruction");
type CoreOrInstruction = Type.Static<typeof CoreOrInstruction>;
const CorePhaseInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicPhaseInstruction");
type CorePhaseInstruction = Type.Static<typeof CorePhaseInstruction>;
const CorePlayerInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicPlayerInstruction");
type CorePlayerInstruction = Type.Static<typeof CorePlayerInstruction>;
const CorePlayersInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicPlayersInstruction");
type CorePlayersInstruction = Type.Static<typeof CorePlayersInstruction>;
const CoreRequestInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicRequestInstruction");
type CoreRequestInstruction = Type.Static<typeof CoreRequestInstruction>;
const CoreResponseInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicResponseInstruction");
type CoreResponseInstruction = Type.Static<typeof CoreResponseInstruction>;
const CoreReturnInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicReturnInstruction");
type CoreReturnInstruction = Type.Static<typeof CoreReturnInstruction>;
const CoreRoundInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicRoundInstruction");
type CoreRoundInstruction = Type.Static<typeof CoreRoundInstruction>;
const CoreSequenceInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicSequenceInstruction");
type CoreSequenceInstruction = Type.Static<typeof CoreSequenceInstruction>;
const CoreTransferInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicTransferInstruction");
type CoreTransferInstruction = Type.Static<typeof CoreTransferInstruction>;
const CoreTriggerInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicTriggerInstruction");
type CoreTriggerInstruction = Type.Static<typeof CoreTriggerInstruction>;
const CoreTurnInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicTurnInstruction");
type CoreTurnInstruction = Type.Static<typeof CoreTurnInstruction>;
const CoreVariableInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicVariableInstruction");
type CoreVariableInstruction = Type.Static<typeof CoreVariableInstruction>;
const CoreWhileInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicWhileInstruction");
type CoreWhileInstruction = Type.Static<typeof CoreWhileInstruction>;

export const CoreInstruction = Type.Cyclic(CoreInstructionDefs, "CoreCyclicInstruction");
export type CoreInstruction = Type.Static<typeof CoreInstruction>;
export const CoreInstructionOrLiteral = Type.Cyclic(
  CoreInstructionDefs,
  "CoreCyclicInstructionOrLiteral",
);
export type CoreInstructionOrLiteral = Type.Static<typeof CoreInstructionOrLiteral>;

type CoreInstructionHandler<TInstruction extends CoreInstruction> = (
  event: CoreEvent,
  instruction: TInstruction,
  response?: CoreResponse,
) => unknown;
type CoreInstructionHandlers = {
  [K in CoreInstruction["type"]]: CoreInstructionHandler<Extract<CoreInstruction, { type: K }>>;
};

const add: CoreInstructionHandler<CoreAddInstruction> = (event, { left, right }, response) =>
  Number(evaluate(event, left, response)) + Number(evaluate(event, right, response));
const and: CoreInstructionHandler<CoreAndInstruction> = (event, { left, right }, response) =>
  evaluate(event, left, response) && evaluate(event, right, response);
const draw: CoreInstructionHandler<CoreDrawInstruction> = (event, instruction, response) => {
  if ("player" in instruction) {
    const evaluatedPlayer = evaluate(event, instruction.player, response);
    return (
      evaluatedPlayer instanceof CorePlayer &&
      event.game.transfer([
        {
          objects: event.game.state.getObjects(
            takeRight(evaluatedPlayer.deck, Number(evaluate(event, instruction.count, response))),
          ),
          position: { zone: CORE_HAND_ZONE, player: evaluatedPlayer },
        },
      ])
    );
  }

  const evaluatedPlayers = evaluate(event, instruction.players, response);
  if (!Array.isArray(evaluatedPlayers)) return;
  const destinations: CoreDestination[] = [];

  if (typeof instruction.each === "undefined")
    for (const player of evaluatedPlayers.filter((player) => player instanceof CorePlayer)) {
      destinations.push({
        objects: event.game.state.getObjects(
          takeRight(player.deck, Number(evaluate(event, instruction.count, response))),
        ),
        position: { zone: CORE_HAND_ZONE, player },
      });
    }
  else {
    const name = String(evaluate(event, instruction.each, response));
    const previous = event.getVariable(name);

    for (const player of evaluatedPlayers.filter((player) => player instanceof CorePlayer)) {
      event.setVariable(name, player);
      destinations.push({
        objects: event.game.state.getObjects(
          takeRight(player.deck, Number(evaluate(event, instruction.count, response))),
        ),
        position: { zone: CORE_HAND_ZONE, player },
      });
    }

    event.setVariable(name, previous);
  }

  return event.game.transfer(destinations);
};
const equal: CoreInstructionHandler<CoreEqualInstruction> = (event, { left, right }, response) =>
  evaluate(event, left, response) === evaluate(event, right, response);
const forHandler: CoreInstructionHandler<CoreForInstruction> = (
  event,
  { each, of, do: doInstruction },
  response,
) => {
  const array = evaluate(event, of, response);
  if (!Array.isArray(array)) return;
  const name = String(evaluate(event, each, response));
  const previous = event.getVariable(name);

  for (const value of array) {
    event.setVariable(name, value);
    if (doInstruction) evaluate(event, doInstruction, response);
  }

  event.setVariable(name, previous);
};
function parse(event: CoreEvent, value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => parse(event, v));
  if (isObtainablePayload(value)) return event.game.state.get(value);
  if (typeof value === "object" && value !== null && "zone" in value && "player" in value) {
    return value;
  }
  return value;
}
const get: CoreInstructionHandler<CoreGetInstruction> = (event, { property, from }, response) => {
  const evaluatedFrom = evaluate(event, from, response);
  if (typeof evaluatedFrom !== "object" || evaluatedFrom === null) return;
  const evaluatedProperty = evaluate(event, property, response);
  if (
    (typeof evaluatedProperty === "string" || typeof evaluatedProperty === "number") &&
    evaluatedProperty in evaluatedFrom
  )
    return parse(event, Reflect.get(evaluatedFrom, evaluatedProperty) as unknown);
};
const goto: CoreInstructionHandler<CoreGotoInstruction> = (event, { target }, response) => {
  event.step = Number(evaluate(event, target, response));
};
const greater: CoreInstructionHandler<CoreGreaterInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) > Number(evaluate(event, right, response));
const ifHandler: CoreInstructionHandler<CoreIfInstruction> = (
  event,
  { condition, then: thenInstruction, else: elseInstruction },
  response,
) => {
  if (evaluate(event, condition, response)) return evaluate(event, thenInstruction, response);
  if (typeof elseInstruction !== "undefined") return evaluate(event, elseInstruction, response);
};
const less: CoreInstructionHandler<CoreLessInstruction> = (event, { left, right }, response) =>
  Number(evaluate(event, left, response)) < Number(evaluate(event, right, response));
const map: CoreInstructionHandler<CoreMapInstruction> = (
  event,
  { type, each, of, to },
  response,
) => {
  const array = evaluate(event, of, response);
  if (!Array.isArray(array)) return;
  const name = String(evaluate(event, each, response));
  const previous = event.getVariable(name);
  const result =
    type === CORE_FLAT_MAP_INSTRUCTION_TYPE
      ? array.flatMap((value) => {
          event.setVariable(name, value);
          return evaluate(event, to, response);
        })
      : array.map((value) => {
          event.setVariable(name, value);
          return evaluate(event, to, response);
        });
  event.setVariable(name, previous);
  return result;
};
const multiply: CoreInstructionHandler<CoreMultiplyInstruction> = (
  event,
  { left, right },
  response,
) => Number(evaluate(event, left, response)) * Number(evaluate(event, right, response));
const not: CoreInstructionHandler<CoreNotInstruction> = (event, { value }, response) =>
  !evaluate(event, value, response);
const notEqual: CoreInstructionHandler<CoreNotEqualInstruction> = (
  event,
  { left, right },
  response,
) => evaluate(event, left, response) !== evaluate(event, right, response);
const or: CoreInstructionHandler<CoreOrInstruction> = (event, { left, right }, response) =>
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing
  evaluate(event, left, response) || evaluate(event, right, response);
const phase: CoreInstructionHandler<CorePhaseInstruction> = (event, { name, player }, response) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated[`${name}Phase`]();
};
const player: CoreInstructionHandler<CorePlayerInstruction> = (event, { index }, response) =>
  typeof index === "undefined"
    ? event.getPlayer()
    : event.game.state.getPlayer(Number(evaluate(event, index, response)));
const players: CoreInstructionHandler<CorePlayersInstruction> = ({ game: { state } }) =>
  state.getAllPlayers();
const request: CoreInstructionHandler<CoreRequestInstruction> = (event, { request }, response) => {
  const evaluatedRequest: CoreRequest = {};

  for (const [player, form] of Object.entries(request)) {
    const requestForm: CoreRequestForm = (evaluatedRequest[player] = {});

    for (const [key, field] of Object.entries(form)) {
      requestForm[key] = {
        ...field,
        options: field.options.map((option) => {
          let evaluatedOption = evaluate(event, option, response);
          if (isObtainablePayload(evaluatedOption))
            evaluatedOption = toTypedPayload(evaluatedOption);
          return evaluatedOption;
        }),
      };
    }
  }

  event.request = evaluatedRequest;
};
const response: CoreInstructionHandler<CoreResponseInstruction> = (
  event,
  { field, index, player },
  response,
) => {
  const evaluated = evaluate(event, player, response);
  return response?.[evaluated instanceof CorePlayer ? evaluated.id : String(evaluated)]?.[
    String(evaluate(event, field, response))
  ]?.[Number(evaluate(event, index, response))];
};
const returnHandler: CoreInstructionHandler<CoreReturnInstruction> = (
  event,
  { value },
  response,
) => {
  event.result = typeof value === "undefined" ? true : Boolean(evaluate(event, value, response));
};
const round: CoreInstructionHandler<CoreRoundInstruction> = ({ game }) => game.round();
const sequence: CoreInstructionHandler<CoreSequenceInstruction> = (
  event,
  { instructions },
  response,
) =>
  instructions.reduce<unknown>((_, instruction) => evaluate(event, instruction, response), void 0);
const transfer: CoreInstructionHandler<CoreTransferInstruction> = (
  event,
  { destinations },
  response,
) => {
  const evaluated = evaluate(event, destinations, response);
  if (!Array.isArray(evaluated)) return 0;
  let count = 0;

  for (const { objects, position, index } of evaluated
    .filter(isDestinationData)
    .map((data) => toDestination(event.game, data))
    .filter((destination) => !!destination)) {
    count += event.game.state.transfer(objects, position, index);
  }

  return count;
};
const trigger: CoreInstructionHandler<CoreTriggerInstruction> = (event, { timings }, response) => {
  if (event.phase === CORE_RESOLVE_EVENT_PHASE)
    return event.trigger(
      timings.map((instruction) => String(evaluate(event, instruction, response))),
      response ?? {},
    );
};
const turn: CoreInstructionHandler<CoreTurnInstruction> = (event, { player }, response) => {
  const evaluated = evaluate(event, player, response);
  if (evaluated instanceof CorePlayer) return evaluated.turn();
};
const variable: CoreInstructionHandler<CoreVariableInstruction> = (
  event,
  { name, set },
  response,
) => {
  return typeof set === "undefined"
    ? event.getVariable(String(evaluate(event, name, response)))
    : event.setVariable(String(evaluate(event, name, response)), evaluate(event, set, response));
};
const whileHandler: CoreInstructionHandler<CoreWhileInstruction> = (
  event,
  { condition, do: doInstruction },
  response,
) => {
  while (evaluate(event, condition, response)) {
    if (doInstruction) evaluate(event, doInstruction, response);
  }
};
const handlers: CoreInstructionHandlers = {
  add,
  and,
  draw,
  equal,
  flatMap: map,
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
