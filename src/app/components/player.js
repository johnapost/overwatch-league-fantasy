// @flow

import React from 'react';

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
    <img src={headshot} alt={name} title={name} />
    <style jsx>{`
      .container {
        margin: 10px;
        max-width: 300px;
      }
    `}
    </style>
  </div>
);
