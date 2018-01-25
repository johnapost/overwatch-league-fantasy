// @flow

import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import LoginForm from './loginForm';
import SignUpForm from './signUpForm';
import withFirestore from '../shared/withFirestore';

type State = {
  disabled: boolean,
  showSignUpModal: boolean,
}

class AuthBar extends Component<{}, State> {
  state = {
    disabled: false,
    showSignUpModal: false,
  }

  setDisabled = bool => this.setState({ disabled: bool })

  hideSignUpModal = () => this.setState({ showSignUpModal: false })

  render() {
    return (
      <div className="container">
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
