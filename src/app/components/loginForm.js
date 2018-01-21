// @flow
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import { compose } from 'redux';
import { isLoaded } from 'react-redux-firebase';
import { Card, Form, Button, Input, message } from 'antd';
import Link from 'next/link';
import { withRouter } from 'next/router';
import withFirestore from '../shared/withFirestore';
import hasErrors from '../shared/hasErrors';

type Props = {
  firestore: Object,
  form: Object,
  router: Object,
}

type State = {
  submittingForm: boolean
}

class LoginForm extends Component<Props, State> {
  state = {
    submittingForm: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { firestore, router, form: { validateFieldsAndScroll } } = this.props;

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
        .then(() => {
          finishSubmitting();
          router.push('/');
        })
        .catch(({ code, message: errorMessage }) => {
          finishSubmitting();
          message.error(errorMessage);
          // eslint-disable-next-line no-console
          console.error(code, message);
        });
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldsError },
      router: { query: { email } },
    } = this.props;
    const { submittingForm } = this.state;
    const emailValidations = [
      { required: true, message: 'Email required!' },
      { type: 'email', message: 'Invalid email!' },
    ];
    const passwordValidations = [
      { required: true, message: 'Password required!' },
    ];

    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {
              getFieldDecorator(
                'email',
                { rules: emailValidations, initialValue: email },
              )(<Input placeholder="Email" />)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator(
                'password',
                { rules: passwordValidations },
              )(<Input placeholder="Password" type="password" />)
            }
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={submittingForm || hasErrors(getFieldsError())}
            >
              Login
            </Button>
          </Form.Item>
          <div>
            <Link prefetch href="/sign-up">
              <a>
                Sign up for an account
              </a>
            </Link>
          </div>
        </Form>
      </Card>
    );
  }
}

export default compose(
  withRouter,
  withFirestore(),
  Form.create(),
)(LoginForm);
