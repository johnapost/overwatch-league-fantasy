// @flow

import React from 'react';
import { Row, Col, Form } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import store from '../shared/makeStore';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';
import Chat from '../components/chat';

const Index = () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
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
  withRedux(store),
  withFirestore(() => [
    {
      collection: 'leagues',
      doc: 'first',
    },
  ]),
  Form.create(),
)(Index);
