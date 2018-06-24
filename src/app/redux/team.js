// @flow

import type { Roles } from "../shared/roles";
import type { Player } from "../shared/player";

// Types
type TeamState = {
  slots: [Player, Roles][]
};

type TeamSetSlots = {
  type: "SET_SLOTS",
  slots: string[]
};

type TeamDraft = {
  type: "DRAFT",
  player: Player,
  toIndex: number
};

type TeamMove = {
  type: "MOVE",
  fromIndex: number,
  player: Player,
  toIndex: number
};

type TeamAction = TeamSetSlots | TeamDraft | TeamMove;

// Action Creators
export const teamSetSlots = (slots: string[]): TeamSetSlots => ({
  type: "SET_SLOTS",
  slots
});

export const teamDraft = (player: Player, toIndex: number): TeamDraft => ({
  type: "DRAFT",
  player,
  toIndex
});

export const teamMove = (
  player: Player,
  fromIndex: number,
  toIndex: number
): TeamDraft => ({
  type: "DRAFT",
  fromIndex,
  player,
  toIndex
});

// Reducer
const defaultState: TeamState = { slots: [] };

export default (state: TeamState = defaultState, action: TeamAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
