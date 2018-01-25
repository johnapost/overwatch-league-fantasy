// @flow
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import { compose } from 'redux';
import { isLoaded } from 'react-redux-firebase';
import { Form, Button, Input, message } from 'antd';
import { withRouter } from 'next/router';
import withFirestore from '../shared/withFirestore';
import hasErrors from '../shared/hasErrors';

type Props = {
  disabled: boolean,
  firestore: Object,
  form: Object,
  router: Object,
  showSignUpModal: Function,
}

type State = {
  submittingForm: boolean
}

class LoginForm extends Component<Props, State> {
  state = {
    submittingForm: false,
  }

  componentDidMount() {
    if (this.emailEl) {
      this.emailEl.focus();
    }
  }

  emailEl: ?HTMLElement = null

  handleSubmit = (e) => {
    e.preventDefault();
    const { firestore, form: { validateFieldsAndScroll } } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    this.setState({ submittingForm: true });
    const closeMessage = message.loading('Logging in..', 0);

    const finishSubmitting = () => {
      this.setState({ submittingForm: false });
      closeMessage();
    };

    validateFieldsAndScroll((err, { email, password }) => {
      if (err) {
        finishSubmitting();
        return;
      }

      firestore
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(({ code, message: errorMessage }) => {
          message.error(errorMessage);
          // eslint-disable-next-line no-console
          console.error(code, errorMessage);
        })
        .then(() => {
          finishSubmitting();
        });
    });
  }

  render() {
    const {
      disabled,
      form: { getFieldDecorator, getFieldsError },
      router: { query: { email } },
      showSignUpModal,
    } = this.props;
    const { submittingForm } = this.state;
    const emailValidations = [
      { required: true },
      { type: 'email' },
    ];
    const passwordValidations = [
      { required: true },
    ];

    return (
      <Form layout="inline" onSubmit={this.handleSubmit} disabled={disabled}>
        <Form.Item help={false}>
          {
            getFieldDecorator(
              'email',
              { rules: emailValidations, initialValue: email },
            )(<Input
              placeholder="Email"
              ref={(el) => { this.emailEl = el; }}
            />)
          }
        </Form.Item>
        <Form.Item help={false}>
          {
            getFieldDecorator(
              'password',
              { rules: passwordValidations },
            )(<Input placeholder="Password" type="password" />)
          }
        </Form.Item>
        <Form.Item help={false}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={submittingForm || hasErrors(getFieldsError())}
          >
            Login
          </Button>
        </Form.Item>
        <Form.Item help={false}>
          <Button
            type="secondary"
            onClick={showSignUpModal}
          >
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
  Form.create(),
)(LoginForm);
