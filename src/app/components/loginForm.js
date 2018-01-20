// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { isLoaded } from 'react-redux-firebase';
import SignUpForm from './signUpForm';

type Props = {
  firestore: Object
}

const Auth = ({ firestore }: Props) => (
  <Card>
    {
      isLoaded(firestore) &&
      <SignUpForm />
    }
  </Card>
);

const mapStateToProps = ({ firestore }) => ({ firestore });

export default connect(
  mapStateToProps,
  () => ({}),
)(Auth);
