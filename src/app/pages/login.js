// @flow

import React, { Component } from 'react';
import { Row, Col, message } from 'antd';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import withRedux from 'next-redux-wrapper';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';
import LoginForm from '../components/loginForm';

type Props = {
  router: Object,
  firestore: Object
}

class Login extends Component<Props> {
  componentDidMount() {
    const { router: { query: { mode, oobCode } } } = this.props;

    if (mode === 'verifyEmail' && oobCode) {
      const closeMessage = message.loading('Verifying email..', 0);
      this.verifyEmail(oobCode, closeMessage);
    }
  }

  verifyEmail = async (oobCode: string, closeMessage: Function) => {
    const { firestore, router } = this.props;
    const auth = await firestore.auth();
    auth.applyActionCode(oobCode)
      .then(() => {
        closeMessage();
        router.push('/');
      })
      .catch(({ code, message: errorMessage }) => {
        closeMessage();
        message.error(errorMessage);
        // eslint-disable-next-line no-console
        console.error(code, message);
      });
  }

  render() {
    return (
      <Layout>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <div className="wrapper">
              <LoginForm />
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
)(Login);
