// @flow

import React, { Component } from 'react';
import { Card, Form } from 'antd';
import { compose } from 'redux';
import { get } from 'lodash';
import { connect } from 'react-redux';
import withFirestore from '../shared/withFirestore';

class Auth extends Component<*> {
  render() {
    return (
      <Card>
        <div />
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
