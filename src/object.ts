import { Type } from "typebox";
import { CoreCardInformation, type CoreCard } from "./card.ts";
import type { CoreColor } from "./color.ts";
import { CORE_OBJECT_TYPE, CoreObjectType } from "./constants/object.ts";
import type { CoreGame } from "./game.ts";
import { CoreTypedPayload } from "./payload.ts";
import { CorePositionData } from "./position.ts";
import { CoreNamed } from "./type.ts";

export const CoreObjectPayload = Type.Call(CoreTypedPayload, [CoreObjectType]);
export type CoreObjectPayload = Type.Static<typeof CoreObjectPayload>;
export const CoreObjectInformation = Type.Interface([CoreCardInformation], {
  cards: Type.Array(Type.String()),
  parent: Type.Optional(Type.String()),
  position: Type.Optional(CorePositionData),
});
export type CoreObjectInformation = Type.Static<typeof CoreObjectInformation>;
export const CoreObjectData = Type.Intersect([CoreObjectInformation, CoreObjectPayload]);
export type CoreObjectData = Type.Static<typeof CoreObjectData>;
export const CoreObjectOptions = Type.Intersect([
  Type.Partial(Type.Omit(CoreObjectData, ["name", "type"])),
  CoreNamed,
]);
export type CoreObjectOptions = Type.Static<typeof CoreObjectOptions>;

export class CoreObject {
  attack?: number;
  cards: string[];
  colors: CoreColor[];
  defense?: number;
  game: CoreGame;
  id: string;
  name: string;
  owner?: string;
  parent?: string;
  position?: CorePositionData;
  type = CORE_OBJECT_TYPE;
  types: Set<string>;

  constructor(
    game: CoreGame,
    { attack, cards, colors, defense, id, name, owner, parent, position, types }: CoreObjectOptions,
  ) {
    this.game = game;
    this.name = name;
    this.id = id ?? this.game.state.random.generateID(this.type, name);
    if (typeof attack === "number") this.attack = attack;
    this.cards = cards ?? [];
    this.colors = colors ?? [];
    if (typeof defense === "number") this.defense = defense;
    if (typeof owner === "string") this.owner = owner;
    if (typeof parent === "string") this.parent = parent;
    if (position) this.position = position;
    this.types = new Set(types);
  }

  static from(
    // oxlint-disable-next-line typescript/no-invalid-void-type
    this: void,
    card: CoreCard,
  ): CoreObject {
    const { attack, colors, defense, game, id, name, owner, types } = card;
    const options: CoreObjectOptions = {
      cards: [id],
      colors: colors?.slice() ?? [],
      name,
      types: types?.slice() ?? [],
    };
    if (typeof attack === "number") options.attack = attack;
    if (typeof defense === "number") options.defense = defense;
    if (typeof owner === "string") options.owner = owner;
    const object = new CoreObject(game, options);
    card.object = object.id;
    return object;
  }

  extract(exact = false): CoreObject[] {
    const objects = exact
      ? [new CoreObject(this.game, this.toJSON())]
      : this.getCards().map(CoreObject.from);

    for (const object of objects) {
      object.parent = this.id;
    }

    this.cards.length = 0;
    return objects;
  }

  getCards(): CoreCard[] {
    return this.game.state.getCards(this.cards);
  }

  toJSON(): CoreObjectData {
    const { attack, cards, colors, defense, id, name, owner, parent, position, type, types } = this;
    const data: CoreObjectData = { cards, colors, id, name, type, types: types.values().toArray() };
    if (typeof attack === "number") data.attack = attack;
    if (typeof defense === "number") data.defense = defense;
    if (position) data.position = position;
    if (typeof owner === "string") data.owner = owner;
    if (typeof parent === "string") data.parent = parent;
    return data;
  }
}
