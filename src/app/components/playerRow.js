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
      {role && (
        <div className="role">
          <img src={`static/${role}.svg`} alt={role} title={role} />
        </div>
      )}
      <div className="score">3000</div>
      <div className="headshot">
        <img src={headshot} alt={name} title={name} />
      </div>
    </div>
    <div className="name-container">
      {team && team.abbreviatedName && (
        <div className="logo">
          <TeamLogo team={team.abbreviatedName} height="24" width="24" />
        </div>
      )}
      <div className="name">{name}</div>
    </div>
    {latestStats ? (
      <div className="stats">
        <div>{latestStats.eliminations_avg_per_10m.toFixed(2)}</div>
        <div>{latestStats.final_blows_avg_per_10m.toFixed(2)}</div>
        <div>
          {(
            latestStats.eliminations_avg_per_10m -
            latestStats.final_blows_avg_per_10m
          ).toFixed(2)}
        </div>
        <div>{latestStats.deaths_avg_per_10m.toFixed(2)}</div>
        <div>{latestStats.hero_damage_avg_per_10m.toFixed(2)}</div>
        <div>{latestStats.healing_avg_per_10m.toFixed(2)}</div>
        <div>{(latestStats.time_played_total / 3600).toFixed(2)}</div>
      </div>
    ) : (
      <div className="no-stats">No historical stats</div>
    )}
    <style jsx>{`
      .container {
        background: #ffffff;
        box-shadow: 3px 3px 2px rgb(200, 200, 200);
        display: inline-flex;
        margin: 0 0 5px;
        transition: margin 0.15s ease-out;
        position: relative;
      }
      .container:hover {
        margin: 0 0 5px 10px;
        z-index: 1;
      }
      .container > div {
        align-items: center;
        display: flex;
        flex-shrink: 0;
      }
      .profile {
        background-color: #${getColor(team)};
        color: #ffffff;
        left: 0;
        padding: 0 5px;
        position: sticky;
        width: 140px;
        z-index: 3;
      }
      .headshot {
        margin-left: 10px;
      }
      .headshot img {
        height: 40px;
      }
      .score {
        font-size: 1.5rem;
        font-family: "BigNoodleToo";
        margin-left: 5px;
        text-shadow: 1px 1px 2px #000000;
      }
      .role {
        transform: skew(-15deg);
      }
      .role img {
        height: 24px;
        padding: 0 0 0 5px;
      }
      .name-container {
        display: flex;
        width: 225px;
      }
      .name {
        font-size: 1.25rem;
        text-transform: uppercase;
        font-weight: bold;
      }
      .logo {
        padding: 0 0 7px;
        margin: 0 5px;
      }
      .stats {
        font-size: 1.25rem;
      }
      .stats div {
        font-family: "BigNoodleToo";
        font-size: 1.5rem;
        margin-right: 10px;
        width: 150px;
      }
      .no-stats {
        font-family: "BigNoodleToo";
        font-size: 1.5rem;
      }
    `}</style>
  </div>
);
