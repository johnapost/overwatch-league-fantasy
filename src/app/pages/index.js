// @flow

import React, { Component } from 'react';
import { Row, Col, Spin, Card } from 'antd';
import withRedux from 'next-redux-wrapper';
import { isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import get from 'lodash/get';
import { withRouter } from 'next/router';
import store from '../shared/store';
import withFirestore from '../shared/withFirestore';
import Layout from '../components/layout';
import VerifyAccount from '../components/verifyAccount';

type Props = {
  firestore: Object,
  router: Object
}

type State = {
  renderVerify: boolean
}

class Index extends Component<Props, State> {
  state = {
    renderVerify: false,
  }

  // async componentWillMount() {
  //   const { firestore, router } = this.props;
  //   if (!isLoaded(firestore)) {
  //     return;
  //   }
  //
  //   const auth = await firestore.auth();
  //
  //   // Use auth state change listener to replace below code
  //   // https://firebase.google.com/docs/reference/node/firebase.auth.Auth#onAuthStateChanged
  //
  //   const currentUser = get(auth, 'currentUser');
  //
  //   // TODO: Fix race condition between currentUser and router.push()
  //   if (!currentUser) {
  //     router.push('/login');
  //   } else if (get(currentUser, 'emailVerified')) {
  //     router.push('/draft');
  //   } else {
  //     this.setState({ renderVerify: true });
  //   }
  // }

  renderCard = () => {
    const { firestore } = this.props;
    const loading = (
      <Card title="Loading..">
        <Spin />
      </Card>
    );

    if (!isLoaded(firestore)) {
      return loading;
    }

    if (this.state.renderVerify) {
      return <VerifyAccount />;
    }

    return loading;
  }

  render() {
    return (
      <Layout>
        <Row>
          <Col sm={6} md={4} />
          <Col sm={12} md={16}>
            <div className="wrapper">
              {this.renderCard()}
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
