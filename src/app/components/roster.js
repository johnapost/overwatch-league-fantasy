// @flow

import React from "react";
import api from "../shared/api.json";
import Player from "./player";

export default () => (
  <div className="wrapper">
    {api.competitors
      .reduce(
        (accum, { competitor: { players } }) => [...accum, ...players],
        []
      )
      .map(({ player, team }) => <Player {...player} team={team.id} />)}
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
