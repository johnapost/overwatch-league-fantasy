// @flow

import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { compose } from 'redux';
import { isLoaded } from 'react-redux-firebase';
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

class SignUpForm extends Component<Props, State> {
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
    const { firestore, form: { validateFieldsAndScroll }, router } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    this.setState({ submittingForm: true });
    const closeMessage = message.loading('Signing up..', 0);

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
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          finishSubmitting();
          message.success('Successfully signed up!');
          router.push({
            pathname: '/login',
            query: { email },
          });
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
    const { form: { getFieldDecorator, getFieldsError } } = this.props;
    const { submittingForm } = this.state;
    const emailValidations = [
      { required: true, message: 'Email required!' },
      { type: 'email', message: 'Invalid email!' },
    ];
    const passwordValidations = [
      { required: true, message: 'Password required!' },
      { min: 6, message: 'Too short!' },
    ];

    return (
      <Card title="Sign up for an account">
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {
              getFieldDecorator(
                'email',
                { rules: emailValidations },
              )(<Input
                placeholder="Email"
                ref={(el) => { this.emailEl = el; }}
              />)
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
          <div style={{ marginTop: '10px' }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={submittingForm || hasErrors(getFieldsError())}
            >
              Sign Up
            </Button>
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
)(SignUpForm);
