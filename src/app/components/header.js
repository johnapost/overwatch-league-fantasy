// @flow

import React from "react";

type Props = {
  title: string
};

export default ({ title }: Props) => (
  <div>
    <div className="header">{title}</div>
    <style jsx>{`
      .header {
        font-family: "BigNoodleToo";
        font-size: 2rem;
      }
    `}</style>
  </div>
);
