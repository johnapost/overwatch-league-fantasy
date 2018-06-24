// @flow

import React from "react";
import api from "../shared/api.json";
import Player from "./player";

type Props = {
  withTeamId?: number | null,
  withRole: string | null
};

const allPlayers = (): Object[] =>
  api.competitors.reduce(
    (accum, { competitor: { players } }) => [...accum, ...players],
    []
  );

const Roster = ({ withTeamId, withRole }: Props) => (
  <div className="wrapper">
    {allPlayers()
      .filter(({ team }) => (withTeamId ? withTeamId === team.id : true))
      .filter(
        ({
          player: {
            attributes: { role }
          }
        }) => (withRole ? withRole.toLowerCase() === role : true)
      )
      .map(({ player, team }) => (
        <Player {...player} teamId={team.id} key={player.id} />
      ))}
    <style jsx>{`
      .wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
    `}</style>
  </div>
);

Roster.defaultProps = {
  withTeamId: null
};

export default Roster;
