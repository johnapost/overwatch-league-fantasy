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
import ProfileMenu from "./profileMenu";

import type { InviteLink } from "../shared/inviteLink";
import type { League } from "../shared/league";

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
  inviteLinkCallback: Function | null,
  showSignUpModal: boolean
};

export class AuthBarComponent extends Component<Props, State> {
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
    let closeInviteMessage = () => {};

    if (invite)
      closeInviteMessage = message.info(
        "Sign up or login to accept league invite",
        0
      );

    this.authObserver = auth.onAuthStateChanged(user => {
      // TODO: Create a user resource if it does not exist
      // TODO: Handle logged in and not verified
      if (user && user.emailVerified && user.uid) {
        this.setState({ loggedIn: true });
        login(user.uid);

        // Pass to consumeInvite
        if (invite) this.consumeInvite(closeInviteMessage, invite, user.uid);

        return push({ pathname: "/leagues", query: {} });
      }

      this.setState({ loggedIn: false });
      logout();

      // Handle unauthed user with invite link
      if (invite) {
        this.setState({
          inviteLinkCallback: (uid: string) => {
            this.consumeInvite(closeInviteMessage, invite, uid, false);
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

  setDisabled = (bool: boolean) => this.setState({ disabled: bool });

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

  consumeInvite = async (
    inviteLinkMessage: Function,
    invite: string,
    uid: string,
    showMessage: boolean = true
  ) => {
    const {
      firebase: { firestore: firestoreDep },
      firestore
    } = this.props;
    const db = firestoreDep();
    const batch = db.batch();

    inviteLinkMessage();
    let closeMessage;
    if (showMessage) closeMessage = message.loading("Verifying invite..", 0);

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
    batch.update(db.collection("leagues").doc(leagueId), {
      leagueUsers: firestoreDep.FieldValue.arrayUnion(uid)
    });

    // Update user with league
    batch.update(db.collection("users").doc(uid), {
      userLeagues: firestoreDep.FieldValue.arrayUnion(leagueId)
    });

    return batch.commit().then(() => {
      if (!showMessage) return;
      closeMessage();
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
        {loggedIn ? <ProfileMenu /> : renderLoggedOut}
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

const mapDispatchToProps = { login: userLogin, logout: userLogout };

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withRouter,
  withFirestore(),
  Form.create()
)(AuthBarComponent);
