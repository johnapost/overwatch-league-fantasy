// @flow

import React from "react";
import Layout from "../components/layout";
import LeaguesList from "../components/leaguesList";
import RosterGrid from "../components/rosterGrid";

export default () => (
  <Layout>
    <LeaguesList />
    <RosterGrid />
  </Layout>
);
