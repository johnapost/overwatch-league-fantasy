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
    const batch = db.batch();
    competitors.forEach(({ competitor }) => {
      const teamRef = db.collection("teams").doc(String(competitor.id));
      // Sync team data
      batch.set(teamRef, competitor);

      competitor.players.forEach(({ player }) => {
        const playerRef = db.collection("players").doc(String(player.id));
        // Sync individual player data
        batch.set(playerRef, { ...player, teamId: competitor.id });
      });
    });
    await batch.commit();
    await res.send("Teams synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing teams", error);
    await res.send(error);
  }
});
