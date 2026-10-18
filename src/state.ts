import { DoublyLinkedList, Stack } from "data-structure-typed";
import { capitalize } from "lodash-es";
import { Type } from "typebox";
import { CoreCard, CoreCardData, CoreCardOptions } from "./card.ts";
import { CORE_TURN_EVENT_NAME } from "./constants/event.ts";
import {
  CORE_AFTER_SIDE,
  CORE_BEFORE_SIDE,
  CORE_FIELD_ZONE,
  CORE_VOID_ZONE,
} from "./constants/position.ts";
import { CoreEvent, CoreEventData, CoreEventOptions } from "./event.ts";
import type { CoreGame } from "./game.ts";
import { CoreTuple } from "./math.ts";
import { CoreObject, CoreObjectData, CoreObjectOptions } from "./object.ts";
import { type CoreObtainable, type CoreTypedPayload } from "./payload.ts";
import { CorePlayer, CorePlayerData, CorePlayerOptions } from "./player.ts";
import {
  isSamePosition,
  toPositionData,
  type CoreFieldLocation,
  type CoreObjectIndex,
  type CorePosition,
} from "./position.ts";
import { CoreRandom, CoreRandomData, CoreRandomOptions } from "./random.ts";

export const CoreStateData = Type.Object({
  cards: Type.Record(Type.String(), CoreCardData),
  dimensions: Type.Number(),
  events: Type.Record(Type.String(), CoreEventData),
  field: Type.Record(Type.String(), Type.Array(Type.String())),
  objects: Type.Record(Type.String(), CoreObjectData),
  order: Type.Array(Type.String()),
  players: Type.Record(Type.String(), CorePlayerData),
  random: CoreRandomData,
  stack: Type.Array(Type.String()),
  started: Type.Boolean(),
  void: Type.Array(Type.String()),
});
export type CoreStateData = Type.Static<typeof CoreStateData>;
export const CoreStateOptions = Type.Object({
  cards: Type.Optional(Type.Record(Type.String(), CoreCardOptions)),
  dimensions: Type.Number(),
  events: Type.Optional(Type.Record(Type.String(), CoreEventOptions)),
  field: Type.Optional(Type.Record(Type.String(), Type.Array(Type.String()))),
  objects: Type.Optional(Type.Record(Type.String(), CoreObjectOptions)),
  order: Type.Optional(Type.Array(Type.String())),
  players: Type.Optional(Type.Record(Type.String(), CorePlayerOptions)),
  random: Type.Optional(CoreRandomOptions),
  stack: Type.Optional(Type.Array(Type.String())),
  started: Type.Optional(Type.Boolean()),
  void: Type.Optional(Type.Array(Type.String())),
});
export type CoreStateOptions = Type.Static<typeof CoreStateOptions>;

export class CoreState {
  cards = new Map<string, CoreCard>();
  dimensions: number;
  events = new Map<string, CoreEvent>();
  field: Map<string, DoublyLinkedList<string, string>>;
  game: CoreGame;
  objects = new Map<string, CoreObject>();
  order: DoublyLinkedList<string, string>;
  players = new Map<string, CorePlayer>();
  random: CoreRandom;
  stack: Stack<string, string>;
  started: boolean;
  void: Set<string>;

  constructor(
    game: CoreGame,
    {
      cards,
      dimensions,
      events,
      field,
      objects,
      order,
      players,
      random,
      stack,
      started,
      void: voidZone,
    }: CoreStateOptions,
  ) {
    this.game = game;

    for (const [id, card] of Object.entries(cards ?? {})) {
      this.cards.set(id, new CoreCard(this.game, card));
    }

    for (const [id, object] of Object.entries(objects ?? {})) {
      this.objects.set(id, new CoreObject(this.game, object));
    }

    for (const [id, player] of Object.entries(players ?? {})) {
      this.players.set(id, new CorePlayer(this.game, player));
    }

    for (const [id, event] of Object.entries(events ?? {})) {
      this.events.set(id, new CoreEvent(this.game, event));
    }

    this.dimensions = dimensions;
    this.field = new Map(
      Object.entries(field ?? {}).map(([position, objects]) => [
        position,
        new DoublyLinkedList(objects),
      ]),
    );
    this.order = new DoublyLinkedList(order ?? this.players.keys());
    this.random = new CoreRandom(random);
    this.stack = new Stack(stack);
    this.started = started ?? false;
    this.void = new Set(voidZone);
  }

  get<TObtainable extends CoreObtainable>({
    id,
    type,
  }: CoreTypedPayload<TObtainable["type"]>): TObtainable | undefined {
    return this[`${type}s`]?.get(id) as TObtainable | undefined;
  }

  getAllPlayers(): CorePlayer[] {
    return this.getPlayers(this.order.toArray());
  }

  getCard(id?: string): CoreCard | undefined {
    if (typeof id === "string") return this.cards.get(id);
  }

  getCards(ids: string[] = []): CoreCard[] {
    return ids.map((id) => this.getCard(id)).filter((card) => !!card);
  }

  getCurrentEvent(name?: string): CoreEvent | undefined {
    return typeof name === "string"
      ? this.getEvents(this.stack.elements).findLast(({ name: eventName }) => eventName === name)
      : this.getEvent(this.stack.peek());
  }

  getEvent(id?: string): CoreEvent | undefined {
    if (typeof id === "string") return this.events.get(id);
  }

  getEvents(ids: string[] = []): CoreEvent[] {
    return ids.map((id) => this.getEvent(id)).filter((event) => !!event);
  }

  getField(coordinates: CoreTuple): CoreObject[] {
    return this.getObjects(this.field.get(coordinates.toString())?.toArray());
  }

  getObject(id?: string): CoreObject | undefined {
    if (typeof id === "string") return this.objects.get(id);
  }

  getObjects(ids: string[] = []): CoreObject[] {
    return ids.map((id) => this.getObject(id)).filter((object) => !!object);
  }

  getPlayer(idOrOrdinal?: string | number): CorePlayer | undefined {
    if (typeof idOrOrdinal === "number") return this.getPlayer(this.order.at(idOrOrdinal));
    if (typeof idOrOrdinal === "string") return this.players.get(idOrOrdinal);
  }

  getPlayers(idsOrOrdinals: (string | number)[] = []): CorePlayer[] {
    return idsOrOrdinals
      .map((idOrOrdinal) => this.getPlayer(idOrOrdinal))
      .filter((player) => !!player);
  }

  getTurnPointer(): CorePlayer | undefined {
    return this.getCurrentEvent(CORE_TURN_EVENT_NAME)?.getPlayer();
  }

  getPriorityPointer(): CorePlayer | undefined {
    return this.getEvent(this.stack.peek())?.getPriorityPointer();
  }

  getStartingPointer(): CorePlayer | undefined {
    const id = this.order.head?.value;
    if (id) return this.players.get(id);
  }

  in(
    objects: CoreObject | CoreObject[],
    position: CorePosition,
    index: CoreObjectIndex = { side: CORE_AFTER_SIDE },
  ): number {
    if (!Array.isArray(objects)) objects = [objects];
    const zone = position?.zone;
    if (!zone) return 0;

    switch (zone) {
      case CORE_FIELD_ZONE:
        return this.inField(objects, position, index);

      case CORE_VOID_ZONE:
        return this.inVoid(objects);

      default:
        return position.player.in(objects, position.zone, index);
    }
  }

  inField(
    objects: CoreObject | CoreObject[],
    { coordinates, direction }: CoreFieldLocation,
    { side, target }: CoreObjectIndex = { side: CORE_AFTER_SIDE },
  ): number {
    if (coordinates.getDimensions() !== this.dimensions) return 0;
    if (!Array.isArray(objects)) objects = [objects];

    for (const object of objects) {
      object.position = toPositionData({ coordinates, direction, zone: CORE_FIELD_ZONE });
    }

    const fieldObjects = this.field.get(coordinates.toString());

    if (!fieldObjects) {
      this.field.set(coordinates.toString(), new DoublyLinkedList(objects.map(({ id }) => id)));
      return objects.length;
    }

    for (const object of objects) {
      fieldObjects.delete(object.id);
    }

    if (!target) {
      fieldObjects[`${side === CORE_BEFORE_SIDE ? "unshift" : "push"}Many`](
        objects.map(({ id }) => id),
      );
      return objects.length;
    }

    const node = fieldObjects.getNode(target.id);

    if (!node) {
      fieldObjects[`${side === CORE_BEFORE_SIDE ? "unshift" : "push"}Many`](
        objects.map(({ id }) => id),
      );
      return objects.length;
    }

    if (side === CORE_BEFORE_SIDE)
      for (const { id } of objects) {
        fieldObjects.addBefore(node, id);
      }
    else
      for (const { id } of objects.toReversed()) {
        fieldObjects.addAfter(node, id);
      }

    return objects.length;
  }

  inVoid(objects: CoreObject | CoreObject[]): number {
    if (!Array.isArray(objects)) objects = [objects];
    let count = 0;

    for (const object of objects) {
      if (object.position?.zone === CORE_VOID_ZONE || this.void.has(object.id)) continue;
      object.position = { zone: CORE_VOID_ZONE };
      this.void.add(object.id);
      count++;
    }

    return count;
  }

  out(objects: CoreObject[] | CoreObject): number {
    if (!Array.isArray(objects)) objects = [objects];
    let count = 0;

    for (const object of objects) {
      const zone = object.position?.zone;
      if (!zone) continue;

      switch (zone) {
        case CORE_FIELD_ZONE:
        case CORE_VOID_ZONE:
          count += this[`out${capitalize(zone)}`](object);
          break;

        default:
          count += this.getPlayer(object.position?.player)?.out(object) ?? 0;
          break;
      }
    }

    return count;
  }

  outField(objects: CoreObject[] | CoreObject): number {
    if (!Array.isArray(objects)) objects = [objects];
    let count = 0;

    for (const object of objects) {
      if (object.position?.zone !== CORE_FIELD_ZONE) continue;
      const fieldObjects = this.field.get(object.position.coordinates);
      if (!fieldObjects || !fieldObjects.delete(object.id)) continue;
      if (fieldObjects.isEmpty()) this.field.delete(object.position.coordinates);
      delete object.position;
      count++;
    }

    return count;
  }

  outVoid(objects: CoreObject[] | CoreObject): number {
    if (!Array.isArray(objects)) objects = [objects];
    let count = 0;

    for (const object of objects) {
      if (object.position?.zone !== CORE_VOID_ZONE || !this.void.delete(object.id)) continue;
      delete object.position;
      count++;
    }

    return count;
  }

  run(event: CoreEvent): CoreEvent {
    const { id } = event;
    this.events.set(id, event);
    const parent = this.stack.peek();
    if (typeof parent === "string") event.parent = parent;
    this.stack.push(id);
    return event;
  }

  setCard(card: CoreCard): CoreCard {
    this.cards.set(card.id, card);
    return card;
  }

  setObject(object: CoreObject): CoreObject {
    this.objects.set(object.id, object);
    return object;
  }

  setObjects(objects: CoreObject[]): CoreObject[] {
    for (const object of objects) {
      this.setObject(object);
    }

    return objects;
  }

  toJSON(): CoreStateData {
    const {
      cards,
      dimensions,
      events,
      field,
      objects,
      order,
      players,
      random,
      stack: { elements },
      started,
      void: voidZone,
    } = this;
    const data: CoreStateData = {
      cards: Object.fromEntries(cards.entries().map(([id, card]) => [id, card.toJSON()])),
      dimensions,
      events: Object.fromEntries(events.entries().map(([id, event]) => [id, event.toJSON()])),
      field: Object.fromEntries(
        field.entries().map(([position, objects]) => [position, objects.toArray()]),
      ),
      objects: Object.fromEntries(objects.entries().map(([id, object]) => [id, object.toJSON()])),
      order: order.toArray(),
      players: Object.fromEntries(players.entries().map(([id, player]) => [id, player.toJSON()])),
      random: random.toJSON(),
      stack: elements.slice(),
      started,
      void: voidZone.values().toArray(),
    };
    return data;
  }

  transfer(
    objects: CoreObject | CoreObject[],
    destination: CorePosition,
    index: CoreObjectIndex = { side: CORE_AFTER_SIDE },
  ): number {
    if (!Array.isArray(objects)) objects = [objects];
    const notSamePosition = objects.filter(
      ({ position }) => !isSamePosition(position, destination),
    );
    this.out(notSamePosition);
    const out = new Set(notSamePosition);
    return this.in(
      objects.flatMap((object) =>
        out.has(object) && object.position?.zone !== destination.zone
          ? this.setObjects(object.extract())
          : object,
      ),
      destination,
      index,
    );
  }
}
