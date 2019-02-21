// @flow

import schedule from "./schedule";

export default (now: number, season: number, stage: number): number | null => {
  const {
    seasons: {
      [season]: {
        stages: {
          [stage]: { weeks }
        }
      }
    }
  } = schedule;
  const week = (Object.entries(weeks): any).find(
    kv => kv[1].endDate > now && now > kv[1].startDate
  );
  if (week) return Number(week[0]);
  return null;
};
