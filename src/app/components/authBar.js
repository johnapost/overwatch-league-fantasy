// @flow

import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import LoginForm from './loginForm';
import withFirestore from '../shared/withFirestore';

type State = {
  showSignUpModal: boolean,
  submittingForm: boolean
}

class AuthBar extends Component<{}, State> {
  state = {
    showSignUpModal: false,
    submittingForm: false,
  }

  render() {
    return (
      <div className="container">
        <LoginForm
          showSignUpModal={() => this.setState({ showSignUpModal: true })}
          disabled={this.state.submittingForm || this.state.showSignUpModal}
        />
        <Modal
          okText="Sign up"
          onCancel={() => { this.setState({ showSignUpModal: false }); }}
          title="Create an account"
          visible={this.state.showSignUpModal}
        >
          Yo
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
