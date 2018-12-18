// @flow

import React from "react";
import TeamLogo from "./teamLogo";

import type { AbbreviatedName } from "./teamLogo";
import type { Role } from "../shared/roles";
import type { Player } from "../shared/player";

type Props = Player & {
  team?: {
    abbreviatedName: AbbreviatedName,
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
  attributes: { role },
  latestStats
}: Props) => (
  <div className="container" onClick={onClick}>
    <div className="profile">
      <div className="headshot">
        <img src={headshot} alt={name} title={name} />
      </div>
      <div>
        {team && team.abbreviatedName && (
          <div className="logo">
            <TeamLogo team={team.abbreviatedName} height="30" />
          </div>
        )}
        {role && (
          <div className="role">
            <img src={`static/${role}.svg`} alt={role} title={role} />
          </div>
        )}
      </div>
    </div>
    <div>{name}</div>
    {latestStats && <div>{JSON.stringify(latestStats)}</div>}
    <style jsx>{`
      .container {
        display: flex;
      }
      .container > div {
        width: 150px;
        flex-shrink: 0;
      }
      .profile {
        display: flex;
      }
      .headshot {
        background-color: #${getColor(team)};
      }
      .headshot img {
        height: 75px;
      }
      .role img {
        height: 30px;
      }
    `}</style>
  </div>
);
