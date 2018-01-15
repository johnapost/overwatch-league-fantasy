// @flow

import React from 'react';
import { Row, Col } from 'antd';
import withRedux from 'next-redux-wrapper';
import makeStore from '../shared/makeStore';
import Layout from '../components/layout';

const Index = () => (
  <Layout>
    <Row>
      <Col span={8} offset={8}>
        Overwatch League Fantasy?
      </Col>
    </Row>
  </Layout>
);

export default withRedux(makeStore)(Index);
