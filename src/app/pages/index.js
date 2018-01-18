// @flow

import React from 'react';
import { Row, Col, Form } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import get from 'lodash/get';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';
import Chat from '../components/chat';

type Props = {
  leagueName: string,
}

const Index = ({ leagueName }: Props) => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <h1>{leagueName}</h1>
        <div className="wrapper">
          <Chat />
        </div>
      </Col>
    </Row>
    <style jsx>{`
      .wrapper {
        margin: 50px 0;
      }
    `}
    </style>
  </Layout>
);

export default compose(
  withRedux(
    store,
    ({ firestore }) => ({
      leagueName: get(firestore.data, 'leagues.first.name'),
    }),
  ),
  withFirestore(() => [
    {
      collection: 'leagues',
      doc: 'first',
    },
  ]),
  Form.create(),
)(Index);
