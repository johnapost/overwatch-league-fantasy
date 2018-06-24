// @flow

import React, { Component } from "react";
import { Menu, Dropdown, Button, Input, AutoComplete } from "antd";
import Roster from "./roster";
import api from "../shared/api.json";
import getTeam from "../shared/getTeam";
import teams from "../shared/teams.json";

type State = {
  playerName: string,
  playerNames: string[],
  role: string | null,
  teamId: number | null
};

const roles = ["Offense", "Tank", "Support", "Flex"];

const allPlayerNames = api.competitors
  .reduce((accum, { competitor: { players } }) => [...accum, ...players], [])
  .map(({ player: { name } }) => name);

class FilterableRoster extends Component<*, State> {
  state = {
    playerName: "",
    playerNames: allPlayerNames,
    role: null,
    teamId: null
  };

  setPlayerName = (playerName: string) => {
    this.setState({ playerName });
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
        All Positions
      </Menu.Item>
      {roles.map(role => (
        <Menu.Item key={role} onClick={() => this.setState({ role })}>
          {role}
        </Menu.Item>
      ))}
    </Menu>
  );

  render() {
    return (
      <div>
        <Input.Group>
          <div className="wrapper">
            <Dropdown
              overlay={this.renderTeamMenu()}
              placement="bottomLeft"
              trigger={["click"]}
              key="0"
            >
              <Button size="large">
                {this.state.teamId
                  ? getTeam(this.state.teamId).name
                  : "All Teams"}
              </Button>
            </Dropdown>
            <Dropdown
              overlay={this.renderPositionMenu()}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Button size="large">
                {this.state.role ? this.state.role : "All Positions"}
              </Button>
            </Dropdown>
            <AutoComplete
              allowClear
              dataSource={this.state.playerNames}
              filterOption={this.filterPlayerNames}
              onChange={this.setPlayerName}
              placeholder="Player Name"
              size="large"
            />
          </div>
        </Input.Group>
        <Roster
          playerName={this.state.playerName}
          role={this.state.role}
          teamId={this.state.teamId}
          key="1"
        />
        <style jsx>{`
          .wrapper {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }
}

export default FilterableRoster;
