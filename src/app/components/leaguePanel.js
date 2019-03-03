// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { List } from "antd";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";
import type { User } from "../shared/user";

type Props = {
  id: string,
  users: [string, User][] | null
};

export const LeaguePanelComponent = ({ id, users }: Props) => (
  <List
    bordered
    dataSource={users}
    itemLayout="vertical"
    renderItem={([userId, user]) => (
      <>
        <List.Item key={`${id}-${userId}`}>
          <List.Item.Meta
            title="Team Name"
            description={`Managed by: ${user.displayName}`}
          />
          Roster goes here
        </List.Item>
      </>
    )}
  />
);

const filterLeagueUsers = (
  users: {
    [index: string]: User
  },
  id: string
): [string, User][] | null =>
  (id &&
    users &&
    ((Object.entries(users): any): User[]).reduce(
      (accum, [key, value]) =>
        value.userLeagues.includes(id) ? [...accum, [key, value]] : accum,
      []
    )) ||
  null;

export const mapStateToProps = (
  {
    firestore: {
      data: { users }
    }
  }: StoreState,
  { id }: Props
) => ({
  users: filterLeagueUsers(users, id)
});

export default compose(
  connect(mapStateToProps),
  withFirestore(({ id }) => [
    {
      collection: "users",
      where: [["userLeagues", "array-contains", id]]
    }
  ])
)(LeaguePanelComponent);
