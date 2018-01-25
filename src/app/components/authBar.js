// @flow

import React, { Component } from 'react';
import { Form, Modal, message } from 'antd';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import LoginForm from './loginForm';
import SignUpForm from './signUpForm';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object,
  router: Object
}

type State = {
  disabled: boolean,
  showSignUpModal: boolean,
}

class AuthBar extends Component<Props, State> {
  state = {
    disabled: false,
    showSignUpModal: false,
  }

  componentDidMount() {
    const { router: { query: { mode, oobCode } } } = this.props;

    if (mode === 'verifyEmail' && oobCode) {
      const closeMessage = message.loading('Verifying email..', 0);
      this.verifyEmail(oobCode, closeMessage);
    }

    // Add auth change listener

    // logged in and verified
    // route to draft chat
  }

  setDisabled = bool => this.setState({ disabled: bool })

  verifyEmail = async (oobCode: string, closeMessage: Function) => {
    const { firestore } = this.props;
    const auth = await firestore.auth();
    auth.applyActionCode(oobCode)
      .catch(({ code, message: errorMessage }) => {
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, message);
      }).then(() => {
        closeMessage();
      });
  }

  hideSignUpModal = () => this.setState({ showSignUpModal: false })

  render() {
    return (
      <div className="container">
        {/* TODO: Handle resending verification email */}
        {/* TODO: Handle resetting password */}
        <LoginForm
          disabled={this.state.disabled || this.state.showSignUpModal}
          showSignUpModal={() => this.setState({ showSignUpModal: true })}
          setDisabled={this.setDisabled}
        />
        <Modal
          footer={null}
          onCancel={this.hideSignUpModal}
          title="Create an account"
          visible={this.state.showSignUpModal}
        >
          <SignUpForm
            disabled={this.state.disabled}
            hideSignUpModal={this.hideSignUpModal}
            setDisabled={this.setDisabled}
          />
        </Modal>
        <style jsx>{`
          .container {
            display: flex;
            justify-content: flex-end;
            margin: 10px;
          }
        `}
        </style>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withFirestore(),
  Form.create(),
)(AuthBar);
