// @flow

import React from 'react';
import { Row, Col } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import { get } from 'lodash';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';

type Props = {
  name: string
}

const Index = ({ name }: Props) => (
  <Layout>
    <Row>
      <Col span={8} offset={8}>
        Overwatch League Fantasy
        <p>
          {name}
        </p>
      </Col>
    </Row>
  </Layout>
);

export default compose(
  withRedux(
    store,
    ({ firestore }) => ({ name: get(firestore.data, 'leagues.first.name') }),
  ),
  withFirestore([{ collection: 'leagues', doc: 'first' }]),
)(Index);
