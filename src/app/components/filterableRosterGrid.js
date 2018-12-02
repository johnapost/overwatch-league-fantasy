// @flow

import React, { Component } from "react";
import { Menu, Dropdown, Button, Input, AutoComplete } from "antd";
import RosterGrid from "./rosterGrid";
import api from "../shared/api.json";
import getTeam from "../shared/getTeam";
import teams from "../shared/teams.json";
import roles from "../shared/roles";

type State = {
  filteredPlayerName: string,
  playerNames: string[],
  filteredRole: string | null,
  filteredTeamId: number | null
};

const allPlayerNames = api.competitors
  .reduce((accum, { competitor: { players } }) => [...accum, ...players], [])
  .map(({ player: { name } }) => name);

const capitalizeFirstChar = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

class FilterableRosterGrid extends Component<*, State> {
  state = {
    filteredPlayerName: "",
    playerNames: allPlayerNames,
    filteredRole: null,
    filteredTeamId: null
  };

  setPlayerName = (filteredPlayerName: string) => {
    this.setState({
      filteredPlayerName
    });

    if (allPlayerNames.find(_playerName => filteredPlayerName === _playerName))
      this.setState({ filteredRole: null, filteredTeamId: null });
  };

  filterPlayerNames = (inputValue: string, option: Object) =>
    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !==
    -1;

  renderTeamMenu = () => (
    <Menu>
      <Menu.Item onClick={() => this.setState({ filteredTeamId: null })}>
        All Teams
      </Menu.Item>
      {teams.map(({ id, name }) => (
        <Menu.Item
          key={id}
          onClick={() => this.setState({ filteredTeamId: id })}
        >
          {name}
        </Menu.Item>
      ))}
    </Menu>
  );

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
    const {
      filteredTeamId,
      filteredRole,
      filteredPlayerName,
      playerNames
    } = this.state;

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
                {filteredTeamId ? getTeam(filteredTeamId).name : "All Teams"}
              </Button>
            </Dropdown>
            <Dropdown
              overlay={this.renderPositionMenu()}
              placement="bottomLeft"
              trigger={["click"]}
            >
              <Button size="large">
                {(filteredRole && capitalizeFirstChar(filteredRole)) ||
                  "All Roles"}
              </Button>
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
          <RosterGrid
            filteredPlayerName={filteredPlayerName}
            filteredRole={filteredRole}
            filteredTeamId={filteredTeamId}
          />
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
