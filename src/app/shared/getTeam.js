// @flow

import teams from "./teams.json";
import type { AbbreviatedNames } from "../components/teamLogo";

export type Team = {
  abbreviatedName: AbbreviatedNames,
  name: string,
  primaryColor: string,
  secondaryColor: string
};

export default (id: number): Team => teams.find(item => item.id === id);
