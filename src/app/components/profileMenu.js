// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Dropdown, Menu, Modal } from "antd";
import { isLoaded, withFirebase } from "react-redux-firebase";
import ProfileForm from "./profileForm";

type Props = {
  firebase: Object,
  user: {
    uid: string,
    displayName: string | null
  }
};

type State = {
  showProfileModal: boolean
};

class ProfileMenu extends Component<Props, State> {
  state = {
    showProfileModal: false
  };

  menuActions = ({ key }: Object) => {
    switch (key) {
      case "setDisplayName":
        return this.setState({ showProfileModal: true });
      case "signOut":
        return this.signOut();
      default:
        return null;
    }
  };

  hideProfileModal = () => this.setState({ showProfileModal: false });

  signOut = () => {
    const { firebase } = this.props;

    if (!isLoaded(firebase)) {
      return;
    }

    firebase.auth().signOut();
  };

  render() {
    const {
      user: { displayName, uid }
    } = this.props;

    const menu = (
      <Menu onClick={this.menuActions}>
        <Menu.Item key="setDisplayName">Edit profile</Menu.Item>
        <Menu.Item key="signOut">Sign out</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button>{displayName || "No display name"}</Button>
        </Dropdown>
        <Modal
          footer={null}
          onCancel={this.hideProfileModal}
          title="Update Profile"
          visible={this.state.showProfileModal}
        >
          <ProfileForm
            hideProfileModal={this.hideProfileModal}
            uid={uid}
            displayName={displayName}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default compose(
  connect(mapStateToProps),
  withFirebase
)(ProfileMenu);
