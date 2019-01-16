// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import withFirestore from "../shared/withFirestore";
import PlayerRow from "./playerRow";
import { teamDraftSelect } from "../redux/team";
import calcScore from "../shared/calcScore";

import type { Player } from "../shared/player";
import type { Roster } from "../shared/roster";
import type { Team } from "../shared/team";

type Props = {
  drafting: boolean,
  draftSelect: typeof teamDraftSelect,
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

const RosterTable = ({
  players,
  drafting,
  draftSelect,
  filteredPlayerName,
  filteredRole,
  filteredTeamId,
  roster,
  teams
}: Props) => (
  <div className="overflow-wrapper">
    <div className="wrapper">
      <div className="header">
        <div>Elims</div>
        <div>Kills</div>
        <div>Assists</div>
        <div>Deaths</div>
        <div>Damage</div>
        <div>Healing</div>
        <div>Hours</div>
        <div>Ults</div>
      </div>
      {((Object.values(players): any): Player[])
        .filter(({ teamId }) =>
          filteredTeamId ? filteredTeamId === teamId : true
        )
        .filter(({ attributes: { role } }) =>
          filteredRole ? filteredRole.toLowerCase() === role : true
        )
        .filter(({ name }) =>
          filteredPlayerName
            ? name
                .toLowerCase()
                .indexOf(filteredPlayerName.toLocaleLowerCase()) > -1
            : true
        )
        .filter(
          ({ id }) =>
            !Object.values(roster).some(
              player => player && ((player: any): Player).id === id
            )
        )
        .map(player => ({
          ...player,
          score: player.latestStats
            ? calcScore(player.latestStats, player.attributes.role)
            : 0
        }))
        .sort((a, b) => b.score - a.score)
        .map(player => {
          const teamAttributes = teams[player.teamId];
          return (
            <PlayerRow
              {...player}
              role={player.attributes.role}
              team={teamAttributes}
              key={player.id}
              onClick={
                drafting
                  ? () => draftSelect({ ...player, team: teamAttributes })
                  : () => {}
              }
            />
          );
        })}
      <style jsx>{`
        .overflow-wrapper {
          overflow: auto;
        }
        .wrapper {
          display: inline-flex;
          flex-direction: column;
          padding: 0 20px 20px 0;
          position: relative;
        }
        .header {
          background: rgba(72, 89, 125, 0.95);
          box-shadow: 3px 3px 2px rgba(72, 89, 125, 0.5);
          color: #ffffff;
          display: flex;
          font-family: "BigNoodleToo";
          font-size: 1.5rem;
          margin: 0 0 5px;
          padding: 0 0 0 365px;
          position: sticky;
          top: 0;
          z-index: 3;
        }
        .header div {
          margin-right: 10px;
          width: 150px;
        }
      `}</style>
    </div>
  </div>
);

RosterTable.defaultProps = {
  filteredPlayerName: "",
  filteredTeamId: null,
  filteredRole: null,
  roster: {}
};

const mapStateToProps = ({ firestore, user: { uid }, team: { roster } }) => {
  const drafter = get(firestore.data, "leagues.first.drafter", "");
  const teams = get(firestore.data, "teams", {});
  const players = get(firestore.data, "players", {});

  return {
    drafting: drafter === uid,
    players,
    roster,
    teams
  };
};

const mapDispatchProps = {
  draftSelect: teamDraftSelect
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchProps
  ),
  withFirestore(() => [
    {
      collection: "teams"
    },
    {
      collection: "players"
    }
  ])
)(RosterTable);
