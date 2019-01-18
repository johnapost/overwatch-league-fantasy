// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Modal, Button, Divider, Form, Input } from "antd";

import type { StoreState } from "../shared/makeStore";

type Props = {
  displayName: string
};

export const FindLeagueComponent = ({ displayName }: Props) => (
  <Modal
    title={`Welcome, ${displayName}`}
    visible
    footer={null}
    keyboard={false}
    autoFocusButton={null}
    closable={false}
  >
    <p>Join an existing league or create your own!</p>
    <Form layout="inline">
      <Form.Item>
        <Input placeholder="Invite code" disabled />
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled>
          Join someone&rsquo;s league
        </Button>
      </Form.Item>
    </Form>
    <Divider />
    <Form layout="inline">
      <Form.Item>
        <Input placeholder="League name" />
      </Form.Item>
      <Form.Item>
        <Button>Create a league</Button>
      </Form.Item>
    </Form>
    <style jsx>{`
      p {
        margin: 10px 0 30px;
      }
    `}</style>
  </Modal>
);

export const mapStateToProps = ({ user: { displayName } }: StoreState) => ({
  displayName
});

export default compose(connect(mapStateToProps))(FindLeagueComponent);
