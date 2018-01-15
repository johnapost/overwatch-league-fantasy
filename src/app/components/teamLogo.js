// @flow

import React from 'react';

type Props = {
  team: 'BOS' | 'DAL' | 'FLA' | 'GLA' | 'HOU' | 'LDN' | 'NYE' | 'PHI' | 'SEO' |
    'SFS' | 'SHD' | 'VAL'
}

export default ({ team }: Props) => (
  <div>
    <img src={`static/${team}.svg`} alt={team} />
    <style jsx>{`
      img {
        height: 32px;
        width: 32px;
      }
    `}
    </style>
  </div>
);
