// @flow

import React from "react";
import type { Role } from "../shared/roles";

type Props = {
  onClick: Function,
  role: Role
};

export default ({ onClick, role }: Props) => (
  <div className="container" onClick={onClick}>
    <div className="background" />
    <div className="image-container">
      <img src={`static/${role}.svg`} alt={role} title={role} />
    </div>
    <div className="role">{role}</div>
    <style jsx>{`
      .container {
        background: #000000;
        border: solid 5px #dddde3;
        height: 200px;
        margin: 5px;
        overflow: hidden;
        position: relative;
        transform: skew(-15deg);
        transition: border, transform 0.15s ease-out;
        width: 150px;
      }
      .container:hover {
        border: solid 5px #ffffff;
        transform: scale(1.3) skew(-15deg);
        z-index: 1;
      }
      .background {
        height: 200px;
        left: 0;
        position: absolute;
        top: 0;
        width: 150px;
      }
      img {
        display: block;
        height: 150px;
      }
      .role {
        background: #e8e8eb;
        color: #28354f;
        font-family: "BigNoodleToo";
        font-size: 1.5rem;
        text-align: center;
        text-transform: uppercase;
        transform: skew(15deg) translate(-14px, 7px);
        width: 160px;
      }
    `}</style>
  </div>
);
