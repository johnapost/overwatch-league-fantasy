// @flow

import React from "react";
import { Row, Col } from "antd";

export default () => (
  <footer>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <p>
          Special thanks to Overwatch and the Overwatch League for existing.
        </p>
        <p>All trademarks belong to their owners.</p>
      </Col>
    </Row>
    <style jsx>{`
      footer {
        background: #212121;
        color: #ffffff;
        height: 300px;
        padding: 50px;
      }
    `}</style>
  </footer>
);
