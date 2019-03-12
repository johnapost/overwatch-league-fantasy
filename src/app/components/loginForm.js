// @flow
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from "react";
import { compose } from "redux";
import { isLoaded } from "react-redux-firebase";
import { Form, Button, Input, message } from "antd";
import { withRouter } from "next/router";
import withFirestore from "../shared/withFirestore";
import hasErrors from "../shared/hasErrors";

type Props = {
  disabled: boolean,
  firebase: Object,
  form: Object,
  router: Object,
  setDisabled: (bool: boolean) => void,
  showSignUpModal: Function
};

export class LoginFormComponent extends Component<Props> {
  emailEl: ?HTMLElement = null;

  componentDidMount() {
    if (this.emailEl) {
      this.emailEl.focus();
    }
  }

  handleSubmit = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    const {
      firebase,
      form: { validateFields },
      setDisabled
    } = this.props;

    if (!isLoaded(firebase)) {
      return;
    }

    setDisabled(true);
    const closeMessage = message.loading("Logging in..", 0);

    const finishSubmitting = () => {
      setDisabled(false);
      closeMessage();
    };

    validateFields((err, { email, password }) => {
      if (err) {
        finishSubmitting();
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        // Successful login
        .then(finishSubmitting)
        .catch(({ code, message: errorMessage }) => {
          finishSubmitting();
          message.error(errorMessage);
          // eslint-disable-next-line no-console
          console.error(code, errorMessage);
        });
    });
  };

  render() {
    const {
      disabled,
      form: { getFieldDecorator, getFieldsError },
      router: {
        query: { email }
      },
      showSignUpModal
    } = this.props;
    const emailValidations = [{ required: true }, { type: "email" }];
    const passwordValidations = [{ required: true }];

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item help={false}>
          {getFieldDecorator("email", {
            rules: emailValidations,
            initialValue: email
          })(
            <Input
              placeholder="Email"
              ref={el => {
                this.emailEl = el;
              }}
            />
          )}
        </Form.Item>
        <Form.Item help={false}>
          {getFieldDecorator("password", { rules: passwordValidations })(
            <Input placeholder="Password" type="password" />
          )}
        </Form.Item>
        <Form.Item help={false}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled || hasErrors(getFieldsError())}
          >
            Login
          </Button>
        </Form.Item>
        <Form.Item help={false}>
          <Button type="secondary" onClick={showSignUpModal}>
            Sign up
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default compose(
  withRouter,
  withFirestore(),
  Form.create()
)(LoginFormComponent);
