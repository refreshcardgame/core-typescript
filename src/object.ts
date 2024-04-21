import type { SetRequired } from "type-fest";
import type { CoreCard, CoreCardInformation } from "./card.ts";
import type { CoreColor } from "./color.ts";
import { CORE_OBJECT_TYPE, type CoreObjectType } from "./constants/object.ts";
import type { CoreGame } from "./game.ts";
import type { CoreTypedPayload } from "./payload.ts";
import type { CorePositionData } from "./position.ts";

export type CoreObjectPayload = CoreTypedPayload<CoreObjectType>;

export interface CoreObjectInformation extends CoreCardInformation {
  cards: string[];
  position?: CorePositionData;
}

export interface CoreObjectData extends CoreObjectPayload, CoreObjectInformation {}

export type CoreObjectOptions = SetRequired<Partial<CoreObjectData>, "name">;

export class CoreObject {
  attack?: number;
  cards: string[];
  colors: CoreColor[];
  defense?: number;
  game: CoreGame;
  id: string;
  name: string;
  owner?: string;
  position?: CorePositionData;
  type = CORE_OBJECT_TYPE;
  types: Set<string>;

  constructor(
    game: CoreGame,
    { attack, cards, colors, defense, id, name, owner, position, types }: CoreObjectOptions,
  ) {
    this.game = game;
    this.name = name;
    this.id = id ?? this.game.state.random.generateID(this.type, name);
    if (typeof attack === "number") this.attack = attack;
    this.cards = cards ?? [];
    this.colors = colors ?? [];
    if (typeof defense === "number") this.defense = defense;
    if (typeof owner === "string") this.owner = owner;
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

  extract(): CoreObject[] {
    const objects = this.getCards().map(CoreObject.from);
    this.cards.length = 0;
    return objects;
  }

  getCards(): CoreCard[] {
    return this.game.state.getCards(this.cards);
  }

  toJSON(): CoreObjectData {
    const { attack, cards, colors, defense, id, name, owner, position, type, types } = this;
    const data: CoreObjectData = { cards, colors, id, name, type, types: types.values().toArray() };
    if (typeof attack === "number") data.attack = attack;
    if (typeof defense === "number") data.defense = defense;
    if (position) data.position = position;
    if (typeof owner === "string") data.owner = owner;
    return data;
  }
}
