// @flow

import React from "react";
import type { Role } from "../shared/roles";

type Props = {
  role: Role
};

export default ({ role }: Props) => (
  <div className="container">
    <div className="background" />
    <div className="headshot">
      {/* <img src={headshot} alt={name} title={name} /> */}
    </div>
    <div className="profile">{role}</div>
    <style jsx>{`
      .container {
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
      .headshot {
        transform: scale(1.5) skew(15deg) translate(-2px, 9px);
      }
      img {
        display: block;
        height: 150px;
      }
      .profile {
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
