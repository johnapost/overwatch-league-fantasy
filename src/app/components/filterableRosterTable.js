// @flow

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import get from "lodash/get";
import { Menu, Dropdown, Button, Input, AutoComplete } from "antd";
import RosterTable from "./rosterTable";
import withFirestore from "../shared/withFirestore";
import roles from "../shared/roles";

import type { Player } from "../shared/player";
import type { Team } from "../shared/team";

type Props = {
  playerNames: string[],
  teams: {
    [key: number]: Team
  }
};

type State = {
  filteredPlayerName: string,
  filteredRole: string | null,
  filteredTeamId: number | null
};

const capitalizeFirstChar = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

export class FilterableRosterTableComponent extends Component<Props, State> {
  state = {
    filteredPlayerName: "",
    filteredRole: null,
    filteredTeamId: null
  };

  setPlayerName = (filteredPlayerName: string) => {
    const { playerNames } = this.props;
    this.setState({
      filteredPlayerName
    });

    if (playerNames.find(_playerName => filteredPlayerName === _playerName))
      this.setState({ filteredRole: null, filteredTeamId: null });
  };

  filterPlayerNames = (inputValue: string, option: Object) =>
    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
    -1;

  renderTeamMenu = () => {
    const { teams } = this.props;
    return (
      <Menu>
        <Menu.Item onClick={() => this.setState({ filteredTeamId: null })}>
          All Teams
        </Menu.Item>
        {((Object.entries(teams): any): [string, Team][]).map(
          ([id, { name }]) => (
            <Menu.Item
              key={id}
              onClick={() => this.setState({ filteredTeamId: Number(id) })}
            >
              {name}
            </Menu.Item>
          )
        )}
      </Menu>
    );
  };

  renderPositionMenu = () => (
    <Menu>
      <Menu.Item onClick={() => this.setState({ filteredRole: null })}>
        All Roles
      </Menu.Item>
      {roles.map(filteredRole => (
        <Menu.Item
          key={filteredRole}
          onClick={() => this.setState({ filteredRole })}
        >
          {capitalizeFirstChar(filteredRole)}
        </Menu.Item>
      ))}
    </Menu>
  );

  render() {
    const { playerNames, teams } = this.props;
    const { filteredTeamId, filteredRole, filteredPlayerName } = this.state;

    return [
      <Input.Group>
        <div className="filters">
          <Dropdown
            overlay={this.renderPositionMenu()}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <Button style={{ marginRight: "10px" }}>
              {(filteredRole && capitalizeFirstChar(filteredRole)) ||
                "All Roles"}
            </Button>
          </Dropdown>
          <Dropdown
            overlay={this.renderTeamMenu()}
            placement="bottomLeft"
            trigger={["click"]}
            key="0"
          >
            <Button style={{ marginRight: "10px" }}>
              {filteredTeamId ? teams[filteredTeamId].name : "All Teams"}
            </Button>
          </Dropdown>
          <AutoComplete
            allowClear
            dataSource={playerNames}
            filterOption={this.filterPlayerNames}
            onChange={this.setPlayerName}
            placeholder="Player Name"
          />
        </div>
      </Input.Group>,
      <div className="roster">
        <RosterTable
          filteredPlayerName={filteredPlayerName}
          filteredRole={filteredRole}
          filteredTeamId={filteredTeamId}
        />
      </div>,
      <style jsx>{`
        .filters {
          display: flex;
          justify-content: flex-start;
        }
        .roster {
          max-height: calc(100vh - 138px);
          overflow-y: scroll;
        }
      `}</style>
    ];
  }
}

const mapStateToProps = ({ firestore }) => {
  const teams = get(firestore.data, "teams", {});
  const players = get(firestore.data, "players", {});
  const playerNames = ((Object.values(players): any): Player[]).map(
    ({ name }) => name
  );

  return { teams, playerNames };
};

export default compose(
  connect(mapStateToProps),
  withFirestore(() => [{ collection: "teams" }])
)(FilterableRosterTableComponent);
