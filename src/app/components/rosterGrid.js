// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import api from "../shared/api.json";
import Player from "./player";
import { teamDraftSelect } from "../redux/team";

type Props = {
  drafting: boolean,
  draftSelect: typeof teamDraftSelect,
  playerName?: string,
  teamId?: number | null,
  role?: string | null
};

const allPlayers = (): Object[] =>
  api.competitors.reduce(
    (accum, { competitor: { players } }) => [...accum, ...players],
    []
  );

const RosterGrid = ({
  drafting,
  teamId,
  role,
  playerName,
  draftSelect
}: Props) => (
  <div className="wrapper">
    {allPlayers()
      .filter(({ team }) => (teamId ? teamId === team.id : true))
      .filter(({ player: { attributes: { role: _role } } }) =>
        role ? role.toLowerCase() === _role : true
      )
      .filter(({ player: { name } }) =>
        playerName
          ? name.toLowerCase().indexOf(playerName.toLocaleLowerCase()) > -1
          : true
      )
      .map(({ player, team }) => (
        <Player
          {...player}
          teamId={team.id}
          key={player.id}
          onClick={
            drafting
              ? () => draftSelect({ ...player, teamId: team.id })
              : () => {}
          }
        />
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

RosterGrid.defaultProps = {
  playerName: "",
  teamId: null,
  role: null
};

const mapStateToProps = ({ firestore, user: { uid } }) => {
  const drafter = get(firestore.data, "leagues.first.drafter", "");

  return {
    drafting: drafter === uid
  };
};

const mapDispatchProps = {
  draftSelect: teamDraftSelect
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchProps
  )
)(RosterGrid);
