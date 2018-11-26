// @flow

import React, { Component } from "react";
import { Menu, Dropdown, Button, Input, AutoComplete } from "antd";
import RosterGrid from "./rosterGrid";
import api from "../shared/api.json";
import getTeam from "../shared/getTeam";
import teams from "../shared/teams.json";
import roles from "../shared/roles";

type State = {
  playerName: string,
  playerNames: string[],
  role: string | null,
  teamId: number | null
};

const allPlayerNames = api.competitors
  .reduce((accum, { competitor: { players } }) => [...accum, ...players], [])
  .map(({ player: { name } }) => name);

class FilterableRosterGrid extends Component<*, State> {
  state = {
    playerName: "",
    playerNames: allPlayerNames,
    role: null,
    teamId: null
  };

  setPlayerName = (playerName: string) => {
    this.setState({
      playerName
    });

    if (allPlayerNames.find(_playerName => playerName === _playerName))
      this.setState({ role: null, teamId: null });
  };

  filterPlayerNames = (inputValue: string, option: Object) =>
    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
    -1;

  renderTeamMenu = () => (
    <Menu>
      <Menu.Item onClick={() => this.setState({ teamId: null })}>
        All Teams
      </Menu.Item>
      {teams.map(({ id, name }) => (
        <Menu.Item key={id} onClick={() => this.setState({ teamId: id })}>
          {name}
        </Menu.Item>
      ))}
    </Menu>
  );

  renderPositionMenu = () => (
    <Menu>
      <Menu.Item onClick={() => this.setState({ role: null })}>
        All Roles
      </Menu.Item>
      {roles.map(role => (
        <Menu.Item key={role} onClick={() => this.setState({ role })}>
          {role}
        </Menu.Item>
      ))}
    </Menu>
  );

  render() {
    const { teamId, role, playerName, playerNames } = this.state;

    return (
      <div>
        <Input.Group>
          <div className="filters">
            <Dropdown
              overlay={this.renderTeamMenu()}
              placement="bottomLeft"
              trigger={["click"]}
              key="0"
            >
              <Button size="large">
                {teamId ? getTeam(teamId).name : "All Teams"}
              </Button>
            </Dropdown>
            <Dropdown
              overlay={this.renderPositionMenu()}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Button size="large">{role || "All Roles"}</Button>
            </Dropdown>
            <AutoComplete
              allowClear
              dataSource={playerNames}
              filterOption={this.filterPlayerNames}
              onChange={this.setPlayerName}
              placeholder="Player Name"
              size="large"
            />
          </div>
        </Input.Group>
        <div className="roster">
          <RosterGrid playerName={playerName} role={role} teamId={teamId} />
        </div>
        <style jsx>{`
          .filters {
            display: flex;
            justify-content: center;
          }
          .roster {
            max-height: calc(100vh - 138px);
            overflow-y: scroll;
          }
        `}</style>
      </div>
    );
  }
}

export default FilterableRosterGrid;
