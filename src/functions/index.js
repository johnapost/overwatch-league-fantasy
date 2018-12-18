// @flow

import { firestore } from "firebase-admin";
import nextApp from "./nextApp";
import syncTeams from "./syncTeams";
import syncPlayers from "./syncPlayers";

const db = firestore();
db.settings({ timestampsInSnapshots: true });

export { nextApp, syncTeams, syncPlayers };
