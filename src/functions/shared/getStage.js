// @flow

import getWeek from "./getWeek";
import schedule from "./schedule";

export default (now: number, season: number): number | null => {
  const {
    seasons: {
      [season]: { stages }
    }
  } = schedule;
  const stage = ((Object.entries(stages): any): [string, Object]).find(kv => {
    const week = getWeek(now, season, Number(kv[0]));
    if (typeof week === "number") return true;
    return false;
  });
  if (stage) return Number(stage[0]);
  return null;
};
