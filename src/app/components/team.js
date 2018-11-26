// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import withFirestore from "../shared/withFirestore";
import Header from "./header";
import DraftSlot from "./draftSlot";
import Player from "./player";

import type { TeamState } from "../redux/team";
import type { Role } from "../shared/roles";

type Props = TeamState & {
  rosterSlots: {
    [index: string]: Role
  }
};

const Team = ({ rosterSlots }: Props) => (
  <div>
    <Header title="My Team" />
    <div className="slots-wrapper">
      {(Object.entries(rosterSlots): any).map(([key, value]) =>
        typeof value === "object" ? (
          <Player key={key} {...value} />
        ) : (
          <DraftSlot key={key} role={value} />
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

const mapStateToProps = ({ firestore, team: { selectedPlayer } }) => {
  const rosterSlots = get(firestore.data, "leagues.first.rosterSlots", {});

  return {
    selectedPlayer,
    rosterSlots
  };
};

export default compose(
  connect(mapStateToProps),
  withFirestore(() => [
    {
      collection: "leagues",
      doc: "first"
    }
  ])
)(Team);
