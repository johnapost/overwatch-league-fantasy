// @flow

import type { Role } from "./roles";

export type Player = {
  attributes: {
    heroes: string[],
    player_number: number,
    preferred_slot: string,
    role: Role
  },
  familyName: string,
  givenName: string,
  headshot: string,
  id: string,
  name: string,
  nationality: string,
  teamId: number
};
