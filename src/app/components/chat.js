// @flow

import React, { Component } from 'react';
import { Input, Timeline, Card, Form } from 'antd';
import uuid from 'uuid/v4';
import get from 'lodash/get';
import firebaseDep from 'firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded } from 'react-redux-firebase';
import withFirestore from '../shared/withFirestore';

type Props = {
  firebase: Object,
  firestore: Object,
  form: Object,
  leagueName: string,
  user: Object,
  uid: string,
  messages: {
    [string]: {
      id: string,
      message: string,
      timestamp: Date,
      user: Object
    }
  }
}

type State = {
  sendingMessage: boolean,
}

class Chat extends Component<Props, State> {
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
    const {
      form: { getFieldsValue, setFieldsValue },
      firebase,
      firestore,
      uid,
    } = this.props;
    const { message } = getFieldsValue();

    this.setState({ sendingMessage: true });
    setFieldsValue({ message: '' });
    firestore.set({
      collection: 'leagues',
      doc: 'first',
      subcollections: [{ collection: 'messages', doc: uuid() }],
    }, {
      message,
      user: firebase.firestore().doc(`users/${uid}`),
      timestamp: firebaseDep.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      this.setState({ sendingMessage: false });
    });
  }

  render() {
    const { sendingMessage } = this.state;
    const { messages, form: { getFieldDecorator }, leagueName } = this.props;

    return (
      <Card title={leagueName}>
        <Timeline>
          <div
            className="timeline"
            ref={(el) => { this.timelineEl = el; }}
          >
            {
              isLoaded(messages) &&
              messages &&
              Object.keys(messages).map((key: string) => (
                <Timeline.Item key={key}>{messages[key].message}</Timeline.Item>
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
        <style jsx>{`
          .timeline {
            max-height: 300px;
            overflow-y: scroll;
          }
        `}
        </style>
      </Card>
    );
  }
}

const mapStateToProps = ({ firestore, user: { uid } }) => ({
  leagueName: get(firestore.data, 'leagues.first.name'),
  messages: get(firestore.data, 'leagues.first.messages'),
  user: get(firestore.data, `users.${uid}`),
  uid,
});

export default compose(
  connect(mapStateToProps, () => ({})),
  withFirestore(({ uid }) => [{
    collection: 'leagues',
    doc: 'first',
    subcollections: [{ collection: 'messages', orderBy: ['timestamp'] }],
  }, {
    collection: 'users',
    doc: uid,
  }]),
  Form.create(),
)(Chat);
