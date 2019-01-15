// @flow
/* eslint-disable camelcase */

import type { Stats } from "./player";
import type { Role } from "./roles";

type DerivedStats = Stats & {
  assists_avg_per_10m: number
};

type ScoreWeights = {
  [key: Role]: (DerivedStats) => number
};

const defaultWeighting: ScoreWeights = {
  offense: ({
    assists_avg_per_10m,
    deaths_avg_per_10m,
    final_blows_avg_per_10m,
    hero_damage_avg_per_10m,
    ultimates_earned_avg_per_10m
  }) =>
    final_blows_avg_per_10m * 250 +
    assists_avg_per_10m * 125 -
    deaths_avg_per_10m * 60 +
    hero_damage_avg_per_10m * 0.1 +
    ultimates_earned_avg_per_10m * 50,
  tank: ({
    assists_avg_per_10m,
    deaths_avg_per_10m,
    final_blows_avg_per_10m,
    hero_damage_avg_per_10m,
    ultimates_earned_avg_per_10m
  }) =>
    final_blows_avg_per_10m * 225 +
    assists_avg_per_10m * 200 -
    deaths_avg_per_10m * 30 +
    hero_damage_avg_per_10m * 0.04 +
    ultimates_earned_avg_per_10m * 125,
  support: ({
    assists_avg_per_10m,
    deaths_avg_per_10m,
    final_blows_avg_per_10m,
    healing_avg_per_10m,
    hero_damage_avg_per_10m,
    ultimates_earned_avg_per_10m
  }) =>
    final_blows_avg_per_10m * 90 +
    assists_avg_per_10m * 70 -
    deaths_avg_per_10m * 50 +
    hero_damage_avg_per_10m / 10 +
    healing_avg_per_10m / 3.5 +
    ultimates_earned_avg_per_10m * 175,
  flex: ({
    deaths_avg_per_10m,
    eliminations_avg_per_10m,
    healing_avg_per_10m,
    hero_damage_avg_per_10m,
    ultimates_earned_avg_per_10m
  }) =>
    eliminations_avg_per_10m * 120 -
    deaths_avg_per_10m * 60 +
    hero_damage_avg_per_10m / 5 +
    healing_avg_per_10m / 5 +
    ultimates_earned_avg_per_10m * 100
};

export default (stats: Stats, role: Role): number => {
  const assists_avg_per_10m =
    stats.eliminations_avg_per_10m - stats.final_blows_avg_per_10m;

  const score = defaultWeighting[role]({
    ...stats,
    assists_avg_per_10m
  }).toFixed(0);

  return Number(score);
};
