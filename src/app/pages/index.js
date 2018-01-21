// @flow

import React from 'react';
import { Row, Col } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';
import VerifyAccount from '../components/verifyAccount';

const Index = () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <div className="wrapper">
          {
            <VerifyAccount />
          }
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
  withFirestore(),
)(Index);
