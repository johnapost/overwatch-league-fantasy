// @flow

import React, { Component } from 'react';
import { Form, Modal, message } from 'antd';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { userLogin, userLogout } from '../redux/user';
import LoginForm from './loginForm';
import SignUpForm from './signUpForm';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object,
  router: Object,
  login: (user: Object) => void,
  logout: Function
}

type State = {
  disabled: boolean,
  loggedIn: boolean,
  showSignUpModal: boolean,
}

class AuthBar extends Component<Props, State> {
  state = {
    disabled: false,
    loggedIn: false,
    showSignUpModal: false,
  }

  async componentDidMount() {
    const {
      firestore,
      router: { query: { mode, oobCode }, push },
      login,
      logout,
    } = this.props;

    // Add auth change listener
    const auth = await firestore.auth();
    this.authObserver = auth.onAuthStateChanged((user) => {
      // TODO: Create a user resource if it does not exist
      // TODO: Handle logged in and not verified
      if (user && user.emailVerified && user.uid) {
        this.setState({ loggedIn: true });
        login(user.uid);
        return push('/draft');
      }
      this.setState({ loggedIn: false });
      logout();
      return push('/');
    });

    if (mode === 'verifyEmail' && oobCode) {
      const closeMessage = message.loading('Verifying email..', 0);
      this.verifyEmail(oobCode, closeMessage);
    }
  }

  componentWillUnmount() {
    if (this.authObserver) {
      this.authObserver();
    }
  }

  setDisabled = bool => this.setState({ disabled: bool })

  authObserver = null

  verifyEmail = async (oobCode: string, closeMessage: Function) => {
    const { firestore } = this.props;
    const auth = await firestore.auth();
    auth.applyActionCode(oobCode)
      .then(() => (
        firestore.set({
          collection: 'users',
          doc: auth.currentUser.uid,
        }, {
          displayName: null,
        })
      ))
      .then(() => {
        // Issues with nextjs reload, force a reload with this instead
        window.location = window.location.pathname;
      })
      .catch(({ code, message: errorMessage }) => {
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, message);
      })
      .then(() => {
        closeMessage();
      });
  }

  hideSignUpModal = () => this.setState({ showSignUpModal: false })

  render() {
    const renderLoggedIn = (
      <div>
        yolo
      </div>
    );

    const renderLoggedOut = (
      <div>
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
      </div>
    );

    return (
      <div className="container">
        {
          this.state.loggedIn ?
          renderLoggedIn :
          renderLoggedOut
        }
        <style jsx>{`
          .container {
            background: #FFFFFF;
            display: flex;
            height: 59px;
            justify-content: flex-end;
            padding: 10px;
            position: fixed;
            top: 0;
            width: 100vw;
            z-index: 100;
          }
        `}
        </style>
      </div>
    );
  }
}

const mapDispatchToProps = { login: userLogin, logout: userLogout };

export default compose(
  connect(() => ({}), mapDispatchToProps),
  withRouter,
  withFirestore(),
  Form.create(),
)(AuthBar);
