// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { List, Icon, Button, Divider } from "antd";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";
import type { User } from "../shared/user";
import type { League } from "../shared/league";

type Props = {
  id: string,
  league: League,
  uid: string,
  users: [string, User][] | null
};

export const LeaguePanelComponent = ({ id, league, uid, users }: Props) => (
  <>
    {uid === league.ownerUser && (
      <Button type="primary">
        <Icon type="user-add" />
        Invite people
      </Button>
    )}
    <Divider />
    {users && (
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
    )}
  </>
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
    },
    user: { uid }
  }: StoreState,
  { id }: Props
) => ({
  users: filterLeagueUsers(users, id),
  uid
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
