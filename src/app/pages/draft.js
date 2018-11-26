// @flow

import React from "react";
import { Row, Col } from "antd";
import Header from "../components/header";
import Layout from "../components/layout";
import Chat from "../components/chat";
import Team from "../components/team";
import FilterableRosterGrid from "../components/filterableRosterGrid";

export default () => (
  <Layout>
    <Row>
      <Col xs={1} />
      <Col>
        <Header title="Now Drafting" />
      </Col>
    </Row>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col md={11}>
        <div className="wrapper">
          <FilterableRosterGrid />
        </div>
      </Col>
      <Col md={13}>
        <div className="wrapper">
          <Chat />
        </div>
        <div className="wrapper">
          <Team />
        </div>
      </Col>
    </Row>
    <style jsx>{`
      .wrapper {
        margin: 25px 0;
      }
    `}</style>
  </Layout>
);
