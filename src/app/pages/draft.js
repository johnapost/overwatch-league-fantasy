// @flow

import React from "react";
import { Row, Col, Form } from "antd";
import { compose } from "redux";
import withFirestore from "../shared/withFirestore";
import Layout from "../components/layout";
import Chat from "../components/chat";
import Team from "../components/team";
import FilterableRoster from "../components/filterableRoster";

const Draft = () => (
  <Layout>
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col md={2} />
      <Col md={9}>
        <div className="wrapper">
          <FilterableRoster />
        </div>
      </Col>
      <Col md={9}>
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

export default compose(
  withFirestore(() => [
    {
      collection: "leagues",
      doc: "first"
    }
  ]),
  Form.create()
)(Draft);
