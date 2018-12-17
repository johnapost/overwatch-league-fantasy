// @flow

import React from "react";

export type AbbreviatedNames =
  | "ATL"
  | "BOS"
  | "CDH"
  | "DAL"
  | "FLA"
  | "GLA"
  | "GZC"
  | "HOU"
  | "HZS"
  | "LDN"
  | "NYE"
  | "PAR"
  | "PHI"
  | "SEO"
  | "SFS"
  | "SHD"
  | "TOR"
  | "VAL"
  | "VAN"
  | "WAS";

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
