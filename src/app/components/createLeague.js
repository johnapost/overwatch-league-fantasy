// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Input, Form } from "antd";
import uuid from "uuid/v4";
import rosterSlots from "../shared/roster";
import withFirestore from "../shared/withFirestore";

import type { StoreState } from "../shared/makeStore";

type Props = {
  firestore: Object,
  form: Object,
  user: Object
};

type State = {
  checkingLeague: boolean
};

export class CreateLeagueComponent extends Component<Props, State> {
  state = {
    checkingLeague: false
  };

  checkLeague = () => {
    const {
      form: { getFieldsValue, setFields },
      firestore
    } = this.props;
    const { leagueName } = getFieldsValue();
    if (!leagueName) return;

    this.setState({ checkingLeague: true });
    firestore
      .get({
        collection: "leagues",
        where: [["name", "==", leagueName]]
      })
      .then(({ empty }) => {
        if (!empty) {
          setFields({
            leagueName: {
              value: leagueName,
              errors: [new Error(`${leagueName} is already taken!`)]
            }
          });
          this.setState({ checkingLeague: false });
          return;
        }
        setFields({
          leagueName: {
            value: leagueName,
            errors: null
          }
        });
        this.createLeague(leagueName);
      });
  };

  createLeague = (name: string) => {
    const {
      firestore,
      user: { uid }
    } = this.props;
    firestore.set(
      {
        collection: "leagues",
        doc: uuid()
      },
      {
        drafter: null,
        leagueUsers: [uid],
        name,
        ownerUser: uid,
        rosterSlots
      }
    );
  };

  render() {
    const { checkingLeague } = this.state;
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator("leagueName")(
            <Input
              placeholder="League name"
              onPressEnter={checkingLeague ? () => {} : this.checkLeague}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button disabled={checkingLeague} onClick={this.checkLeague}>
            Create a league
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export const mapStateToProps = ({ user }: StoreState) => ({ user });

export default compose(
  connect(mapStateToProps),
  withFirestore(),
  Form.create()
)(CreateLeagueComponent);
