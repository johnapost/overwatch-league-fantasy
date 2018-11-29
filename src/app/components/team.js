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

// Merge roster with rosterSlots to mix displays for draft
const mergeDrafted = (roster: Roster, rosterSlots: RosterSlots): any =>
  Object.entries(rosterSlots).reduce(
    (accum, [key, value]) => [
      ...accum,
      // Null roster values are
      roster[key] ? { ...roster[key] } : value
    ],
    []
  );

const Team = ({
  drafting,
  draftPlace,
  roster,
  rosterSlots,
  selectedPlayer
}: Props) => {
  // Creates click handler for each component
  const createOnClick = (index: number) => (role: Role) => (e: Event) => {
    e.preventDefault();
    if (!drafting) return;
    // Guard against duplicates
    if (
      Object.values(roster).some(
        player =>
          player &&
          player.id &&
          selectedPlayer &&
          player.id === selectedPlayer.id
      )
    )
      return;
    if (
      // Otherwise, guard against off-role picks
      selectedPlayer &&
      selectedPlayer.attributes.role !== role &&
      // Flex roles can go wherever they want
      role !== "flex" &&
      selectedPlayer.attributes.role !== "flex"
    )
      return;
    draftPlace(index);
  };

  return (
    <div>
      <Header title="My Team" />
      <div className="slots-wrapper">
        {mergeDrafted(roster, rosterSlots).map((value, index) =>
          typeof value === "string" ? (
            <DraftSlot
              key={`${index + 1}`}
              role={value}
              onClick={createOnClick(index)(value)}
            />
          ) : (
            <Player key={value.id} onClick={createOnClick(index)} {...value} />
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
};

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
