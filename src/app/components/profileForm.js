// @flow

import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { compose } from "redux";
import { isLoaded } from "react-redux-firebase";
import withFirestore from "../shared/withFirestore";
import hasErrors from "../shared/hasErrors";

type Props = {
  displayName: string,
  firestore: Object,
  form: Object,
  hideProfileModal: Function,
  uid: string
};

class ProfileForm extends Component<Props> {
  handleSubmit = e => {
    e.preventDefault();
    const {
      firestore,
      form: { validateFields },
      hideProfileModal,
      uid
    } = this.props;

    if (!isLoaded(firestore)) {
      return;
    }

    const closeMessage = message.loading("Updating display name..", 0);

    const finishSubmitting = () => {
      closeMessage();
      hideProfileModal();
    };

    validateFields((err, { displayName }) => {
      if (err) {
        finishSubmitting();
        return;
      }

      firestore
        .update(
          {
            collection: "users",
            doc: uid
          },
          {
            displayName
          }
        )
        .then(() => {
          finishSubmitting();
          message.success("Successfully updated display name!");
        });
    });
  };

  render() {
    const {
      displayName,
      form: { getFieldDecorator, getFieldsError }
    } = this.props;
    const displayNameValidations = [{ required: true }, { min: 3 }];

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator("displayName", {
            rules: displayNameValidations,
            initialValue: displayName
          })(<Input placeholder="Display name" />)}
        </Form.Item>
        <div style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default compose(withFirestore(), Form.create())(ProfileForm);
