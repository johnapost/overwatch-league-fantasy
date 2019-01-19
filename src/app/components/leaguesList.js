// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Modal, Button, Divider, Form, Input } from "antd";
import CreateLeague from "./createLeague";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";

type Props = {
  leagues: Object[],
  user: {
    displayName: string
  }
};

export const LeaguesListComponent = ({
  user: { displayName },
  leagues
}: Props) => (
  <div>
    {leagues.length ? (
      <div>{JSON.stringify(leagues)}</div>
    ) : (
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
        <CreateLeague />
      </Modal>
    )}
    <style jsx>{`
      p {
        margin: 10px 0 30px;
      }
    `}</style>
  </div>
);

const filterMyLeagues = (
  uid: string | null,
  leagues: Object
): [string, Object][] =>
  (uid &&
    leagues &&
    ((Object.entries(leagues): any): Object[]).reduce(
      (accum, [key, value]) =>
        value.leagueUsers.includes(uid) ? [...accum, [key, value]] : accum,
      []
    )) ||
  [];

export const mapStateToProps = ({
  firestore: {
    data: { leagues }
  },
  user: { displayName, uid }
}: StoreState) => ({
  leagues: filterMyLeagues(uid, leagues),
  user: {
    displayName,
    uid
  }
});

export default compose(
  connect(mapStateToProps),
  withFirestore(({ user: { uid } }) =>
    uid
      ? [
          {
            collection: "leagues",
            where: [["leagueUsers", "array-contains", uid]]
          }
        ]
      : []
  )
)(LeaguesListComponent);
