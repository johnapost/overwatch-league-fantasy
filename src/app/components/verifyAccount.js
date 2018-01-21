// @flow

import React from 'react';
import { Card, Button, message } from 'antd';

type Props = {
  currentUser?: {
    email: string,
    sendEmailVerification: () => Promise<*>
  }
}

const VerifyAccount = ({ currentUser }: Props) => (
  <Card title={currentUser && `Verify ${currentUser.email}`}>
    Your email hasn&#39;t been verified. Please verify it to proceed.
    <div style={{ marginTop: '10px' }}>
      <Button
        onClick={() => {
          if (currentUser) {
            currentUser.sendEmailVerification().then(() => {
              message.success('Email sent, check your inbox!');
            })
            .catch((error) => {
              message.error(error);
            });
          }
        }}
        disabled={!currentUser}
      >
        Send a verification email
      </Button>
    </div>
  </Card>
);

VerifyAccount.defaultProps = {
  currentUser: {
    email: '',
    sendEmailVerification: () => Promise.resolve(''),
  },
};

export default VerifyAccount;
