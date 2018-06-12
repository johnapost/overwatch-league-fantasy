// @flow

import { Menu, Dropdown, Button } from "antd";

import React, { Component } from "react";
import Roster from "./roster";
import getTeam from "../shared/getTeam";
import teams from "../shared/teams.json";

type State = {
  teamId: number | null
};

class FilterableRoster extends Component<*, State> {
  state = {
    teamId: null
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => this.setState({ teamId: null })} role="button">
            All Teams
          </a>
        </Menu.Item>
        {teams.map(({ id, name }) => (
          <Menu.Item key={id}>
            <a onClick={() => this.setState({ teamId: id })} role="button">
              {name}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );

    return [
      <Dropdown overlay={menu} placement="topLeft" trigger={["click"]} key="0">
        <Button>
          {this.state.teamId ? getTeam(this.state.teamId).name : "All Teams"}
        </Button>
      </Dropdown>,
      <Roster withTeamId={this.state.teamId} key="1" />
    ];
  }
}

export default FilterableRoster;
