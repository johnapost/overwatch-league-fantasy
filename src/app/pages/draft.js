// @flow

import React from "react";
import { Row, Col } from "antd";
import Header from "../components/header";
import Chat from "../components/chat";
import Team from "../components/team";
import FilterableRosterTable from "../components/filterableRosterTable";

export default () => (
  <>
    <Row>
      <Col>
        <div className="wrapper">
          <Header title="Now Drafting" />
        </div>
      </Col>
    </Row>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col md={24}>
        <Col md={11}>
          <div className="wrapper">
            <Chat />
          </div>
        </Col>
      </Col>
      <Col md={24}>
        <Col md={11}>
          <div className="wrapper">
            <Team />
          </div>
        </Col>
        <Col md={13}>
          <div className="wrapper">
            <FilterableRosterTable />
          </div>
        </Col>
      </Col>
    </Row>
    <style jsx>{`
      .wrapper {
        margin: 25px;
      }
    `}</style>
  </>
);
