// @flow

import React from "react";

export type AbbreviatedNames =
  | "BOS"
  | "DAL"
  | "FLA"
  | "GLA"
  | "HOU"
  | "LDN"
  | "NYE"
  | "PHI"
  | "SEO"
  | "SFS"
  | "SHD"
  | "VAL";

type Props = {
  height?: string,
  team: AbbreviatedNames,
  width?: string
};

const TeamLogo = ({ team, height, width }: Props) => (
  <img src={`static/${team}.svg`} alt={team} height={height} width={width} />
);

TeamLogo.defaultProps = {
  height: "32",
  width: "32"
};

export default TeamLogo;
