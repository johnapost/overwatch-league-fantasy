// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { isLoaded } from 'react-redux-firebase';

type Props = {
  firestore: Object
}

const Auth = ({ firestore }: Props) => (
  <Card>
    {
      isLoaded(firestore) && 'Login here!'
    }
  </Card>
);

const mapStateToProps = ({ firestore }) => ({ firestore });

export default connect(mapStateToProps, () => ({}))(Auth);
