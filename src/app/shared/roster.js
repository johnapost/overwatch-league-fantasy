// @flow

import type { Player } from "./player";

export type Roster = {
  [index: string]: Player | null
};

// Default roster slots
export default [
  "offense",
  "offense",
  "tank",
  "tank",
  "support",
  "support",
  "flex",
  "flex"
];
