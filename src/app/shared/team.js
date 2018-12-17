// @flow

import type { AbbreviatedNames } from "../components/teamLogo";

export type Team = {
  abbreviatedName: AbbreviatedNames,
  addressCountry: string,
  homeLocation: string,
  id: number,
  name: string,
  owl_division: number,
  primaryColor: string,
  secondaryColor: string
};
