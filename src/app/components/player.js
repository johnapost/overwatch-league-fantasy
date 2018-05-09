// @flow

import React from 'react';
import { Card } from 'antd';

type Props = {
  givenName: string,
  familyName: string,
  headshot: string,
  name: string,
  nationality: string,
  id: string,
  team: string
}

export default ({ headshot, name }: Props) => (
  <div className="container">
    <Card cover={<img src={headshot} alt={name} />} />
    <style jsx>{`
      .container {
        max-width: 300px;
      }
    `}
    </style>
  </div>
);
