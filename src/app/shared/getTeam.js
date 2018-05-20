// @flow

import teams from "./teams.json";
import type { AbbreviatedNames } from "../components/teamLogo";

export type Team = {
  abbreviatedName: AbbreviatedNames,
  primaryColor: string,
  secondaryColor: string
};

export default (id: string): Team => teams.find(item => item.id === id);
