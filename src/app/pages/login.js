// @flow

import React from 'react';
import { Row, Col } from 'antd';
import withRedux from 'next-redux-wrapper';
import store from '../shared/store';
import Layout from '../components/layout';
import LoginForm from '../components/loginForm';

const Login = () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <div className="wrapper">
          <LoginForm />
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

export default withRedux(store)(Login);
