// @flow

import React, { Component } from "react";
import { Row, Col, Form } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import withFirestore from "../shared/withFirestore";
import { teamSetSlots } from "../redux/team";
import Layout from "../components/layout";
import Chat from "../components/chat";
import Team from "../components/team";
import FilterableRoster from "../components/filterableRoster";

type Props = {
  setSlots: typeof teamSetSlots
};

class Draft extends Component<Props> {
  componentDidMount() {
    const { setSlots } = this.props;
    setSlots([
      "Offense",
      "Offense",
      "Tank",
      "Tank",
      "Support",
      "Support",
      "Flex",
      "Flex"
    ]);
  }

  render() {
    return (
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
  }
}

const mapDispatchToProps = { setSlots: teamSetSlots };

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withFirestore(() => [
    {
      collection: "leagues",
      doc: "first"
    }
  ]),
  Form.create()
)(Draft);
