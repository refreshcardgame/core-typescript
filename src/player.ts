import { DoublyLinkedList } from "data-structure-typed";
import { Type } from "typebox";
import {
  CORE_INITIAL_PLAYER_INTEGRITY,
  CORE_PLAYER_TYPE,
  CorePlayerType,
} from "./constants/player.ts";
import {
  CORE_AFTER_SIDE,
  CORE_BEFORE_SIDE,
  CORE_DECK_ZONE,
  CORE_EXTRA_ZONE,
  CORE_HAND_ZONE,
  CORE_RECYCLE_ZONE,
} from "./constants/position.ts";
import { CoreEvent, type CoreEventOptions } from "./event.ts";
import endPhase from "./events/phases/end.json" with { type: "json" };
import mainPhase from "./events/phases/main.json" with { type: "json" };
import startPhase from "./events/phases/start.json" with { type: "json" };
import turn from "./events/turn.json" with { type: "json" };
import type { CoreGame } from "./game.ts";
import type { CoreObject } from "./object.ts";
import { CoreTypedPayload } from "./payload.ts";
import { toPositionData, type CoreObjectIndex, type CorePlayerZone } from "./position.ts";

export const CorePlayerPayload = Type.Call(CoreTypedPayload, [CorePlayerType]);
export type CorePlayerPayload = Type.Static<typeof CorePlayerPayload>;
export const CorePlayerStarting = Type.Object({
  characters: Type.Array(Type.Number()),
  deck: Type.Array(Type.String()),
  extra: Type.Array(Type.String()),
});
export type CorePlayerStarting = Type.Static<typeof CorePlayerStarting>;
export const CorePlayerData = Type.Interface([CorePlayerPayload], {
  characters: Type.Array(Type.String()),
  deck: Type.Array(Type.String()),
  extra: Type.Array(Type.String()),
  hand: Type.Array(Type.String()),
  integrity: Type.Number(),
  recycle: Type.Array(Type.String()),
  starting: CorePlayerStarting,
});
export type CorePlayerData = Type.Static<typeof CorePlayerData>;
export const CorePlayerOptions = Type.Intersect([
  Type.Partial(Type.Omit(CorePlayerData, ["id", "starting"])),
  Type.Pick(CorePlayerData, ["id", "starting"]),
]);
export type CorePlayerOptions = Type.Static<typeof CorePlayerOptions>;

export class CorePlayer {
  characters: string[];
  deck: DoublyLinkedList<string, string>;
  extra: DoublyLinkedList<string, string>;
  game: CoreGame;
  hand: DoublyLinkedList<string, string>;
  id: string;
  integrity: number;
  recycle: DoublyLinkedList<string, string>;
  starting: CorePlayerStarting;
  type = CORE_PLAYER_TYPE;

  constructor(
    game: CoreGame,
    { characters, deck, extra, hand, id, integrity, recycle, starting }: CorePlayerOptions,
  ) {
    this.game = game;
    this.id = id;
    this.characters = characters ?? [];
    this.deck = new DoublyLinkedList(deck);
    this.extra = new DoublyLinkedList(extra);
    this.hand = new DoublyLinkedList(hand);
    this.integrity = integrity ?? CORE_INITIAL_PLAYER_INTEGRITY;
    this.recycle = new DoublyLinkedList(recycle);
    this.starting = starting;
  }

  endPhase(): CoreEvent {
    const options: CoreEventOptions = { ...endPhase, player: this.id };
    return this.game.state.run(new CoreEvent(this.game, options));
  }

  getCharacter(index?: number): CoreObject | undefined {
    if (typeof index === "number") return this.game.state.getObject(this.characters[index]);
  }

  getMainCharacter(): CoreObject | undefined {
    return this.game.state.getObject(this.characters[0]);
  }

  getNext(): CorePlayer | undefined {
    return this.game.state.getPlayer(
      (this.game.state.order.getNode(this.id)?.next ?? this.game.state.order.head)?.value,
    );
  }

  getPrevious(): CorePlayer | undefined {
    return this.game.state.getPlayer(
      (this.game.state.order.getNode(this.id)?.prev ?? this.game.state.order.tail)?.value,
    );
  }

  in(
    objects: CoreObject | CoreObject[],
    zone: CorePlayerZone,
    { side, target }: CoreObjectIndex = { side: CORE_AFTER_SIDE },
  ): number {
    if (!Array.isArray(objects)) objects = [objects];

    for (const object of objects) {
      this[zone].delete(object.id);
      object.position = toPositionData({ player: this, zone });
    }

    if (!target) {
      this[zone][side === CORE_BEFORE_SIDE ? "unshiftMany" : "pushMany"](
        objects.map(({ id }) => id),
      );
      return objects.length;
    }

    const node = this[zone].getNode(target.id);

    if (!node) {
      this[zone][side === CORE_BEFORE_SIDE ? "unshiftMany" : "pushMany"](
        objects.map(({ id }) => id),
      );
      return objects.length;
    }

    if (side === CORE_BEFORE_SIDE)
      for (const { id } of objects) {
        this[zone].addBefore(node, id);
      }
    else
      for (const { id } of objects.toReversed()) {
        this[zone].addAfter(node, id);
      }

    return objects.length;
  }

  mainPhase(): CoreEvent {
    const options: CoreEventOptions = { ...(mainPhase as CoreEventOptions), player: this.id };
    return this.game.state.run(new CoreEvent(this.game, options));
  }

  out(objects: CoreObject | CoreObject[]): number {
    if (!Array.isArray(objects)) objects = [objects];
    let count = 0;

    for (const object of objects) {
      switch (object.position?.zone) {
        case CORE_DECK_ZONE:
        case CORE_EXTRA_ZONE:
        case CORE_HAND_ZONE:
        case CORE_RECYCLE_ZONE:
          if (!this[object.position.zone].delete(object.id)) continue;
          delete object.position;
          count++;
      }
    }

    return count;
  }

  startPhase(): CoreEvent {
    const options: CoreEventOptions = { ...(startPhase as CoreEventOptions), player: this.id };
    return this.game.state.run(new CoreEvent(this.game, options));
  }

  turn(): CoreEvent {
    const options: CoreEventOptions = { ...(turn as CoreEventOptions), player: this.id };
    return this.game.state.run(new CoreEvent(this.game, options));
  }

  toJSON(): CorePlayerData {
    const { characters, deck, extra, hand, id, integrity, recycle, starting, type } = this;
    const data: CorePlayerData = {
      characters,
      deck: deck.toArray(),
      extra: extra.toArray(),
      hand: hand.toArray(),
      id,
      integrity,
      recycle: recycle.toArray(),
      starting,
      type,
    };
    return data;
  }
}
