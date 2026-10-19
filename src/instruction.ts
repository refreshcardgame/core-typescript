import { Type } from "typebox";
import {
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
import { CORE_OPTION_GENERIC } from "./constants/runner.ts";
import type { CoreEvent } from "./event.ts";
import { CoreGenericRequest, type CoreResponse } from "./runner.ts";
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
  CoreCyclicFlatMapInstruction: Type.Interface(
    [Type.Call(CoreTyped, [CoreFlatMapInstructionType])],
    {
      each: CoreCyclicInstructionOrLiteralRef,
      of: CoreCyclicInstructionRef,
      to: CoreCyclicInstructionOrLiteralRef,
    },
  ),
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
  CoreCyclicMapInstruction: Type.Interface([Type.Call(CoreTyped, [CoreMapInstructionType])], {
    each: CoreCyclicInstructionOrLiteralRef,
    of: CoreCyclicInstructionRef,
    to: CoreCyclicInstructionOrLiteralRef,
  }),
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
    Type.Ref("CoreCyclicFlatMapInstruction"),
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
export type CoreInstructionHandlers = {
  [K in CoreInstruction["type"]]: CoreInstructionHandler<Extract<CoreInstruction, { type: K }>>;
};
