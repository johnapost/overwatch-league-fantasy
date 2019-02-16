// @flow

import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "axios";
import { TEAM_API } from "./endpoints";

export default https.onRequest(async (req, res) => {
  const db = firestore();
  const {
    data: { competitors }
  } = await get(TEAM_API);

  try {
    const batch = db.batch();
    competitors.forEach(({ competitor }) => {
      const teamRef = db.collection("teams").doc(String(competitor.id));
      // Sync team data
      batch.set(teamRef, competitor);

      competitor.players.forEach(({ player }) => {
        const playerRef = db.collection("players").doc(String(player.id));
        // Sync team's player data
        batch.set(
          playerRef,
          { ...player, teamId: competitor.id },
          { merge: true }
        );
      });
    });
    await batch.commit();
    await res.send("Teams synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing team data", error);
    await res.send(error);
  }
});
