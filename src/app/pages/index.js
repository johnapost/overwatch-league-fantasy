// @flow

import React, { Component } from 'react';
import { Row, Col, Form, Input, Timeline, Card } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import get from 'lodash/get';
import { v4 } from 'uuid';
import firebase from 'firebase';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';

type Props = {
  firestore: Object,
  form: Object,
  leagueName: string,
  messages: {
    [string]: {
      id: string,
      message: string,
      timestamp: Date,
    }
  }
}

type State = {
  sendingMessage: boolean,
}

class Index extends Component<Props, State> {
  state = {
    sendingMessage: false,
  }

  componentDidMount() {
    this.scrollToLatest();
  }

  componentDidUpdate({ messages: prevMessages }) {
    if (this.props.messages !== prevMessages) {
      this.scrollToLatest();
    }
  }

  timelineEl: ?HTMLElement = null

  scrollToLatest = () => {
    if (this.timelineEl) {
      this.timelineEl.scrollTop =
        this.timelineEl.scrollHeight - this.timelineEl.offsetHeight;
    }
  }

  sendMessage = () => {
    const { form, firestore } = this.props;
    const message = form.getFieldValue('message');

    this.setState({ sendingMessage: true });
    form.setFieldsValue({ message: '' });
    firestore.set({
      collection: 'leagues',
      doc: 'first',
      subcollections: [{ collection: 'messages', doc: v4() }],
    }, {
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      this.setState({ sendingMessage: false });
    });
  }

  render() {
    const { sendingMessage } = this.state;
    const { leagueName, messages, form: { getFieldDecorator } } = this.props;

    return (
      <Layout>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <div className="wrapper">
              <Card title={leagueName}>
                <Timeline>
                  <div
                    className="timeline"
                    ref={(el) => { this.timelineEl = el; }}
                  >
                    {
                      messages &&
                      Object.keys(messages).map((key: string) => (
                        <Timeline.Item>{messages[key].message}</Timeline.Item>
                      ))
                    }
                  </div>
                </Timeline>
                <Form>
                  {
                    getFieldDecorator('message')(<Input
                      addonBefore="Draft Chat"
                      onPressEnter={
                        sendingMessage ? () => {} : this.sendMessage
                      }
                    />)
                  }
                </Form>
              </Card>
            </div>
          </Col>
        </Row>
        <style jsx>{`
          .wrapper {
            margin-top: 50px;
          }

          .timeline {
            max-height: 300px;
            overflow-y: scroll;
          }
        `}
        </style>
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
  withFirestore(() => [
    {
      collection: 'leagues',
      doc: 'first',
    },
    {
      collection: 'leagues',
      doc: 'first',
      subcollections: [{ collection: 'messages', orderBy: ['timestamp'] }],
    },
  ]),
  Form.create(),
)(Index);
