// @flow

import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Card, Button, message } from 'antd';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object
}

type State = {
  title: string,
  currentUser: {
    sendEmailVerification: () => Promise<*>
  } | null
}

class VerifyAccount extends Component<Props, State> {
  state = {
    title: '',
    currentUser: null,
  }

  async componentWillMount() {
    const { firestore } = this.props;
    if (!isLoaded(firestore)) {
      return;
    }

    const auth = await firestore.auth();
    this.setState({
      title: auth.currentUser.email,
      currentUser: auth.currentUser,
    });
  }

  handleVerify = () => {
    if (this.state.currentUser) {
      this.state.currentUser.sendEmailVerification().then(() => {
        message.success('Email sent, check your inbox!');
      }).catch(({ code, message: errorMessage }) => {
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, errorMessage);
      });
    }
  }

  render() {
    return (
      <Card title={this.state.title}>
        Your email hasn&#39;t been verified. Please verify it to proceed.
        <div style={{ marginTop: '10px' }}>
          <Button
            onClick={this.handleVerify}
            disabled={!this.state.currentUser}
          >
            Send a verification email
          </Button>
        </div>
      </Card>
    );
  }
}

export default withFirestore()(VerifyAccount);
