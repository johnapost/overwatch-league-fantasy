// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import withFirestore from "../shared/withFirestore";
import PlayerCard from "./playerCard";

import type { StoreState } from "../shared/makeStore";
import type { Player } from "../shared/player";
import type { Roster } from "../shared/roster";
import type { Team } from "../shared/team";

type Props = {
  filteredPlayerName?: string,
  filteredTeamId?: number | null,
  filteredRole?: string | null,
  players: {
    [key: number]: Player
  },
  roster?: Roster,
  teams: {
    [key: number]: Team
  }
};

const RosterGrid = ({
  players,
  filteredPlayerName,
  filteredRole,
  filteredTeamId,
  roster,
  teams
}: Props) => (
  <div className="wrapper">
    {((Object.values(players): any): Player[])
      .filter(({ teamId }) =>
        filteredTeamId ? filteredTeamId === teamId : true
      )
      .filter(({ attributes: { role } }) =>
        filteredRole ? filteredRole.toLowerCase() === role : true
      )
      .filter(({ name }) =>
        filteredPlayerName
          ? name.toLowerCase().indexOf(filteredPlayerName.toLocaleLowerCase()) >
            -1
          : true
      )
      .filter(
        ({ id }) =>
          !Object.values(roster).some(
            player => player && ((player: any): Player).id === id
          )
      )
      .map(player => {
        const teamAttributes = teams[player.teamId];
        return (
          <PlayerCard
            {...player}
            role={player.attributes.role}
            team={teamAttributes}
            key={player.id}
          />
        );
      })}
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

RosterGrid.defaultProps = {
  filteredPlayerName: "",
  filteredTeamId: null,
  filteredRole: null,
  roster: {}
};

const mapStateToProps = ({ firestore, team: { roster } }: StoreState) => {
  const teams = get(firestore.data, "teams", {});
  const players = get(firestore.data, "players", {});

  return {
    players,
    roster,
    teams
  };
};

export default compose(
  connect(mapStateToProps),
  withFirestore(() => [
    {
      collection: "teams"
    },
    {
      collection: "players"
    }
  ])
)(RosterGrid);
