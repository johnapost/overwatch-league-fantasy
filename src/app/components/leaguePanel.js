// @flow

import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import clipboardCopy from "clipboard-copy";
import { List, Icon, Button, Divider, Modal, Input, Form } from "antd";
import uuid from "uuid/v4";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";
import type { User } from "../shared/user";
import type { League } from "../shared/league";

type Props = {
  firebase: Object,
  firestore: Object,
  id: string,
  // oldInviteLinks: InviteLink[],
  league: League,
  uid: string,
  users: [string, User][] | null
};

type State = {
  creatingLink: boolean,
  latestInviteLink: string | null,
  modalVisible: boolean
};

export class LeaguePanelComponent extends Component<Props, State> {
  state = {
    creatingLink: false,
    latestInviteLink: null,
    modalVisible: false
  };

  createLink = async () => {
    const {
      firebase: { firestore: firestoreDep },
      firestore,
      id,
      uid
    } = this.props;

    this.setState({ creatingLink: true });
    const inviteLinkId = uuid();
    const newInviteLink = {
      leagueId: id,
      createdBy: uid,
      createdAt: firestoreDep.FieldValue.serverTimestamp()
    };

    await firestore.set(
      { collection: "inviteLinks", doc: inviteLinkId },
      newInviteLink
    );

    // Effectively an async setState
    return new Promise(resolve => {
      this.setState(
        {
          creatingLink: false,
          latestInviteLink: inviteLinkId,
          modalVisible: true
        },
        resolve
      );
    });
  };

  openModal = async () => this.setState({ modalVisible: true });

  closeModal = async () => this.setState({ modalVisible: false });

  renderInviteModal = () => {
    const { league } = this.props;
    const { latestInviteLink, modalVisible } = this.state;
    if (!latestInviteLink || typeof window === "undefined") return null;

    const formattedLink = `${
      window.location.origin
    }/?invite=${latestInviteLink}`;
    return (
      <Modal
        title={`Share this invite link to ${league.name}`}
        visible={modalVisible}
        footer={null}
        autoFocusButton={null}
        closable
        onCancel={this.closeModal}
      >
        <Form>
          <Form.Item>
            <Input value={formattedLink} />
          </Form.Item>
          <Button
            name="copy-button"
            type="primary"
            onClick={() => {
              clipboardCopy(formattedLink);
            }}
          >
            Copy link
          </Button>
        </Form>
      </Modal>
    );
  };

  render() {
    const { id, league, uid, users } = this.props;
    const { creatingLink, latestInviteLink } = this.state;

    // TODO: Delete old invite links (createdAt > 1day) in render

    return (
      <>
        {uid === league.ownerUser && (
          <>
            <Button
              name="invite-button"
              type="primary"
              disabled={creatingLink}
              onClick={latestInviteLink ? this.openModal : this.createLink}
            >
              <Icon type={creatingLink ? "loading" : "user-add"} />
              Invite people
            </Button>
            {this.renderInviteModal()}
            {/* TODO: League owner can delete unverified users eventually */}
            <Divider />
          </>
        )}
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
    // {
    //   collection: "inviteLinks",
    //   where: [["leagueId", "==", id]]
    // }
  ])
)(LeaguePanelComponent);
