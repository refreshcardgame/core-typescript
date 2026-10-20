import { DoublyLinkedList } from "data-structure-typed";
import { capitalize, isObject } from "lodash-es";
import type { OverrideProperties } from "type-fest";
import { Type } from "typebox";
import { Compile, Validator } from "typebox/schema";
import {
  CORE_AFTER_EVENT_PHASE,
  CORE_BASIC_ACTIONS,
  CORE_BEFORE_EVENT_PHASE,
  CORE_EVENT_TYPE,
  CORE_REGISTER_EVENT_PHASE,
  CORE_RESOLVE_EVENT_PHASE,
  CORE_ROTATE_ACTION,
  CORE_SIMPLE_BASIC_ACTIONS,
  CoreAfterPhase,
  CoreBeforePhase,
  CoreEventType,
  CoreRegisterPhase,
  CoreResolvePhase,
} from "./constants/event.ts";
import { CORE_HAND_ZONE } from "./constants/position.ts";
import type { CoreGame } from "./game.ts";
import {
  CoreInstruction,
  CoreInstructionOrLiteral,
  type CoreInstructionHandlers,
} from "./instruction.ts";
import { takeRight, toRotated } from "./iterator.ts";
import { CoreTypedPayload, isObtainablePayload } from "./payload.ts";
import type { CorePlayer } from "./player.ts";
import {
  isDestination,
  isDestinationData,
  toDestination,
  type CoreDestination,
} from "./position.ts";
import {
  CoreRequest,
  CoreRequestForm,
  validateResponse,
  wrapResult,
  type CoreRawResponse,
  type CoreResponse,
  type CoreResponseForm,
  type CoreRunner,
  type CoreRunnerResult,
} from "./runner.ts";
import { CoreNamed, isCorePlayer, serialize } from "./type.ts";

export const CoreEventPayload = Type.Call(CoreTypedPayload, [CoreEventType]);
export type CoreEventPayload = Type.Static<typeof CoreEventPayload>;
const CoreEventPhase = Type.Union([
  CoreAfterPhase,
  CoreBeforePhase,
  CoreRegisterPhase,
  CoreResolvePhase,
]);
type CoreEventPhase = Type.Static<typeof CoreEventPhase>;
export const CoreEventPriorityData = Type.Object({
  actions: Type.Array(Type.String()),
  passed: Type.Array(Type.String()),
  pointer: Type.Optional(Type.String()),
  step: Type.Number(),
});
export type CoreEventPriorityData = Type.Static<typeof CoreEventPriorityData>;
export const CoreEventData = Type.Interface([CoreEventPayload, CoreNamed], {
  aliases: Type.Array(Type.String()),
  character: Type.Optional(Type.String()),
  finished: Type.Boolean(),
  parent: Type.Optional(Type.String()),
  phase: CoreEventPhase,
  player: Type.Optional(Type.String()),
  priority: CoreEventPriorityData,
  register: Type.Array(CoreInstruction),
  request: Type.Optional(CoreRequest),
  resolve: Type.Array(CoreInstruction),
  result: Type.Optional(Type.Boolean()),
  step: Type.Number(),
  timings: Type.Array(Type.String()),
  variables: Type.Record(Type.String(), Type.Unknown()),
});
export type CoreEventData = Type.Static<typeof CoreEventData>;
export type CoreEventPriority = OverrideProperties<CoreEventPriorityData, { passed: Set<string> }>;
export const CoreEventOptions = Type.Intersect([
  Type.Partial(
    Type.Interface([Type.Omit(CoreEventData, ["name", "priority", "type"])], {
      priority: Type.Partial(CoreEventPriorityData),
    }),
  ),
  CoreNamed,
]);
export type CoreEventOptions = Type.Static<typeof CoreEventOptions>;
export const CoreEventOptionsValidator: Validator<typeof CoreEventOptions> =
  Compile(CoreEventOptions);
export const basicActions = [CORE_ROTATE_ACTION];

const handlers: CoreInstructionHandlers = {
  add: (event, { left, right }, response) =>
    Number(event.evaluate(left, response)) + Number(event.evaluate(right, response)),
  and: (event, { left, right }, response) =>
    event.evaluate(left, response) && event.evaluate(right, response),
  draw: (event, instruction, response) => {
    if ("player" in instruction) {
      const evaluatedPlayer = event.evaluate(instruction.player, response);
      return (
        isCorePlayer(evaluatedPlayer) &&
        event.game.transfer([
          {
            objects: event.game.state.getObjects(
              takeRight(evaluatedPlayer.deck, Number(event.evaluate(instruction.count, response))),
            ),
            position: { zone: CORE_HAND_ZONE, player: evaluatedPlayer },
          },
        ])
      );
    }

    const evaluatedPlayers = event.evaluate(instruction.players, response);
    if (!Array.isArray(evaluatedPlayers)) return;
    const destinations: CoreDestination[] = [];

    if (typeof instruction.each === "undefined")
      for (const player of evaluatedPlayers.filter(isCorePlayer)) {
        destinations.push({
          objects: event.game.state.getObjects(
            takeRight(player.deck, Number(event.evaluate(instruction.count, response))),
          ),
          position: { zone: CORE_HAND_ZONE, player },
        });
      }
    else {
      const name = String(event.evaluate(instruction.each, response));
      const previous = event.getVariable(name);

      for (const player of evaluatedPlayers.filter(isCorePlayer)) {
        event.setVariable(name, player);
        destinations.push({
          objects: event.game.state.getObjects(
            takeRight(player.deck, Number(event.evaluate(instruction.count, response))),
          ),
          position: { zone: CORE_HAND_ZONE, player },
        });
      }

      event.setVariable(name, previous);
    }

    return event.game.transfer(destinations);
  },
  equal: (event, { left, right }, response) =>
    event.evaluate(left, response) === event.evaluate(right, response),
  flatMap: (event, { each, of, to }, response) => {
    const array = event.evaluate(of, response);
    if (!Array.isArray(array)) return;
    const name = String(event.evaluate(each, response));
    const previous = event.getVariable(name);
    const result = array.flatMap((value) => {
      event.setVariable(name, value);
      return event.evaluate(to, response);
    });
    event.setVariable(name, previous);
    return result;
  },
  for: (event, { each, of, do: doInstruction }, response) => {
    const array = event.evaluate(of, response);
    if (!Array.isArray(array)) return;
    const name = String(event.evaluate(each, response));
    const previous = event.getVariable(name);

    for (const value of array) {
      event.setVariable(name, value);
      if (doInstruction) event.evaluate(doInstruction, response);
    }

    event.setVariable(name, previous);
  },
  get: (event, { property, from }, response) => {
    const evaluatedFrom = event.evaluate(from, response);
    if (!isObject(evaluatedFrom)) return;
    const evaluatedProperty = event.evaluate(property, response);
    if (
      (typeof evaluatedProperty === "string" || typeof evaluatedProperty === "number") &&
      evaluatedProperty in evaluatedFrom
    )
      return event.parse(Reflect.get(evaluatedFrom, evaluatedProperty) as unknown);
  },
  goto: (event, { target }, response) => {
    event.step = Number(event.evaluate(target, response));
  },
  greater: (event, { left, right }, response) =>
    Number(event.evaluate(left, response)) > Number(event.evaluate(right, response)),
  if: (event, { condition, then: thenInstruction, else: elseInstruction }, response) => {
    if (event.evaluate(condition, response)) return event.evaluate(thenInstruction, response);
    if (typeof elseInstruction !== "undefined") return event.evaluate(elseInstruction, response);
  },
  less: (event, { left, right }, response) =>
    Number(event.evaluate(left, response)) < Number(event.evaluate(right, response)),
  map: (event, { each, of, to }, response) => {
    const array = event.evaluate(of, response);
    if (!Array.isArray(array)) return;
    const name = String(event.evaluate(each, response));
    const previous = event.getVariable(name);
    const result = array.map((value) => {
      event.setVariable(name, value);
      return event.evaluate(to, response);
    });
    event.setVariable(name, previous);
    return result;
  },
  multiply: (event, { left, right }, response) =>
    Number(event.evaluate(left, response)) * Number(event.evaluate(right, response)),
  not: (event, { value }, response) => !event.evaluate(value, response),
  notEqual: (event, { left, right }, response) =>
    event.evaluate(left, response) !== event.evaluate(right, response),
  or: (event, { left, right }, response) =>
    // oxlint-disable-next-line typescript/prefer-nullish-coalescing
    event.evaluate(left, response) || event.evaluate(right, response),
  phase: (event, { name, player }, response) => {
    const evaluated = event.evaluate(player, response);
    if (isCorePlayer(evaluated)) return evaluated[`${name}Phase`]();
  },
  player: (event, { index }, response) =>
    typeof index === "undefined"
      ? event.getPlayer()
      : event.game.state.getPlayer(Number(event.evaluate(index, response))),
  players: ({ game: { state } }) => state.getAllPlayers(),
  request: (event, { request }, response) => {
    const evaluatedRequest: CoreRequest = {};

    for (const [player, form] of Object.entries(request)) {
      const requestForm: CoreRequestForm = (evaluatedRequest[player] = {});

      for (const [key, field] of Object.entries(form)) {
        requestForm[key] = {
          ...field,
          options: field.options.map((option) => serialize(event.evaluate(option, response))),
        };
      }
    }

    event.request = evaluatedRequest;
  },
  response: (event, { field, index, player }, response) => {
    const evaluated = event.evaluate(player, response);
    return response?.[isCorePlayer(evaluated) ? evaluated.id : String(evaluated)]?.[
      String(event.evaluate(field, response))
    ]?.[Number(event.evaluate(index, response))];
  },
  return: (event, { value }, response) => {
    event.result = typeof value === "undefined" ? true : Boolean(event.evaluate(value, response));
  },
  round: ({ game }) => game.round(),
  sequence: (event, { instructions }, response) =>
    instructions.reduce<unknown>((_, instruction) => event.evaluate(instruction, response), void 0),
  transfer: (event, { destinations }, response) => {
    const evaluated = event.evaluate(destinations, response);
    if (!Array.isArray(evaluated)) return 0;
    let count = 0;

    for (const { objects, position, index } of evaluated
      .filter(isDestination)
      .filter((destination) => !!destination)) {
      count += event.game.state.transfer(objects, position, index);
    }

    return count;
  },
  trigger: (event, { timings }, response) => {
    if (event.phase === CORE_RESOLVE_EVENT_PHASE)
      return event.trigger(
        timings.map((instruction) => String(event.evaluate(instruction, response))),
        response ?? {},
      );
  },
  turn: (event, { player }, response) => {
    const evaluated = event.evaluate(player, response);
    if (isCorePlayer(evaluated)) return evaluated.turn();
  },
  variable: (event, { name, set }, response) =>
    typeof set === "undefined"
      ? event.getVariable(String(event.evaluate(name, response)))
      : event.setVariable(String(event.evaluate(name, response)), event.evaluate(set, response)),
  while: (event, { condition, do: doInstruction }, response) => {
    while (event.evaluate(condition, response)) {
      if (doInstruction) event.evaluate(doInstruction, response);
    }
  },
};

export class CoreEvent implements CoreRunner {
  aliases: Set<string>;
  character?: string;
  game: CoreGame;
  finished: boolean;
  id: string;
  name: string;
  parent?: string;
  phase: CoreEventPhase;
  player?: string;
  priority: CoreEventPriority;
  register: CoreInstruction[];
  request?: CoreRequest;
  resolve: CoreInstruction[];
  result?: boolean;
  step: number;
  timings: string[];
  type = CORE_EVENT_TYPE;
  variables: Map<string, unknown>;

  constructor(
    game: CoreGame,
    {
      aliases,
      character,
      finished,
      id,
      name,
      parent,
      phase,
      player,
      priority: { actions = [], passed, step: priorityStep, pointer } = {},
      register,
      resolve,
      result,
      step,
      timings,
      variables,
    }: CoreEventOptions,
  ) {
    this.game = game;
    this.name = name;
    this.id = id ?? this.game.state.random.generateID(this.type, name);
    this.aliases = new Set(aliases);
    if (typeof character === "string") this.character = character;
    this.finished = finished ?? false;
    if (typeof parent === "string") this.parent = parent;
    this.phase = phase ?? CORE_REGISTER_EVENT_PHASE;
    if (typeof player === "string") this.player = player;
    this.priority = { actions, passed: new Set(passed), step: priorityStep ?? 0 };
    if (typeof pointer === "string") this.priority.pointer = pointer;
    this.register = register ?? [];
    this.resolve = resolve ?? [];
    if (typeof result === "boolean") this.result = result;
    this.step = step ?? 0;
    this.timings = timings ?? [];
    this.variables = new Map(Object.entries(variables ?? {}).map(([key, value]) => [key, value]));
  }

  evaluate(instruction: CoreInstructionOrLiteral, response?: CoreResponse): unknown {
    return typeof instruction === "string" ||
      typeof instruction === "number" ||
      typeof instruction === "boolean"
      ? instruction
      : handlers[instruction.type]?.(this, instruction as never, response);
  }

  getPlayer(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.player);
  }

  getPriorityPointer(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.priority.pointer);
  }

  getResponse(rawResponse?: CoreRawResponse): CoreResponse {
    const response: CoreResponse = {};

    for (const [player, form] of Object.entries(this.request ?? {})) {
      const responseForm: CoreResponseForm = (response[player] = {});

      for (const [field, { options }] of Object.entries(form)) {
        const rawFieldResponse = rawResponse?.[player]?.[field] ?? [];
        responseForm[field] = rawFieldResponse.map((index) => {
          let option = options[index];
          if (isObtainablePayload(option)) option = this.game.state.get(option);
          return option;
        });
      }
    }

    return response;
  }

  getVariable(name: string): unknown {
    return this.parse(this.variables.get(name));
  }

  next(rawResponse?: CoreRawResponse): CoreRunnerResult {
    if (this.finished) return wrapResult(this.result ?? true);
    if (!validateResponse(this.request, rawResponse)) return wrapResult(this.request);
    const response = this.getResponse(rawResponse);
    delete this.request;
    const result = this[`next${capitalize(this.phase)}`](response);
    return result;
  }

  nextInstruction(instruction: CoreInstruction, response: CoreResponse): CoreRunnerResult {
    this.step++;
    this.evaluate(instruction, response);
    return wrapResult(this.request);
  }

  nextAfter(response: CoreResponse): CoreRunnerResult {
    const timings = this.aliases
      .values()
      .map((alias) => `${CORE_AFTER_EVENT_PHASE}${capitalize(alias)}`)
      .toArray();
    timings.push(`${CORE_AFTER_EVENT_PHASE}${capitalize(this.name)}`);
    const result = this.trigger(timings, response);
    if (!result.done) return result;
    this.finished = true;
    return wrapResult(this.result ?? true);
  }

  nextBefore(response: CoreResponse): CoreRunnerResult {
    const timings = this.aliases
      .values()
      .map((alias) => `${CORE_BEFORE_EVENT_PHASE}${capitalize(alias)}`)
      .toArray();
    timings.push(`${CORE_BEFORE_EVENT_PHASE}${capitalize(this.name)}`);
    const result = this.trigger(timings, response);
    if (!result.done) return result;
    this.phase = CORE_RESOLVE_EVENT_PHASE;
    this.step = 0;
    return wrapResult();
  }

  nextRegister(response: CoreResponse): CoreRunnerResult {
    const instruction = this.register[this.step];

    if (!instruction) {
      this.phase = CORE_BEFORE_EVENT_PHASE;
      this.step = 0;
      return wrapResult();
    }

    const result = this.nextInstruction(instruction, response);

    if (this.result) {
      this.phase = CORE_BEFORE_EVENT_PHASE;
      delete this.result;
      this.step = 0;
      return wrapResult();
    }

    if (typeof this.result === "boolean") {
      this.finished = true;
      return wrapResult(false);
    }

    return result;
  }

  nextResolve(response: CoreResponse): CoreRunnerResult {
    if (this.timings.length) {
      const result = this.trigger(this.timings.slice(), response);
      if (!result.done) return result;
    }

    const instruction = this.resolve[this.step];

    if (!instruction) {
      this.phase = CORE_AFTER_EVENT_PHASE;
      this.result = true;
      this.step = 0;
      return wrapResult();
    }

    const result = this.nextInstruction(instruction, response);

    if (typeof this.result === "boolean") {
      this.phase = CORE_AFTER_EVENT_PHASE;
      this.step = 0;
      return wrapResult();
    }

    return result;
  }

  parse(value: unknown): unknown {
    if (isDestinationData(value)) return toDestination(this.game, value);
    if (isObtainablePayload(value)) return this.game.state.get(value);
    if (Array.isArray(value)) return value.map((v) => this.parse(v));
    return value;
  }

  setVariable(name: string, value?: unknown): unknown {
    if (typeof value === "undefined") this.variables.delete(name);
    else this.variables.set(name, serialize(value));
    return value;
  }

  toJSON(): CoreEventData {
    const {
      aliases,
      character,
      finished,
      id,
      name,
      parent,
      phase,
      player,
      priority: { actions, passed, pointer, step: priorityStep },
      register,
      request,
      resolve,
      result,
      step,
      timings,
      type,
      variables,
    } = this;
    const data: CoreEventData = {
      aliases: aliases.values().toArray(),
      finished,
      id,
      name,
      phase,
      priority: {
        actions: actions.slice(),
        passed: passed.values().toArray(),
        step: priorityStep,
      },
      register: structuredClone(register),
      resolve: structuredClone(resolve),
      step,
      timings: timings.slice(),
      type,
      variables: Object.fromEntries(variables.entries().map(([key, value]) => [key, value])),
    };
    if (typeof character === "string") data.character = character;
    if (typeof parent === "string") data.parent = parent;
    if (typeof player === "string") data.player = player;
    if (typeof pointer === "string") data.priority.pointer = pointer;
    if (request) data.request = structuredClone(request);
    if (typeof result === "boolean") data.result = result;
    return data;
  }

  trigger(timings: string[], response: CoreResponse): CoreRunnerResult {
    if (!this.priority.pointer) {
      const firstPriorityPointer =
        this.game.state.getTurnPointer() ?? this.game.state.getStartingPointer();
      if (!firstPriorityPointer) return wrapResult(false);
      this.priority.pointer = firstPriorityPointer.id;
    }

    switch (this.priority.step) {
      case 0: {
        const nextPriorityPointer = toRotated(
          this.game.state.order,
          this.priority.passed.values().find(Boolean) ?? this.priority.pointer,
        ).find((player) => !this.priority.passed.has(player));

        if (!nextPriorityPointer) {
          delete this.priority.pointer;
          this.priority.passed.clear();
          this.timings.length = 0;
          return wrapResult(true);
        }

        this.priority.pointer = nextPriorityPointer;
        this.timings.length = 0;
        this.timings.push(...timings);
        /** @todo */
        const available = new DoublyLinkedList<string, string>(
          this.game.state.dimensions > 1 ? CORE_BASIC_ACTIONS : CORE_SIMPLE_BASIC_ACTIONS,
        );

        for (const action of this.priority.actions) {
          available.delete(action);
        }

        this.priority.step++;
        return wrapResult(this.request);
      }

      case 1: {
        /** @todo */
        this.priority.passed.add(this.priority.pointer);
        this.priority.step = 0;
        return this.trigger(timings, response);
      }
    }

    return wrapResult();
  }
}
