// @flow

import React, { Component } from "react";
import { Form, Modal, message } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { userLogin, userLogout } from "../redux/user";
import withFirestore from "../shared/withFirestore";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";
import ProfileMenuComponent from "./profileMenu";

import type { InviteLink } from "../shared/inviteLink";
import type { StoreState } from "../shared/makeStore";

type Props = {
  firebase: Object,
  firestore: Object,
  login: (user: Object) => void,
  logout: Function,
  router: Object,
  uid: string
};

type State = {
  disabled: boolean,
  loggedIn: boolean,
  showSignUpModal: boolean
};

class AuthBar extends Component<Props, State> {
  state = {
    disabled: false,
    loggedIn: false,
    showSignUpModal: false
  };

  authObserver = null;

  async componentDidMount() {
    const {
      firebase,
      router: {
        query: { mode, oobCode, invite },
        push
      },
      login,
      logout
    } = this.props;

    // Add auth change listener
    const auth = await firebase.auth();
    this.authObserver = auth.onAuthStateChanged(user => {
      // TODO: Create a user resource if it does not exist
      // TODO: Handle logged in and not verified
      if (user && user.emailVerified && user.uid) {
        this.setState({ loggedIn: true });
        login(user.uid);
        return push("/leagues");
      }
      this.setState({ loggedIn: false });
      logout();
      return push("/");
    });

    // Pass to verifyEmail
    if (mode === "verifyEmail" && oobCode) {
      const closeMessage = message.loading("Verifying email..", 0);
      return this.verifyEmail(closeMessage);
    }

    // Pass to verifyInvite
    if (invite) {
      const closeMessage = message.loading("Verifying invite..", 0);
      return this.verifyInvite(closeMessage);
    }

    // Catch-all no-op
    return () => {};
  }

  componentWillUnmount() {
    if (this.authObserver) {
      this.authObserver();
    }
  }

  setDisabled = bool => this.setState({ disabled: bool });

  verifyEmail = async (closeMessage: Function) => {
    const {
      firebase,
      router: {
        query: { oobCode }
      }
    } = this.props;
    const auth = await firebase.auth();
    auth
      .applyActionCode(oobCode)
      .then(() => {
        // Issues with nextjs reload, force a reload with this instead
        window.location = window.location.pathname;
      })
      .catch(({ code, message: errorMessage }) => {
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, message);
      })
      .then(closeMessage);
  };

  verifyInvite = async (closeMessage: Function) => {
    const {
      firebase,
      firestore,
      router: {
        query: { invite }
      },
      uid
    } = this.props;
    const { loggedIn } = this.state;

    if (!loggedIn) return;

    // Get league ref
    const link = await firestore.get({
      collection: "inviteLinks",
      doc: invite
    });
    const { leagueId }: InviteLink = link.data();

    // Get league name
    const league = await firestore.get({
      collection: "leagues",
      doc: leagueId
    });
    const { name }: League = league.data();

    // Update league with current user
    firestore
      .update(
        {
          collection: "leagues",
          doc: leagueId
        },
        {
          leagueUsers: firebase.firestore.FieldValue.arrayUnion(uid)
        }
      )
      .then(closeMessage)
      .then(() => {
        message.success(`Successfully accepted invite to ${name}`);
      });
  };

  hideSignUpModal = () => this.setState({ showSignUpModal: false });

  render() {
    const { disabled, showSignUpModal, loggedIn } = this.state;

    const renderLoggedOut = (
      <div>
        {/* TODO: Handle resending verification email */}
        {/* TODO: Handle resetting password */}
        <LoginForm
          disabled={disabled || showSignUpModal}
          showSignUpModal={() => this.setState({ showSignUpModal: true })}
          setDisabled={this.setDisabled}
        />
        <Modal
          footer={null}
          onCancel={this.hideSignUpModal}
          title="Create an account"
          visible={showSignUpModal}
        >
          <SignUpForm
            disabled={disabled}
            hideSignUpModal={this.hideSignUpModal}
            setDisabled={this.setDisabled}
          />
        </Modal>
      </div>
    );

    return (
      <div className="container">
        {loggedIn ? <ProfileMenuComponent /> : renderLoggedOut}
        <style jsx>{`
          .container {
            background: ${loggedIn ? "transparent" : "#FFFFFF"};
            display: flex;
            height: 59px;
            justify-content: flex-end;
            padding: 10px;
            position: fixed;
            top: 0;
            width: 100vw;
            z-index: 100;
          }
        `}</style>
      </div>
    );
  }
}

export const mapStateToProps = ({ user: { uid } }: StoreState) => ({
  uid
});

const mapDispatchToProps = { login: userLogin, logout: userLogout };

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withRouter,
  withFirestore(),
  Form.create()
)(AuthBar);
