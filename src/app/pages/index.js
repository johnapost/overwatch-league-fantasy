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
            Create or join leagues to compete with your own Overwatch team!
          </Card>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <Roster />
      </Col>
    </Row>
    <style jsx>{`
      .wrapper {
        margin: 50px 0;
      }
    `}</style>
  </Layout>
);
