// @flow

import React from "react";
import api from "../shared/api.json";
import Player from "./player";

type Props = {
  playerName?: string,
  teamId?: number | null,
  role?: string | null
};

const allPlayers = (): Object[] =>
  api.competitors.reduce(
    (accum, { competitor: { players } }) => [...accum, ...players],
    []
  );

const Roster = ({ teamId, role, playerName }: Props) => (
  <div className="wrapper">
    {allPlayers()
      .filter(({ team }) => (teamId ? teamId === team.id : true))
      .filter(
        ({
          player: {
            attributes: { role: _role }
          }
        }) => (role ? role.toLowerCase() === _role : true)
      )
      .filter(
        ({ player: { name } }) =>
          playerName
            ? name.toLowerCase().indexOf(playerName.toLocaleLowerCase()) > -1
            : true
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
        margin: 25px;
      }
    `}</style>
  </div>
);

Roster.defaultProps = {
  playerName: "",
  teamId: null,
  role: null
};

export default Roster;
