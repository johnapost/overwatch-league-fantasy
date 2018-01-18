// @flow

import React from 'react';
import { Row, Col } from 'antd';
import withRedux from 'next-redux-wrapper';
import get from 'lodash/get';
import store from '../shared/store';
import Layout from '../components/layout';
import Auth from '../components/auth';

const Login = () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <h1>Login to your account</h1>
        <div className="wrapper">
          <Auth />
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

export default withRedux(
  store,
  ({ firestore }) => ({
    leagueName: get(firestore.data, 'leagues.first.name'),
  }),
)(Login);
