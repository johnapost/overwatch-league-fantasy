// @flow

import type { Role } from "./roles";

export type Stats = {
  deaths_avg_per_10m: number,
  eliminations_avg_per_10m: number,
  final_blows_avg_per_10m: number,
  healing_avg_per_10m: number,
  hero_damage_avg_per_10m: number,
  time_played_total: number,
  ultimates_earned_avg_per_10m: number
};

export type Player = {
  familyName: string,
  givenName: string,
  headshot: string,
  id: string,
  latestStats?: Stats,
  name: string,
  nationality: string,
  role: Role,
  teamId: number
};
