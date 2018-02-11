// @flow

import React, { Component } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { isLoaded } from 'react-redux-firebase';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object
}

class ProfileMenu extends Component<Props> {
  menuActions = ({ key }: Object) => {
    switch (key) {
      case 'signOut': return this.signOut();
      default: return null;
    }
  }

  signOut = () => {
    const { firestore } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    firestore.auth().signOut();
  }

  render() {
    const menu = (
      <Menu onClick={this.menuActions}>
        <Menu.Item key="signOut">
          Sign Out
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} placement="bottomRight">
        <Button>
          User name
        </Button>
      </Dropdown>
    );
  }
}

export default withFirestore()(ProfileMenu);
