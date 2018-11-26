// @flow

import type { Player } from "../shared/player";

// Types
export type TeamState = {
  drafter: string | null,
  selectedPlayer: Player | null,
  roster: {
    [index: string]: Player | null
  }
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

type TeamSetDrafter = {
  type: "SET_DRAFTER",
  uid: number | null
};

type TeamAction =
  | TeamDraftSelect
  | TeamDraftPlace
  | TeamMoveSelect
  | TeamMovePlace
  | TeamSetDrafter;

// Action Creators
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

export const teamSetDrafter = (uid: number | null): TeamSetDrafter => ({
  type: "SET_DRAFTER",
  uid
});

// Reducer
export const defaultState: TeamState = {
  drafter: null,
  selectedPlayer: null,
  roster: {}
};

export default (state: TeamState = defaultState, action: TeamAction) => {
  switch (action.type) {
    case "DRAFT_SELECT":
      return { ...state, selectedPlayer: action.player };
    case "DRAFT_PLACE":
      return {
        ...state,
        selectedPlayer: null,
        roster: {
          ...state.roster,
          [action.toIndex]: state.selectedPlayer
        }
      };
    case "MOVE_SELECT":
      return {
        ...state,
        selectedPlayer: state.roster[`${action.fromIndex}`]
      };
    case "MOVE_PLACE":
      return {
        ...state,
        selectedPlayer: null,
        roster: {
          ...state.roster,
          [Object.keys(state.roster).find(
            key => state.roster[key] === state.selectedPlayer
          )]: null,
          [action.toIndex]: state.selectedPlayer
        }
      };
    case "SET_DRAFTER":
      return {
        ...state,
        drafter: action.uid
      };
    default:
      return state;
  }
};
