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
  uniqueUserIds: string[] | null,
  user: Object,
  messages: {
    [string]: {
      message: any,
      timestamp: Date,
      user: Object,
      userId: string,
      userName: string
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

  componentWillReceiveProps({ uniqueUserIds: nextIds }) {
    if (!this.props.uniqueUserIds && nextIds) {
      this.setUserListeners(nextIds);
    } else if (nextIds) {
      this.setUserListeners(nextIds.filter(id => (
        this.props.uniqueUserIds && !this.props.uniqueUserIds.includes(id)
      )));
    }
  }

  componentDidUpdate({ messages: prevMessages }) {
    if (this.props.messages !== prevMessages) {
      this.scrollToLatest();
    }
  }

  setUserListeners = (ids) => {
    this.props.firestore.setListeners(ids.map(id => ({
      collection: 'users', doc: id,
    })));
  };

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
      user,
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
      userRef: firebase.firestore().doc(`users/${user.uid}`),
      userId: user.uid,
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
              Object.keys(messages).map(key => (
                <Timeline.Item key={key}>
                  {`${messages[key].userName} - ${messages[key].message}`}
                </Timeline.Item>
              ))
            }
          </div>
        </Timeline>
        <Form>
          {
            getFieldDecorator('message')(<Input
              addonBefore="Draft Chat"
              onPressEnter={sendingMessage ? () => {} : this.sendMessage}
            />)
          }
        </Form>
        <style jsx>{`
          .timeline {
            height: 300px;
            overflow-y: scroll;
          }
        `}
        </style>
      </Card>
    );
  }
}

const mapMessagesToUsers = (users: Object, messages: Object) =>
  // eslint-disable-next-line no-unused-vars
  messages && Object.entries(messages).map(([key, values]) => ({
    ...values,
    // $FlowFixMe
    userName: get(users[values.userId], 'displayName'),
  }));

const filterUniqueUserIds = (messages: Object) =>
  messages &&
  [
    ...new Set(Object.values(messages)
      // $FlowFixMe
      .map(({ userId }) => userId)),
  ];

const mapStateToProps = ({ firestore, user: { uid } }) => {
  const rawMessages = get(firestore.data, 'leagues.first.messages');

  return {
    leagueName: get(firestore.data, 'leagues.first.name'),
    messages: mapMessagesToUsers(firestore.data.users, rawMessages),
    uniqueUserIds: filterUniqueUserIds(rawMessages),
    user: {
      ...get(firestore.data, `users.${uid}`),
      uid,
    },
  };
};

export default compose(
  connect(mapStateToProps, () => ({})),
  withFirestore(({ user: { uid } }) => [{
    collection: 'leagues',
    doc: 'first',
    subcollections: [{ collection: 'messages', orderBy: ['timestamp'] }],
  }, {
    collection: 'users',
    doc: uid,
  }]),
  Form.create(),
)(Chat);
