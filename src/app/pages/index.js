// @flow

import React, { Component } from 'react';
import { Row, Col, Card, message } from 'antd';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';

type Props = {
  firestore: Object,
  router: Object
}

class Index extends Component<Props> {
  componentDidMount() {
    const { router: { query: { mode, oobCode } } } = this.props;

    if (mode === 'verifyEmail' && oobCode) {
      const closeMessage = message.loading('Verifying email..', 0);
      this.verifyEmail(oobCode, closeMessage);
    }

    // Add auth change listener

    // logged in and verified
    // route to draft chat
  }

  verifyEmail = async (oobCode: string, closeMessage: Function) => {
    const { firestore } = this.props;
    const auth = await firestore.auth();
    auth.applyActionCode(oobCode)
      .catch(({ code, message: errorMessage }) => {
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, message);
      }).then(() => {
        closeMessage();
      });
  }

  render() {
    return (
      <Layout>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <div className="wrapper">
              <Card>
                Placeholder card for Overwatch League Fantasy explanation
              </Card>
            </div>
          </Col>
        </Row>
        <style jsx>{`
          .wrapper {
            margin: 50px 0;
          }
        `}
        </style>
      </Layout>
    );
  }
}


export default compose(
  withRouter,
  withRedux(store),
  withFirestore(),
)(Index);
