// @flow

import React from "react";
import { Row, Col, Card } from "antd";
import Layout from "../components/layout";
import FilterableRosterTable from "../components/filterableRosterTable";

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
    <div className="table-wrapper">
      <Row className="table">
        <Col md={4} />
        <Col md={16}>
          <FilterableRosterTable />
        </Col>
      </Row>
    </div>
    <style jsx>{`
      .wrapper {
        margin: 50px 0;
      }
      .table-wrapper {
        margin: 0 0 50px;
      }
    `}</style>
  </Layout>
);
