// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import withFirestore from "../shared/withFirestore";
import { teamDraftPlace } from "../redux/team";
import Header from "./header";
import Player from "./player";
import DraftSlot from "./draftSlot";

import type { TeamState } from "../redux/team";
import type { Player as PlayerType } from "../shared/player";
import type { Role } from "../shared/roles";

type Roster = {
  [index: string]: PlayerType | null
};

type RosterSlots = {
  [index: string]: Role
};

type Props = TeamState & {
  drafting: boolean,
  roster: Roster,
  rosterSlots: RosterSlots,
  draftPlace: typeof teamDraftPlace
};

const mergeDrafted = (roster: Roster, rosterSlots: RosterSlots) =>
  Object.entries(rosterSlots).reduce(
    (accum, [key, value]) => [...accum, roster[key] ? roster[key] : value],
    []
  );

const Team = ({ drafting, draftPlace, roster, rosterSlots }: Props) => (
  <div>
    <Header title="My Team" />
    <div className="slots-wrapper">
      {mergeDrafted(roster, rosterSlots).map((value, index) =>
        value === "Offense" ||
        value === "Tank" ||
        value === "Support" ||
        value === "Flex" ? (
          <DraftSlot
            key={`${index + 1}`}
            role={value}
            onClick={drafting ? () => draftPlace(index) : () => {}}
          />
        ) : (
          <Player key={value.id} {...value} />
        )
      )}
    </div>
    <style jsx>{`
      .slots-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        margin: 25px;
      }
    `}</style>
  </div>
);

const mapStateToProps = ({ firestore, team, user: { uid } }) => {
  const rosterSlots = get(firestore.data, "leagues.first.rosterSlots", {});
  const drafter = get(firestore.data, "leagues.first.drafter", "");

  return {
    ...team,
    drafting: drafter === uid,
    rosterSlots
  };
};

const mapDispatchProps = {
  draftPlace: teamDraftPlace
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchProps
  ),
  withFirestore(() => [
    {
      collection: "leagues",
      doc: "first"
    }
  ])
)(Team);
