// @flow

import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { compose } from "redux";
import { isLoaded } from "react-redux-firebase";
import { withRouter } from "next/router";
import withFirestore from "../shared/withFirestore";
import hasErrors from "../shared/hasErrors";

type Props = {
  disabled: boolean,
  firestore: Object,
  form: Object,
  hideSignUpModal: Function,
  setDisabled: (bool: boolean) => void
};

class SignUpForm extends Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    const {
      firestore,
      form: { validateFields },
      hideSignUpModal,
      setDisabled
    } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    setDisabled(true);
    const closeMessage = message.loading("Signing up..", 0);

    const finishSubmitting = () => {
      setDisabled(false);
      closeMessage();
      hideSignUpModal();
    };

    validateFields((err, { email, password }) => {
      if (err) {
        finishSubmitting();
        return;
      }

      firestore
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => user.sendEmailVerification())
        .then(() => {
          finishSubmitting();
          message.success("Successfully signed up!");
        })
        .catch(({ code, message: errorMessage }) => {
          finishSubmitting();
          // TODO: Handle if the user already exists, maybe reset password?
          message.error(errorMessage);
          // eslint-disable-next-line no-console
          console.error(code, message);
        });
    });
  };

  render() {
    const {
      disabled,
      form: { getFieldDecorator, getFieldsError }
    } = this.props;
    const emailValidations = [{ required: true }, { type: "email" }];
    const passwordValidations = [{ required: true }, { min: 6 }];

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator("email", { rules: emailValidations })(
            <Input placeholder="Email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", { rules: passwordValidations })(
            <Input placeholder="Password" type="password" />
          )}
        </Form.Item>
        <div style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled || hasErrors(getFieldsError())}
          >
            Sign Up
          </Button>
        </div>
      </Form>
    );
  }
}

export default compose(withRouter, withFirestore(), Form.create())(SignUpForm);
