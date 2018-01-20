// @flow

import React, { Component } from 'react';
import { Card, Form, Input, Button } from 'antd';
import { compose } from 'redux';
import { isLoaded } from 'react-redux-firebase';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object,
  form: Object,
}

type State = {
  submittingForm: boolean
}

class Auth extends Component<Props, State> {
  state = {
    submittingForm: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { firestore, form: { validateFieldsAndScroll } } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    this.setState({ submittingForm: true });

    validateFieldsAndScroll((err, { email, password }) => {
      if (err) {
        this.setState({ submittingForm: false });
        return;
      }

      firestore
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ submittingForm: false });
        }).catch((error) => {
          this.setState({ submittingForm: false });
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { submittingForm } = this.state;
    const emailValidations = [
      { required: true, message: 'Email required!' },
      { type: 'email', message: 'Invalid email!' },
    ];
    const passwordValidations = [
      { required: true, message: 'Password required!' },
      { min: 6, message: 'Too short!' },
    ];
    const submittable = !submittingForm;

    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {
              getFieldDecorator(
                'email',
                { rules: emailValidations },
              )(<Input placeholder="Email" />)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator(
                'password',
                { rules: passwordValidations },
              )(<Input placeholder="Password" />)
            }
          </Form.Item>
          <div style={{ marginTop: '10px' }}>
            <Button type="primary" htmlType="submit" disabled={!submittable}>
              Sign Up
            </Button>
          </div>
        </Form>
      </Card>
    );
  }
}

export default compose(
  withFirestore(),
  Form.create(),
)(Auth);
