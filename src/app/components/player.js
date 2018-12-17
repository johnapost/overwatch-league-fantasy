// @flow

import React from "react";
import TeamLogo from "./teamLogo";

import type { AbbreviatedNames } from "./teamLogo";
import type { Role } from "../shared/roles";
import type { Player } from "../shared/player";

type Props = Player & {
  team?: {
    abbreviatedName: AbbreviatedNames,
    primaryColor: string
  },
  onClick?: Function,
  role?: Role
};

const getColor = team =>
  team && team.primaryColor ? team.primaryColor : "ffffff";

export default ({
  team,
  headshot,
  name,
  onClick,
  attributes: { role }
}: Props) => (
  <div className="container" onClick={onClick}>
    <div className="background" />
    <div className="headshot">
      <img src={headshot} alt={name} title={name} />
    </div>
    {team && team.abbreviatedName && (
      <div className="profile">
        <TeamLogo team={team.abbreviatedName} width="24" /> {name}
      </div>
    )}
    {role && (
      <div className="role">
        <img src={`static/${role}.svg`} alt={role} title={role} />
      </div>
    )}
    <style jsx>{`
      .container {
        border: solid 5px #dddde3;
        height: 200px;
        margin: 5px;
        overflow: hidden;
        position: relative;
        transform: skew(-15deg);
        transition: border, transform 0.15s ease-out;
        width: 150px;
      }
      .container:hover {
        border: solid 5px #ffffff;
        transform: scale(1.3) skew(-15deg);
        z-index: 1;
      }
      .background {
        background-color: #${getColor(team)};
        height: 200px;
        left: 0;
        position: absolute;
        top: 0;
        width: 150px;
      }
      .headshot {
        transform: scale(1.5) skew(15deg) translate(-2px, 9px);
      }
      .headshot img {
        display: block;
        height: 150px;
      }
      .role {
        background: #ffffff;
        padding: 2px;
        position: absolute;
        top: 129px;
        left: -2px;
      }
      .role img {
        display: block;
        width: 25px;
      }
      .profile {
        position: relative;
        background: #e8e8eb;
        color: #28354f;
        font-family: "BigNoodleToo";
        font-size: 1.5rem;
        text-align: center;
        text-transform: uppercase;
        transform: skew(15deg) translate(-14px, 7px);
        width: 160px;
        z-index: 2;
      }
    `}</style>
  </div>
);
