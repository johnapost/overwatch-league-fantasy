// @flow

import React from "react";
import { Row, Col } from "antd";
import Header from "../components/header";
import Layout from "../components/layout";
import Chat from "../components/chat";
import Team from "../components/team";
import FilterableRosterTable from "../components/filterableRosterTable";

export default () => (
  <Layout>
    <Row>
      <Col>
        <div style={{ margin: "0 25px" }}>
          <Header title="Now Drafting" />
        </div>
      </Col>
    </Row>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col md={13}>
        <div className="wrapper">
          <FilterableRosterTable />
        </div>
      </Col>
      <Col md={11}>
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
