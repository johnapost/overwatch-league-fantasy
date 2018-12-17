// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import withFirestore from "../shared/withFirestore";
import api from "../shared/api.json";
import Player from "./player";
import { teamDraftSelect } from "../redux/team";

import type { Player as PlayerType } from "../shared/player";
import type { Roster } from "../shared/roster";
import type { Team } from "../shared/team";

type Props = {
  drafting: boolean,
  draftSelect: typeof teamDraftSelect,
  filteredPlayerName?: string,
  filteredTeamId?: number | null,
  filteredRole?: string | null,
  roster?: Roster,
  teams: {
    [key: number]: Team
  }
};

const allPlayers = (): Object[] =>
  api.competitors.reduce(
    (accum, { competitor: { players } }) => [...accum, ...players],
    []
  );

const RosterGrid = ({
  drafting,
  draftSelect,
  filteredPlayerName,
  filteredRole,
  filteredTeamId,
  roster,
  teams
}: Props) => (
  <div className="wrapper">
    {allPlayers()
      .filter(({ team }) =>
        filteredTeamId ? filteredTeamId === team.id : true
      )
      .filter(({ player: { attributes: { role } } }) =>
        filteredRole ? filteredRole.toLowerCase() === role : true
      )
      .filter(({ player: { name } }) =>
        filteredPlayerName
          ? name.toLowerCase().indexOf(filteredPlayerName.toLocaleLowerCase()) >
            -1
          : true
      )
      .filter(
        ({ player: { id } }) =>
          !Object.values(roster).some(
            player => player && ((player: any): PlayerType).id === id
          )
      )
      .map(({ player, team }) => {
        const teamAttributes = teams[team.id];
        return (
          <Player
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

const mapStateToProps = ({ firestore, user: { uid }, team: { roster } }) => {
  const drafter = get(firestore.data, "leagues.first.drafter", "");
  const teams = get(firestore.data, "teams", []);

  return {
    drafting: drafter === uid,
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
    }
  ])
)(RosterGrid);
