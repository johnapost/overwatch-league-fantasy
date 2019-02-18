// @flow

import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "axios";
import { PLAYER_API } from "./endpoints";
import getWeek from "./shared/getWeek";

const season = "2019";
const stage = 0;

export default https.onRequest(async (req, res) => {
  const db = firestore();
  const {
    data: { data }
  } = await get(PLAYER_API);

  try {
    const batch = db.batch();
    const week = getWeek(Date.now(), season, stage);
    if (week === null) throw new Error("No week found! Can't save stats!");
    data.forEach(player => {
      const { playerId } = player;
      const playerRef = db.collection("players").doc(String(playerId));
      const runningStatsRef = db
        .collection("runningStats")
        .doc(`${playerId}-${season}-${stage}-${week}`);
      // Sync player data
      batch.set(playerRef, { latestStats: player }, { merge: true });
      // Sync runningStats data
      batch.set(runningStatsRef, player, { merge: true });
    });
    await batch.commit();
    await res.send("Player data synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing player data", error);
    await res.send(error);
  }
});
