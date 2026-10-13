import { Type } from "typebox";
import { CoreColor } from "./color.ts";
import { CORE_CARD_TYPE, CoreCardType } from "./constants/card.ts";
import type { CoreGame } from "./game.ts";
import type { CoreObject } from "./object.ts";
import { CoreTypedPayload } from "./payload.ts";
import type { CorePlayer } from "./player.ts";
import { CoreNamed } from "./type.ts";

export const CoreCardPayload = Type.Call(CoreTypedPayload, [CoreCardType]);
export type CoreCardPayload = Type.Static<typeof CoreCardPayload>;
export const CoreCardInformation = Type.Interface([CoreNamed], {
  attack: Type.Optional(Type.Number()),
  colors: Type.Array(CoreColor),
  defense: Type.Optional(Type.Number()),
  owner: Type.Optional(Type.String()),
  types: Type.Array(Type.String()),
});
export type CoreCardInformation = Type.Static<typeof CoreCardInformation>;
export const CoreCardData = Type.Interface([CoreCardPayload, CoreCardInformation], {
  object: Type.Optional(Type.String()),
});
export type CoreCardData = Type.Static<typeof CoreCardData>;
export const CoreCardOptions = Type.Intersect([
  Type.Partial(Type.Omit(CoreCardData, ["name"])),
  CoreNamed,
]);
export type CoreCardOptions = Type.Static<typeof CoreCardOptions>;

export class CoreCard {
  attack?: number;
  colors: CoreColor[];
  defense?: number;
  game: CoreGame;
  id: string;
  name: string;
  object?: string;
  owner?: string;
  type = CORE_CARD_TYPE;
  types: string[];

  constructor(
    game: CoreGame,
    { attack, colors, defense, id, name, object, owner, types }: CoreCardOptions,
  ) {
    this.game = game;
    this.name = name;
    this.id = id ?? this.game.state.random.generateID(this.type, name);
    if (typeof attack === "number") this.attack = attack;
    this.colors = colors ?? [];
    if (typeof defense === "number") this.defense = defense;
    if (typeof object === "string") this.object = object;
    if (typeof owner === "string") this.owner = owner;
    this.types = types ?? [];
  }

  getObject(): CoreObject | undefined {
    return this.game.state.getObject(this.object);
  }

  getOwner(): CorePlayer | undefined {
    return this.game.state.getPlayer(this.owner);
  }

  toJSON(): CoreCardData {
    const { attack, colors, defense, id, name, object, owner, type, types } = this;
    const data: CoreCardData = { colors, id, name, type, types };
    if (typeof attack === "number") data.attack = attack;
    if (typeof defense === "number") data.defense = defense;
    if (typeof object === "string") data.object = object;
    if (typeof owner === "string") data.owner = owner;
    return data;
  }
}
