// @flow

import React, { Component } from 'react';
import { Card, Form, Input } from 'antd';
import { compose } from 'redux';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import withFirestore from '../shared/withFirestore';

type Props = {
  firestore: Object,
  form: Object,
}

class Auth extends Component<Props> {
  handleSubmit = () => {}

  render() {
    const { firestore, form: { getFieldDecorator } } = this.props;

    if (isLoaded(firestore)) {
      console.log(firestore.auth());
    }

    return (
      <Card>
        <Form onSubmit={this.handleSubmit}>
          {
            getFieldDecorator('email')(<Input
              addonBefore="Email"
            />)
          }
          {
            getFieldDecorator('password')(<Input
              addonBefore="Password"
            />)
          }
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = ({ firestore }) => ({
  messages: get(firestore.data, 'leagues.first.messages'),
});

export default compose(
  connect(mapStateToProps, () => ({})),
  withFirestore(() => [{
    collection: 'leagues',
    doc: 'first',
    subcollections: [{ collection: 'messages', orderBy: ['timestamp'] }],
  }]),
  Form.create(),
)(Auth);
