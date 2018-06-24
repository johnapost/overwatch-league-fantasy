// @flow

import React from "react";
import { Row, Col, Form } from "antd";
import { compose } from "redux";
import withFirestore from "../shared/withFirestore";
import Layout from "../components/layout";
import Chat from "../components/chat";
import FilterableRoster from "../components/filterableRoster";

const Draft = () => (
  <Layout>
    <Row>
      <Col sm={6} md={4} />
      <Col sm={12} md={16}>
        <div className="wrapper">
          <Chat />
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <FilterableRoster />
      </Col>
    </Row>
    <style jsx>{`
      .wrapper {
        margin: 50px 0;
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
