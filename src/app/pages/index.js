// @flow

import React from "react";
import { Row, Col, Card } from "antd";
import Layout from "../components/layout";
import Roster from "../components/roster";

export default () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <div className="wrapper">
          <Card>
            This site is a work in progress and is not ready for usage at all!
            Any data is subject to deletion while work continues.
          </Card>
        </div>
      </Col>
    </Row>
    <Roster />
    <style jsx>{`
      .wrapper {
        margin: 50px 0;
      }
    `}</style>
  </Layout>
);
