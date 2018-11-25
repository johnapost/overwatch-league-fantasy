// @flow

import React from "react";
import type { Role } from "../shared/roles";

type Props = {
  role: Role
};

export default ({ role }: Props) => <div>{role}</div>;
