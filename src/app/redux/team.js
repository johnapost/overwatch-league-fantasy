// @flow

import type { Roles } from "../shared/roles";
import type { Player } from "../shared/player";

// Types
type TeamState = {
  selectedPlayer: Player | null,
  slots: [Player, Roles][]
};

type TeamSetSlots = {
  type: "SET_SLOTS",
  slots: string[]
};

type TeamDraftSelect = {
  type: "DRAFT_SELECT",
  player: Player
};

type TeamDraftPlace = {
  type: "DRAFT_PLACE",
  toIndex: number
};

type TeamMoveSelect = {
  type: "MOVE_SELECT",
  fromIndex: number
};

type TeamMovePlace = {
  type: "MOVE_PLACE",
  toIndex: number
};

type TeamAction =
  | TeamSetSlots
  | TeamDraftSelect
  | TeamDraftPlace
  | TeamMoveSelect
  | TeamMovePlace;

// Action Creators
export const teamSetSlots = (slots: string[]): TeamSetSlots => ({
  type: "SET_SLOTS",
  slots
});

export const teamDraftSelect = (player: Player): TeamDraftSelect => ({
  type: "DRAFT_SELECT",
  player
});

export const teamDraftPlace = (toIndex: number): TeamDraftPlace => ({
  type: "DRAFT_PLACE",
  toIndex
});

export const teamMoveSelect = (fromIndex: number): TeamMoveSelect => ({
  type: "MOVE_SELECT",
  fromIndex
});

export const teamMovePlace = (toIndex: number): TeamMovePlace => ({
  type: "MOVE_PLACE",
  toIndex
});

// Reducer
const defaultState: TeamState = { selectedPlayer: null, slots: [] };

export default (state: TeamState = defaultState, action: TeamAction) => {
  switch (action.type) {
    default:
      return state;
  }
};
