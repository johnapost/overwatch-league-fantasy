// @flow

import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "axios";
import { PLAYER_API } from "./endpoints";

export default https.onRequest(async (req, res) => {
  const db = firestore();
  const {
    data: { data }
  } = await get(PLAYER_API);

  try {
    const batch = db.batch();
    data.forEach(player => {
      const playerRef = db.collection("players").doc(String(player.playerId));
      // Sync player data
      batch.set(playerRef, { latestStats: player }, { merge: true });
    });
    await batch.commit();
    await res.send("Player data synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing player data", error);
    await res.send(error);
  }
});
