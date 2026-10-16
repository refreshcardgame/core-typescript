import { capitalize } from "lodash-es";
import type { OverrideProperties } from "type-fest";
import { Type } from "typebox";
import {
  CORE_AFTER_EVENT_PHASE,
  CORE_BEFORE_EVENT_PHASE,
  CORE_EVENT_TYPE,
  CORE_REGISTER_EVENT_PHASE,
  CORE_RESOLVE_EVENT_PHASE,
  CoreAfterPhase,
  CoreBeforePhase,
  CoreEventType,
  CoreRegisterPhase,
  CoreResolvePhase,
} from "./constants/event.ts";
import type { CoreGame } from "./game.ts";
import { CoreInstruction, evaluate } from "./instruction.ts";
import { toRotated } from "./iterator.ts";
import { CoreTypedPayload, isObtainablePayload, toTypedPayload } from "./payload.ts";
import type { CorePlayer } from "./player.ts";
import {
  CoreRequest,
  validateResponse,
  wrapResult,
  type CoreRawResponse,
  type CoreResponse,
  type CoreResponseFields,
  type CoreRunner,
  type CoreRunnerResult,
} from "./runner.ts";
import { CoreNamed } from "./type.ts";

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
  passed: Type.Array(Type.String()),
  pointer: Type.Optional(Type.String()),
  step: Type.Number(),
});
export type CoreEventPriorityData = Type.Static<typeof CoreEventPriorityData>;
export const CoreEventData = Type.Interface([CoreEventPayload, CoreNamed], {
  aliases: Type.Array(Type.String()),
  character: Type.Optional(Type.String()),
  finished: Type.Boolean(),
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

export class CoreEvent implements CoreRunner {
  aliases: Set<string>;
  character?: string;
  game: CoreGame;
  finished: boolean;
  id: string;
  name: string;
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
      phase,
      player,
      priority: { passed, step: priorityStep, pointer } = {},
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
    this.phase = phase ?? CORE_REGISTER_EVENT_PHASE;
    if (typeof player === "string") this.player = player;
    this.priority = { passed: new Set(passed), step: priorityStep ?? 0 };
    if (typeof pointer === "string") this.priority.pointer = pointer;
    this.register = register ?? [];
    this.resolve = resolve ?? [];
    if (typeof result === "boolean") this.result = result;
    this.step = step ?? 0;
    this.timings = timings ?? [];
    this.variables = new Map(Object.entries(variables ?? {}).map(([key, value]) => [key, value]));
  }

  getPlayer(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.player);
  }

  getPriorityPointer(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.priority.pointer);
  }

  getResponse(rawResponse?: CoreRawResponse): CoreResponse {
    const response: CoreResponse = {};

    for (const [player, fields] of Object.entries(this.request ?? {})) {
      const responseFields: CoreResponseFields = (response[player] = {});

      for (const [field, { options }] of Object.entries(fields)) {
        const rawFieldResponse = rawResponse?.[player]?.[field] ?? [];
        responseFields[field] = rawFieldResponse.map((index) => {
          let option = options[index];
          if (isObtainablePayload(option)) option = this.game.state.get(option);
          return option;
        });
      }
    }

    return response;
  }

  getVariable(name: string): unknown {
    const variable = this.variables.get(name);
    return isObtainablePayload(variable) ? this.game.state.get(variable) : variable;
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
    evaluate(this, instruction, response);
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
      const result = this.trigger(this.timings, response);
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

  setVariable(name: string, value?: unknown): unknown {
    if (typeof value === "undefined") this.variables.delete(name);
    else this.variables.set(name, isObtainablePayload(value) ? toTypedPayload(value) : value);
    return value;
  }

  toJSON(): CoreEventData {
    const {
      aliases,
      character,
      finished,
      id,
      name,
      phase,
      player,
      priority: { passed, pointer, step: priorityStep },
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
        passed: passed.values().toArray(),
        step: priorityStep,
      },
      register,
      resolve,
      step,
      timings,
      type,
      variables: Object.fromEntries(variables.entries().map(([key, value]) => [key, value])),
    };
    if (typeof character === "string") data.character = character;
    if (typeof player === "string") data.player = player;
    if (typeof pointer === "string") data.priority.pointer = pointer;
    if (request) data.request = request;
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
        timings = timings.slice();
        this.timings.length = 0;
        this.timings.push(...timings);
        /** @todo */
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
