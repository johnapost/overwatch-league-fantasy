// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Spin
} from "antd";
import CreateLeague from "./createLeague";
import withFirestore from "../shared/withFirestore";
import LeaguePanel from "./leaguePanel";

import type { StoreState } from "../shared/makeStore";
import type { League } from "../shared/league";

type Props = {
  leagues: [string, League][] | null,
  user: {
    displayName: string
  }
};

export const LeaguesListComponent = ({
  user: { displayName },
  leagues
}: Props) => {
  // Loading
  if (!displayName) return <Spin size="large" />;
  // Belongs to at least one league
  if (leagues && leagues.length)
    return (
      <>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <div className="wrapper">
              <Collapse>
                {leagues.map(([id, league]) => (
                  <Collapse.Panel
                    key={id}
                    bordered={false}
                    header={league.name}
                    showArrow={false}
                  >
                    <LeaguePanel id={id} league={league} key={id} />
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          </Col>
        </Row>
        <style jsx>{`
          .wrapper {
            margin: 50px 0;
          }
        `}</style>
      </>
    );
  // Belongs to no league
  return (
    <>
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
      <style jsx>{`
        p {
          margin: 10px 0 30px;
        }
      `}</style>
    </>
  );
};

const filterMyLeagues = (
  uid: string | null,
  leagues: Object
): [string, League][] | null =>
  (uid &&
    leagues &&
    ((Object.entries(leagues): any): League[]).reduce(
      (accum, [key, value]) =>
        value.leagueUsers.includes(uid) ? [...accum, [key, value]] : accum,
      []
    )) ||
  null;

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
