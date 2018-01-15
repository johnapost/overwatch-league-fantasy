// @flow

import React, { Component } from 'react';
import { Row, Col, Form, Input, Timeline } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import { get } from 'lodash';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';

type Props = {
  firestore: Object,
  form: Object,
  leagueName: string,
  messages: {
    id: string,
    message: string,
  }[]
}

class Index extends Component<Props> {
  sendMessage = () => {
    const { form, firestore } = this.props;
    const message = form.getFieldValue('message');
    firestore.add('leagues/first/messages', { message });
    // firestore.add('leagues', { message });
  }

  render() {
    const { leagueName, messages, form: { getFieldDecorator } } = this.props;

    return (
      <Layout>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <h1>
              {leagueName}
            </h1>
            <Timeline>
              {
                messages && messages.map(({ id, message }) => (
                  <Timeline.Item key={id}>{message}</Timeline.Item>
                ))
              }
            </Timeline>
            <Form>
              {
                getFieldDecorator('message')(<Input
                  addonBefore="Draft Chat"
                  onPressEnter={this.sendMessage}
                />)
              }
            </Form>
          </Col>
        </Row>
      </Layout>
    );
  }
}


export default compose(
  withRedux(
    store,
    ({ firestore }) => ({
      leagueName: get(firestore.data, 'leagues.first.name'),
      messages: get(firestore.data, 'leagues.first.messages'),
    }),
  ),
  withFirestore(() => [{ collection: 'leagues', doc: 'first' }]),
  Form.create(),
)(Index);
