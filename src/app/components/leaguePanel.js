// @flow

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { List, Icon, Button, Divider } from "antd";
import uuid from "uuid/v4";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";
import type { User } from "../shared/user";
import type { League } from "../shared/league";

type Props = {
  firebase: Object,
  firestore: Object,
  id: string,
  league: League,
  uid: string,
  users: [string, User][] | null
};

type State = {
  creatingLink: boolean
};

export class LeaguePanelComponent extends Component<Props, State> {
  state = {
    creatingLink: false
  };

  createLink = async () => {
    const {
      firebase: { firestore: firestoreDep },
      firestore,
      id,
      uid
    } = this.props;

    this.setState({ creatingLink: true });
    await firestore.set(
      { collection: "inviteLinks", doc: uuid() },
      {
        leagueId: id,
        createdBy: uid,
        createdAt: firestoreDep.FieldValue.serverTimestamp()
      }
    );
    // TODO: Display link and allow for copy to clipboard
    // this.setState({ creatingLink: false });
  };

  render() {
    const { id, league, uid, users } = this.props;
    const { creatingLink } = this.state;
    return (
      <>
        {uid === league.ownerUser && (
          <Button
            type="primary"
            disabled={creatingLink}
            onClick={this.createLink}
          >
            <Icon type={creatingLink ? "loading" : "user-add"} />
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
  }
}

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
