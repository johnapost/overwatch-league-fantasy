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
  router: Object
};

type State = {
  disabled: boolean,
  loggedIn: boolean,
  onSignUp: Function | null,
  showSignUpModal: boolean
};

class AuthBar extends Component<Props, State> {
  state = {
    disabled: false,
    loggedIn: false,
    inviteLinkCallback: null,
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

        // Pass to consumeInvite
        if (invite) return this.consumeInvite(invite, user.uid);

        return push({ pathname: "/leagues", query: {} });
      }

      this.setState({ loggedIn: false });
      logout();

      // Handle unauthed user with invite link
      if (invite) {
        const closeMessage = message.info(
          "Sign up or login to accept league invite",
          0
        );

        this.setState({
          inviteLinkCallback: () => {
            // TODO: Assign user to league
            closeMessage();
          }
        });
      }

      return push({ pathname: "/", query: {} });
    });

    // Pass to verifyEmail
    if (mode === "verifyEmail" && oobCode) return this.verifyEmail();

    // Catch-all no-op
    return () => {};
  }

  componentWillUnmount() {
    if (this.authObserver) {
      this.authObserver();
    }
  }

  setDisabled = bool => this.setState({ disabled: bool });

  verifyEmail = async () => {
    const {
      firebase,
      router: {
        query: { oobCode }
      }
    } = this.props;
    const closeMessage = message.loading("Verifying email..", 0);

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

  consumeInvite = async (invite: string, uid: string) => {
    const { firebase, firestore } = this.props;
    const closeMessage = message.loading("Verifying invite..", 0);

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

    if (!link.exists || !league.exists)
      message.error("Invite link invalid! Please check again");

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

  showSignUpModal = () => this.setState({ showSignUpModal: true });

  render() {
    const {
      disabled,
      showSignUpModal,
      loggedIn,
      inviteLinkCallback
    } = this.state;

    const renderLoggedOut = (
      <div>
        {/* TODO: Handle resending verification email */}
        {/* TODO: Handle resetting password */}
        <LoginForm
          disabled={disabled || showSignUpModal}
          showSignUpModal={this.showSignUpModal}
          inviteLinkCallback={inviteLinkCallback}
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
            inviteLinkCallback={inviteLinkCallback}
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
