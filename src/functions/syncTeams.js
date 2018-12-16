// @flow

import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "axios";

const OVERWATCH_API = "https://api.overwatchleague.com/";

const db = firestore();
db.settings({ timestampsInSnapshots: true });

export default https.onRequest(async (req, res) => {
  const {
    data: { competitors }
  } = await get(`${OVERWATCH_API}teams`);

  try {
    await competitors.map(({ competitor }) =>
      db
        .collection("teams")
        .doc(String(competitor.id))
        .set(competitor)
    );
    await res.send("Teams synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing teams", error);
    await res.send(error);
  }
});
