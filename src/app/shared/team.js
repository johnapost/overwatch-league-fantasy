// @flow

import type { AbbreviatedName } from "../components/teamLogo";

export type Team = {
  abbreviatedName: AbbreviatedName,
  addressCountry: string,
  homeLocation: string,
  id: number,
  name: string,
  owl_division: number,
  primaryColor: string,
  secondaryColor: string
};
