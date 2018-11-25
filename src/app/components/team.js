// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./header";
import DraftSlot from "./draftSlot";
import Player from "./player";

import type { TeamState } from "../redux/team";

type Props = TeamState;

class Team extends Component<Props> {
  render() {
    const { slots } = this.props;

    return (
      <div>
        <Header title="My Team" />
        {Object.values(slots).map(slot =>
          typeof slot === "string" ? (
            <DraftSlot role={slot} />
          ) : (
            <Player {...slot} />
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ team: { selectedPlayer, slots } }) => ({
  selectedPlayer,
  slots
});

export default connect(mapStateToProps)(Team);
