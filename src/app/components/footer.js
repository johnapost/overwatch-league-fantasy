// @flow

import React from 'react';
import { Row, Col } from 'antd';

export default () => (
  <footer>
    <Row>
      <Col span={8} offset={8}>
        Footer here
      </Col>
    </Row>
    <style jsx>{`
      footer {
        background: #212121;
        color: #FFFFFF;
      }
    `}
    </style>
  </footer>
);
