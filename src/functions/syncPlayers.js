// @flow

import { https } from "firebase-functions";
import { firestore } from "firebase-admin";
import { get } from "axios";
import { PLAYER_API } from "./endpoints";
import getStage from "./shared/getStage";
import getWeek from "./shared/getWeek";

export default https.onRequest(async (req, res) => {
  const db = firestore();
  const {
    data: { data }
  } = await get(PLAYER_API);

  try {
    const date = new Date();
    const now = date.getTime();
    const season = date.getFullYear();
    const stage = getStage(now, season);
    if (stage === null) throw new Error("No stage found! Can't save stats!");
    const week = getWeek(now, season, stage);
    if (week === null) throw new Error("No week found! Can't save stats!");

    const batch = db.batch();
    data.forEach(playerStats => {
      const { playerId } = playerStats;
      const playerRef = db.collection("players").doc(String(playerId));
      const runningStatsRef = db
        .collection("runningStats")
        .doc(`${playerId}-${season}-${stage}-${week}`);
      // Sync player data
      batch.set(playerRef, { latestStats: playerStats }, { merge: true });
      // Sync runningStats data
      batch.set(
        runningStatsRef,
        { season, stage, week, stats: playerStats },
        { merge: true }
      );
    });
    await batch.commit();
    await res.send("Player data synced!");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error syncing player data", error);
    await res.send(error);
  }
});
